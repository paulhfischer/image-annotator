import { Vector } from 'src/components/Annotation/Connector/common/utils';
import { AnnotationOrientationType, AnnotationTypeType } from 'src/types';
import {
    parseAngle,
    parseMarkdownLink,
    parseOrientation,
    parseString,
    parseType,
    parseVector,
} from './utils';

export type AnnotationType = {
    id: string | undefined;
    label: string | undefined;
    nodes: Vector[];
    endNode: Vector | undefined;
    angle: number | undefined;
    orientation: AnnotationOrientationType;
    type: AnnotationTypeType;
};

const TABLE_HEADER = ['id', 'label', 'nodes', 'end_node', 'angle', 'orientation', 'type'];

const validateHeader = (value: string[]): void => {
    if (value.length !== 7 || TABLE_HEADER.some((header, index) => header !== value[index])) {
        throw new Error('invalid header!');
    }
};

const parseRow = (value: string[]): AnnotationType => {
    if (value.length !== 7) throw new Error('invalid row!');

    return {
        id: parseString(value[0]),
        label: parseMarkdownLink(value[1]),
        nodes: value[2].split('<br>').map(parseVector).filter(Boolean) as Exclude<
            ReturnType<typeof parseVector>,
            undefined
        >[],
        endNode: parseVector(value[3]),
        angle: parseAngle(value[4]),
        orientation: parseOrientation(value[5]),
        type: parseType(value[6]),
    };
};

const parseEntry = (value: AnnotationType): string[] => {
    return [
        value.id,
        `[[${value.label}]]`,
        value.nodes.map((node) => `(${node.x}, ${node.y})`).join('<br>'),
        value.endNode ? `(${value.endNode.x}, ${value.endNode.y})` : undefined,
        value.angle ? value.angle : undefined,
        value.orientation,
        value.type,
    ].map((entry) => (entry === undefined ? '' : entry.toString()));
};

export const markdownTableToAnnotations = (value: string): AnnotationType[] => {
    const rows = value
        .split('\n')
        .map((row) =>
            row
                .split(/\|(?![^[]*\])/)
                .slice(1, -1)
                .map((cell) => cell.trim()),
        )
        .filter((row) => !row.every((cell) => cell === ''));

    validateHeader(rows[0]);

    return rows.slice(2).map(parseRow);
};

export const annotationsToMarkdownTable = (value: AnnotationType[]): string => {
    const data = [
        TABLE_HEADER,
        Array.from({ length: TABLE_HEADER.length }, () => '----'),
        ...value.map(parseEntry),
    ];

    return data.map((row) => `| ${row.join(' | ')} |`).join('\n');
};
