import React, { useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import '../a.2/CreateNewEmployee.css';
import NavBar from '../../../Bars/Nav/NavBar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid } from '@material-ui/core';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import EmailIcon from '@material-ui/icons/Email';
import EditMenu from "./EditMenu";
import Notification from "../../../Common/Notification";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";

const SingleEmployee = () => {

    let location = useLocation();
    let history = useHistory();

    const { id } = useParams();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    let reset = localStorage.getItem("reset-info");
    let newUser = localStorage.getItem("new-user-info");

    // const [roles, setRoles] = useState("Admin");
    // const [userId, setUserId] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState(0);
    const [status, setStatus] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState();

    async function getSingleUser() {
        let result = await fetch(APIURL(ENDPIONTS.USER) + "GetSingleUser?EmployeeId=" + id, {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();

        if (result.httpStatus === 200) {
            setFirstName(result.result[0].firstName);
            setLastName(result.result[0].lastName);
            setEmail(result.result[0].email);
            setPhoneNumber(result.result[0].phoneNumber);
            setRole(result.result[0].role);
            setStatus(result.result[0].status);
        }
    }

    useEffect(() => {
        getSingleUser();
        if (typeof location.state !== 'undefined' && location.state.from.toLowerCase().includes('/usermanager/edit')) {
            setNotify({
                isOpen: true,
                message: 'Your changes have been saved',
                type: 'info'
            })
        }
        if (reset === "reset is done") {
            setNotify({
                isOpen: true,
                message: 'Reset Password Successful',
                type: 'info'
            })
            localStorage.removeItem('reset-info');
        }
        if (newUser === "new user added successfully") {
            setNotify({
                isOpen: true,
                message: 'User successfully created',
                type: 'info'
            })
            localStorage.removeItem('new-user-info');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function redirectFunction() {
        history.push("/usermanager/")
    }

    function CostumeLabel(props) {
        if (props.status === true)
            return null;

        else if (props.status === 'Active')
            return <label style={{
                border: "2px solid #52C41A",
                backgroundColor: "#F7FFF0",
                borderRadius: "4px",
                padding: "3px 7px",
                fontWeight: "400",
                color: "#52C41A"
            }}>
                {props.status}
            </label>
        else
            return <label style={{
                border: "2px solid #FFA39E",
                backgroundColor: "#FFF1F0",
                borderRadius: "4px",
                padding: "3px 7px",
                fontWeight: "400",
                color: "#E56969"
            }}> {props.status}
            </label>
    }
    return (
        <>
            <NavBar />

            <div className="col-sm-12" style={{
                height: "140px",
                display: "table-cell",
                verticalAlign: "middle",
                width: "1%",
                paddingLeft: "30px",
                backgroundColor: "white",
                paddingTop: "50px"
            }}>
                <div>
                    <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>User Management /</label>
                    <label>  {id} </label>
                </div>

                <div>
                    <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                        onClick={redirectFunction} />
                    <label style={{ fontWeight: "500", fontSize: "20px" }}>{id}</label>
                    {/* <button className="saveButton" onClick={handleCreate}> Create </button> */}
                    <EditMenu employeeId={id} status={status} />
                </div>
            </div>

            <div className="myContainer">
                <Grid item lg={12} xs={6} container spacing={2}>
                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle">Account Info</label> <br />
                        <label className="subTitle">Employee ID</label><br />
                        <label className="apiReceivedLabels">{id}</label><br />
                        <br />
                        <label className="subTitle">Status</label> <br />
                        <CostumeLabel status={status} />
                        {/* <label className="subTitle">Password</label><br />
                        <label className="apiReceivedLabels">{password}</label><br /> */}
                    </Grid>

                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle"></label> <br />
                        <br />
                        <label className="subTitle">Role</label><br />
                        <label className="apiReceivedLabels">{role}</label><br /> <br />
                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle">Contact Info</label> <br />
                        <label className="subTitle">First Name</label><br />
                        <label className="apiReceivedLabels">{firstName}</label><br /><br />
                        <br />
                        <PhoneInTalkIcon style={{ color: "#8AC240", marginRight: "10px" }} />
                        <label className="apiReceivedLabels">{phoneNumber}</label><br />

                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle"></label> <br /> <br />
                        <label className="subTitle">Last Name</label><br />
                        <label className="apiReceivedLabels">{lastName}</label><br /> <br />
                        <br />
                        <EmailIcon style={{ color: "#8AC240", marginRight: "10px" }} />
                        <label className="apiReceivedLabels">{email}</label><br />
                        <br />
                    </Grid>
                </Grid>
            </div>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    );
}

export default SingleEmployee;