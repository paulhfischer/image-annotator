export type AnnotationOrientationType = 'top' | 'right' | 'bottom' | 'left';

export type AnnotationTypeType = 'dot' | 'arrow' | 'brace';

export type VectorType = {
    x: number;
    y: number;
};

// export type DotAnnotationType =
//     | {
//           id: string;
//           label: string;
//           nodes: VectorType[];
//           connectionNode: VectorType | undefined;
//           angle: undefined;
//           orientation: 'top' | 'right' | 'bottom' | 'left';
//           type: 'dot';
//       }
//     | {
//           id: string;
//           label: string;
//           nodes: [VectorType];
//           connectionNode: undefined;
//           angle: number;
//           orientation: 'top' | 'right' | 'bottom' | 'left';
//           type: 'dot';
//       };

// export type ArrowAnnotationType =
//     | {
//           id: string;
//           label: string;
//           nodes: VectorType[];
//           connectionNode: VectorType | undefined;
//           angle: undefined;
//           orientation: 'top' | 'right' | 'bottom' | 'left';
//           type: 'arrow';
//       }
//     | {
//           id: string;
//           label: string;
//           nodes: [VectorType];
//           connectionNode: undefined;
//           angle: number;
//           orientation: 'top' | 'right' | 'bottom' | 'left';
//           type: 'arrow';
//       };

// export type BraceAnnotationType = {
//     id: string;
//     label: string;
//     nodes: [VectorType, VectorType];
//     orientation: 'top' | 'right' | 'bottom' | 'left';
//     type: 'brace';
// };

// export type AnnotationType = DotAnnotationType | ArrowAnnotationType | BraceAnnotationType;
