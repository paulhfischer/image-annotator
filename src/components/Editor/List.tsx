import {
    FlatTree,
    FlatTreeItem,
    TreeItemLayout,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import { ArrowFlowUpRightFilled, ArrowFlowUpRightRegular, bundleIcon } from '@fluentui/react-icons';
import React, { ReactNode } from 'react';
import { AnnotationType } from 'src/io/annotations';

const AnnotationIcon = bundleIcon(ArrowFlowUpRightFilled, ArrowFlowUpRightRegular);

const useStyles = makeStyles({
    list: {
        height: '100%',
        width: '200px',
    },
    activeTab: {
        color: tokens.colorNeutralForeground2Hover,
        backgroundColor: tokens.colorSubtleBackgroundHover,
    },
    inactiveTab: {},
    activeIcon: {
        color: tokens.colorNeutralForeground2Hover,
    },
    inactiveIcon: {},
});

interface ListProps {
    annotations: AnnotationType[];
    annotationIndex: number | undefined;
    setAnnotationIndex: (annotationIndex: number) => void;
}

function List({ annotations, annotationIndex, setAnnotationIndex }: ListProps): ReactNode {
    const classes = useStyles();

    return (
        <div className={classes.list}>
            <FlatTree
                size="small"
                aria-label="annotation-list"
                onOpenChange={(event, data) => {
                    setAnnotationIndex(Number(data.value));
                }}
            >
                {annotations.map((annotation, index) => (
                    <FlatTreeItem
                        key={index} // eslint-disable-line react/no-array-index-key
                        value={index}
                        itemType="branch"
                        aria-level={1}
                        aria-setsize={annotations.length}
                        aria-posinset={index + 1}
                        className={
                            index === annotationIndex ? classes.activeTab : classes.inactiveTab
                        }
                    >
                        <TreeItemLayout
                            expandIcon={
                                <AnnotationIcon
                                    className={
                                        index === annotationIndex
                                            ? classes.activeIcon
                                            : classes.inactiveIcon
                                    }
                                />
                            }
                        >
                            {annotation.label}
                        </TreeItemLayout>
                    </FlatTreeItem>
                ))}
            </FlatTree>
        </div>
    );
}

export default List;
