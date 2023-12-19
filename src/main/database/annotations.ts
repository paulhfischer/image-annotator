import { AnnotationType, NewAnnotationType } from '@common/types';
import { getEndNodes, getNodes, getSpecialNode } from '@common/utils';
import {
    createNodeInDB,
    deleteNodeInDB,
    fetchNodeFromDB,
    fetchNodesFromDB,
    updateNodeInDB,
} from './nodes';
import { queryDB, runDB } from './utils';

type AnnotationDBType = {
    id: number;
    uid: string;
    type: string;
    label: string;
    label_position: string;
    image: number;
    special_node: number | null;
    permanent: number;
    tip: string;
};

const getUniqueAnnotationID = async (): Promise<string> => {
    const id = Math.random().toString(36).slice(-8);

    const result = await queryDB<{ count: number }>(
        `SELECT COUNT(*) as count FROM annotations WHERE uid = ?`,
        [id],
    );

    if (result[0].count === 0) {
        return id;
    }
    return getUniqueAnnotationID();
};

const entryToType = async (entry: AnnotationDBType): Promise<AnnotationType> => {
    if (
        entry.label_position !== 'top' &&
        entry.label_position !== 'right' &&
        entry.label_position !== 'bottom' &&
        entry.label_position !== 'left'
    ) {
        throw new Error();
    }

    if (entry.tip !== 'circle' && entry.tip !== 'arrow') {
        throw new Error();
    }

    const specialNode =
        entry.special_node === null ? undefined : await fetchNodeFromDB(entry.special_node);
    const nodes = (await fetchNodesFromDB(entry.id)).filter((node) => node.id !== specialNode?.id);

    switch (entry.type) {
        case 'line': {
            return {
                id: entry.id,
                uid: entry.uid,
                type: entry.type,
                label: entry.label,
                labelPosition: entry.label_position,
                endNodes: nodes,
                connectionNode: specialNode,
                permanent: !!entry.permanent,
                tipType: entry.tip,
            };
        }
        case 'brace': {
            if (nodes.length !== 2) throw new Error();

            return {
                id: entry.id,
                uid: entry.uid,
                type: entry.type,
                label: entry.label,
                labelPosition: entry.label_position,
                nodeA: nodes[0],
                connectionNode: specialNode,
                nodeB: nodes[1],
                permanent: !!entry.permanent,
                tipType: entry.tip,
            };
        }
        default: {
            throw new Error();
        }
    }
};

export const fetchAnnotationFromDB = async (annotationID: number): Promise<AnnotationType> => {
    const annotationsResult = await queryDB<AnnotationDBType>(
        `SELECT * FROM annotations WHERE id = ?`,
        [annotationID],
    );

    if (annotationsResult.length !== 1) throw new Error();

    return entryToType(annotationsResult[0]);
};

export const fetchAnnotationsFromDB = async (imageID: number): Promise<AnnotationType[]> => {
    const annotationsResult = await queryDB<AnnotationDBType>(
        `SELECT * FROM annotations WHERE image = ?`,
        [imageID],
    );

    return Promise.all(annotationsResult.map((entry) => entryToType(entry)));
};

export const createAnnotationInDB = async (
    annotation: NewAnnotationType,
    imageID: number,
): Promise<AnnotationType> => {
    const result = await runDB(
        `INSERT INTO annotations (uid, type, label, label_position, image, permanent, tip) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            await getUniqueAnnotationID(),
            annotation.type,
            '',
            annotation.labelPosition,
            imageID,
            false,
            'circle',
        ],
    );

    const annotationID = result.lastID;

    if (getSpecialNode(annotation)) {
        const specialNode = await createNodeInDB(getSpecialNode(annotation), annotationID);

        await runDB(`UPDATE annotations SET special_node = ? WHERE id = ?`, [
            specialNode.id,
            annotationID,
        ]);
    }

    await Promise.all(getEndNodes(annotation).map((node) => createNodeInDB(node, annotationID)));

    return fetchAnnotationFromDB(result.lastID);
};

export const updateAnnotationInDB = async (annotation: AnnotationType): Promise<AnnotationType> => {
    const oldNodes = await fetchNodesFromDB(annotation.id);
    const newNodes = getNodes(annotation);

    const removedNodes = oldNodes.filter(
        (existingNode) => !newNodes.some((newNode) => existingNode.id === newNode.id),
    );

    await Promise.all(newNodes.map((node) => updateNodeInDB(node)));
    await Promise.all(removedNodes.map((node) => deleteNodeInDB(node)));

    await runDB(
        `UPDATE annotations SET uid = ?, type = ?, label = ?, label_position = ?, special_node = ?, permanent = ?, tip = ? WHERE id = ?`,
        [
            annotation.uid,
            annotation.type,
            annotation.label,
            annotation.labelPosition,
            getSpecialNode(annotation) ? getSpecialNode(annotation).id : null,
            annotation.permanent,
            annotation.tipType,
            annotation.id,
        ],
    );

    return fetchAnnotationFromDB(annotation.id);
};

export const deleteAnnotationInDB = async (annotation: AnnotationType): Promise<void> => {
    await runDB(`DELETE FROM annotations WHERE id = ?`, [annotation.id]);

    await Promise.all(getNodes(annotation).map((node) => deleteNodeInDB(node)));
};
