import { NewNodeType, NodeType } from '@common/types';
import { queryDB, runDB } from './utils';

type NodeDBType = {
    id: number;
    annotation: number;
    x: number;
    y: number;
};

const entryToType = (entry: NodeDBType): NodeType => {
    return {
        id: entry.id,
        x: entry.x,
        y: entry.y,
    };
};

export const fetchNodeFromDB = async (nodeID: number): Promise<NodeType> => {
    const nodesResult = await queryDB<NodeDBType>(`SELECT * FROM nodes WHERE id = ?`, [nodeID]);

    if (nodesResult.length !== 1) throw new Error();

    return entryToType(nodesResult[0]);
};

export const fetchNodesFromDB = async (annotationID: number): Promise<NodeType[]> => {
    const nodesResult = await queryDB<NodeDBType>(`SELECT * FROM nodes WHERE annotation = ?`, [
        annotationID,
    ]);

    return Promise.all(nodesResult.map((entry) => entryToType(entry)));
};

export const createNodeInDB = async (
    node: NewNodeType,
    annotationID: number,
): Promise<NodeType> => {
    const result = await runDB(`INSERT INTO nodes (annotation, x, y) VALUES (?, ?, ?)`, [
        annotationID,
        node.x,
        node.y,
    ]);

    return fetchNodeFromDB(result.lastID);
};

export const updateNodeInDB = async (node: NodeType): Promise<NodeType> => {
    await runDB(`UPDATE nodes SET x = ?, y = ? WHERE id = ?`, [node.x, node.y, node.id]);

    return fetchNodeFromDB(node.id);
};

export const deleteNodeInDB = async (node: NodeType): Promise<void> => {
    await runDB(`DELETE FROM nodes WHERE id = ?`, [node.id]);
};
