import React, { ReactElement } from 'react';
import BraceConnector, { BraceConnectorProps } from './BraceConnector';
import LineConnector, { LineConnectorProps } from './LineConnector';

type ConnectorProps =
    | (LineConnectorProps & { type: 'line' })
    | (BraceConnectorProps & { type: 'brace' });

function Connector(connector: ConnectorProps): ReactElement {
    const { type, labelPosition, lineWidth, color, labelOrientation, fontSize, endMarker } =
        connector;

    switch (type) {
        case 'line': {
            const { endNodes, connectionNode, startMarker } = connector;

            return (
                <LineConnector
                    endNodes={endNodes}
                    connectionNode={connectionNode}
                    labelPosition={labelPosition}
                    lineWidth={lineWidth}
                    color={color}
                    labelOrientation={labelOrientation}
                    fontSize={fontSize}
                    startMarker={startMarker}
                    endMarker={endMarker}
                />
            );
        }
        case 'brace': {
            const { orientation, pointA, pointB, connectionNode } = connector;

            return (
                <BraceConnector
                    pointA={pointA}
                    connectionNode={connectionNode}
                    pointB={pointB}
                    labelPosition={labelPosition}
                    orientation={orientation}
                    lineWidth={lineWidth}
                    color={color}
                    labelOrientation={labelOrientation}
                    fontSize={fontSize}
                    endMarker={endMarker}
                />
            );
        }
        default:
            throw new Error();
    }
}

export default Connector;
