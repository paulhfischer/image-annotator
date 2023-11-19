export type NewImageType = {
    name: string;
    cleanContent: string;
    width: number;
    height: number;
};
export type ImageType = {
    id: number;
    uid: string;
    meta: {
        width: number;
        height: number;
        cleanContent: string;
        annotatedContent?: string;
    };
    name: string;
    annotationSize: 'small' | 'medium' | 'large';
    annotations: AnnotationType[];
};

export type NewAnnotationType =
    | {
          type: 'line';
          labelPosition: 'top' | 'right' | 'bottom' | 'left';
          endNodes: NewNodeType[];
          connectionNode?: NewNodeType;
      }
    | {
          type: 'brace';
          labelPosition: 'top' | 'right' | 'bottom' | 'left';
          nodeA: NewNodeType;
          tip?: NewNodeType;
          nodeB: NewNodeType;
      };
export type AnnotationType =
    | {
          id: number;
          uid: string;
          type: 'line';
          label: string;
          labelPosition: 'top' | 'right' | 'bottom' | 'left';
          endNodes: NodeType[];
          connectionNode?: NodeType;
          permanent: boolean;
      }
    | {
          id: number;
          uid: string;
          type: 'brace';
          label: string;
          labelPosition: 'top' | 'right' | 'bottom' | 'left';
          nodeA: NodeType;
          tip?: NodeType;
          nodeB: NodeType;
          permanent: boolean;
      };

export type NewNodeType = {
    x: number;
    y: number;
};
export type NodeType = {
    id: number;
    x: number;
    y: number;
};
