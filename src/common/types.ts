export type PointType = {
    x: number;
    y: number;
};

export type NewImageType = {
    name: string;
    content: string;
    width: number;
    height: number;
};
export type ImageType = {
    id: number;
    uid: string;
    meta: {
        width: number;
        height: number;
        content: string;
    };
    name: string;
    annotations: AnnotationType[];
    group: string;
};

export type BraceAnnotationType = {
    id: number;
    type: 'brace';
    tips: [PointType, PointType];
    text: string;
    disabled: boolean;
};

export type SingleConnectorAnnotationType = {
    id: number;
    type: 'single-connector';

    text: string;
    tip: PointType;
    angle: number;
    style: 'arrow' | 'circle';
    disabled: boolean;
};

export type MultiConnectorAnnotationType = {
    id: number;
    type: 'multi-connector';

    text: string;
    tips: PointType[];
    connectionPoint: PointType;
    style: 'arrow' | 'circle';
    disabled: boolean;
};

export type AnnotationType =
    | SingleConnectorAnnotationType
    | MultiConnectorAnnotationType
    | BraceAnnotationType;
