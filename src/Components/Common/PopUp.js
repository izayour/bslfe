import React from 'react'
import { Dialog, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: 0,
        position: 'absolute',
        top: theme.spacing(5),
        fontFamily: "Roboto"
    }
}))

export default function PopUp(props) {

    const { children, openPopup } = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
            {children}
        </Dialog>
    )
}
