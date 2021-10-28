import React from 'react'
import { Snackbar, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    root: {
        top: theme.spacing(9),
    }
}))

export default function Notification(props) {

    const { notify, setNotify } = props;
    const classes = useStyles()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotify({
            ...notify,
            isOpen: false
        })
    }

    return (
        <Snackbar
            className={classes.root}
            open={notify.isOpen}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleClose}>
            
            <Alert
                className="notificationAlert"
                severity={notify.type}
                // onClose={handleClose}
                style={{
                    backgroundColor: "#E4F6EF",
                    border: "1px solid #3EA279",
                    fontFamily: "Roboto"
                }}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}
