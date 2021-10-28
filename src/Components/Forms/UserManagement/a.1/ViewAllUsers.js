import React from "react";
import NavBar from "../../../Bars/Nav/NavBar";
import './ViewAllUsers.css';
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import ViewAllUsersTable from "./ViewAllUsersTable";
import { useHistory } from "react-router-dom";

const ViewAllUsers = () => {

    let history = useHistory();

    function clickEvent() {
        history.push("/usermanager/CreateEmployee")
    }
    return (
        <>
            <NavBar />

            <div className="col-sm-12" style={{
                height: "120px",
                display: "table-cell",
                verticalAlign: "middle",
                width: "1%",
                paddingLeft: "30px",
                backgroundColor: "white",
                // position: "absolute",
                paddingTop: "50px"
            }}>
                <label style={{ fontWeight: "800", fontFamily: "Roboto" }}>User Management</label>
                <button className="createEmp" onClick={clickEvent}>
                    <AddBoxTwoToneIcon style={{ color: "white", fontWeight: "10px" }} />
                    {"      Create Employee"}
                </button>
            </div>

            <ViewAllUsersTable />
        </>
    );
}

export default ViewAllUsers;