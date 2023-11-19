import { makeStyles } from '@fluentui/react-components';
import React, { ReactElement } from 'react';
import AnnotationEdit from './AnnotationEdit';
import AnnotationList from './AnnotationList';
import ImageEdit from './ImageEdit';
import ImageList from './ImageList';
import ImageViewer from './ImageViewer';
import Menu from './Menu';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100vh',
    },
    leftBar: {
        width: '300px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        height: '100%',
        display: 'flex',
        flexGrow: '1',
        flexShrink: 1,
        flexBasis: '0%',
        flexDirection: 'column',
    },
    rightBar: {
        width: '300px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

function App(): ReactElement {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.leftBar}>
                <ImageList />
                <ImageEdit />
            </div>
            <div className={classes.main}>
                <Menu />
                <ImageViewer />
            </div>
            <div className={classes.rightBar}>
                <AnnotationList />
                <AnnotationEdit />
            </div>
        </div>
    );
}

export default App;
