import React, { useState } from "react";
import "./singleUser.css";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { ReactComponent as EditIcon } from "../../../../Icons/editIcon.svg";
import { ReactComponent as ResetPassIcon } from "../../../../Icons/passResetIcon.svg";
import { ReactComponent as DisableUserIcon } from "../../../../Icons/disableUser.svg";
import { ReactComponent as EnableUserIcon } from "../../../../Icons/enableUser.svg";
// import { ReactComponent as MenuIcon } from "../../../../Icons/menuIcon.svg";
import ConfirmDialog from "../../../Common/ConfirmDialog";
import PopUp from "../../../Common/PopUp";
import ResetPassword from "../a.7/ResetPassword";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";

const EditMenu = (props) => {

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [editClick, setEditClick] = useState("#")
    const [openPopup, setOpenPopup] = useState(false)

    function handleEditClick() {
        setEditClick("/usermanager/Edit/" + props.employeeId)
    }

    async function ChangeUserStatus(state) {
        let result = await fetch(APIURL(ENDPIONTS.USER) +"UpdateStatus/" + props.employeeId
            + "?status=" + state
            , { method: 'PUT' }
        );
        result = await result.json();
        console.log(result)
        if (result.httpStatus === 200)
            window.location.reload();
    }

    function CustomLiItem() {
        if (props.status === 'Active')
            return (<li className="secondLevelli">
                <a className="secondLevela" onClick={() =>
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to disable user ' + props.employeeId + '?',
                        subTitle: "They will be locked out of their account.",
                        colors: "#E56969",
                        onConfirm: () => { ChangeUserStatus(false) }
                    })} >
                    <DisableUserIcon style={{
                        width: "21px", height: "21px",
                        marginLeft: "13px",
                        marginRight: "10px"
                    }} />
                    <label className="dropDownLabel" style={{ color: "#E56969" }}>Disable User</label>
                </a>
            </li>)

        else
            return (<li className="secondLevelli">
                <a className="secondLevela" onClick={() =>
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to enable user ' + props.employeeId + '?',
                        subTitle: "They will have full access to their account.",
                        colors: "#8AC240",
                        onConfirm: () => { ChangeUserStatus(true) }
                    })} >
                    <EnableUserIcon style={{
                        width: "21px", height: "21px",
                        marginLeft: "13px",
                        marginRight: "10px"
                    }} />
                    <label className="dropDownLabel" style={{ color: "#8AC240" }}>Enable User</label>
                </a>
            </li>)
    }

    return (
        <>
            <nav className="main-navigation">
                <ul className="firstLevelul">
                    <li className="firstLevelli">
                        <a className="firstLevela">
                            <MoreHorizIcon className="editDropDownIcon" />
                        </a>
                        <ul className="secondLevelul">
                            <li className="secondLevelli">
                                <a className="secondLevela" href={editClick} onClick={handleEditClick}>
                                    <EditIcon className="dropDownIcon" style={{
                                        // marginTop: "10px", marginLeft: "10px"
                                    }} />
                                    <label className="dropDownLabel">Edit</label>
                                </a>
                            </li>
                            <li className="secondLevelli">
                                <a className="secondLevela">
                                    <ResetPassIcon className="dropDownIcon" style={{
                                        // margin:"10px"
                                    }} />
                                    <label className="dropDownLabel" onClick={() => setOpenPopup(true)}>Reset Password</label>
                                </a>
                            </li>
                            <CustomLiItem />
                        </ul>
                    </li>
                </ul>
            </nav>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <PopUp
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <ResetPassword cancel={() => setOpenPopup(false)} employeeId={props.employeeId} />
            </PopUp>
        </>
    );
}

export default EditMenu;