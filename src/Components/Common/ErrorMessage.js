import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, makeStyles, IconButton } from '@material-ui/core'
import Controls from "../../Controls/Controls";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(1),
        position: 'fixed',
        top: theme.spacing(5),
        fontFamily: "Roboto",
    }
}))

export default function ErrorMessage(props) {

    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles()

    return (
        <Dialog open={confirmDialog.isOpen} className={classes.dialog}>
            <DialogTitle style={{
                borderRadius: "0px",
                paddingTop: "30px",
                paddingRight: "30px",
                paddingLeft: "30px",
                paddingBottom: "0px"
            }}>
                <ErrorOutlineIcon style={{ color: confirmDialog.colors }} />
                <h5 style={{
                    padding: "10px",
                    display: "unset",
                    fontWeight: "700",
                }}> {confirmDialog.title} </h5>
            </DialogTitle>

            <DialogContent>
                <Typography variant="subtitle2" style={{
                    fontWeight: "400",
                    paddingLeft: "44px"
                }}>
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>

            <DialogActions style={{
                paddingBottom: "25px"
            }} >
                <Controls.Button style={{
                    width: "50px",
                    backgroundColor: confirmDialog.colors,
                    color: "white"
                }}
                    text="Ok"
                    color="default"
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
            </DialogActions>
        </Dialog>
    )
}
