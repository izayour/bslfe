import React, { useEffect, useState } from "react";
import './EditEmployee.css';
import NavBar from '../../../Bars/Nav/NavBar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid } from '@material-ui/core';
import { useHistory, useParams } from "react-router-dom";
import Controls from '../../../../Controls/Controls';
import { APIURL, ENDPIONTS } from "../../../../APIs/API";

const EditEmployee = () => {

    const { id } = useParams();
    let history = useHistory();

    const [roles, setRoles] = useState("Admin");
    const [roleId, setRoleId] = useState(1);
    const [userId, setUserId] = useState();
    const [employeeId, setEmployeeId] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState(0);
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
        //console.log(result);
        if (result.httpStatus === 200) {
            setFirstName(result.result[0].firstName);
            setLastName(result.result[0].lastName);
            setEmail(result.result[0].email);
            setPhoneNumber(result.result[0].phoneNumber);
            setRole(result.result[0].role);
            setEmployeeId(result.result[0].employeeId);
            setUserId(result.result[0].userId);
        }
    }

    useEffect(() => {
        getSingleUser();
        getRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const handleInputChange = e => {
    //     const { name, value } = e.target
    //     const fieldValue = { [name]: value }
    //     setValues({
    //         ...values,
    //         ...fieldValue
    //     })
    //     // validate(fieldValue)
    // }

    async function getRoles() {
        let result = await fetch(APIURL(ENDPIONTS.ROLE), {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();

        if (result.httpStatus === 200) {
            setRoles(result.result);
        }
    }

    function redirectFunction() {
        history.push("/usermanager/")
    }

    function validateForm() {
        return employeeId.length > 0 && firstName.length > 0 && lastName.length > 0 && roleId !== 0 &&
            email.length > 0 && phoneNumber.length > 0
    }

    async function handleUpdate() {

        if (!validateForm)
            console.log('error');
        else {
            let item = {
                employeeId: employeeId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                roleId: roleId,
            }

            let result = await fetch(APIURL(ENDPIONTS.USER) + userId, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            //console.log(item);

            if (result.httpStatus === 200) {
                history.push("/usermanager/" + employeeId)
            }
        }
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
                    <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}> {"User Management / " + id + " / "} </label>
                    <label>   Edit</label>
                </div>

                <div>
                    <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                        onClick={redirectFunction} />
                    <label style={{ fontWeight: "500", fontSize: "20px" }}>Edit</label>
                    <button className="saveButton" onClick={handleUpdate}> Save Changes </button>
                    <button className="cancelButton" onClick={redirectFunction}> Cancel </button>
                </div>
            </div>

            <div className="myContainer">
                <Grid item lg={12} xs={6} container spacing={2}>
                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle">Account Info</label> <br />
                        <label className="subTitle">Employee ID</label><br />
                        <input onChange={e => setEmployeeId(e.target.value)} name="userId" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }}
                            value={employeeId} />
                        <br />
                    </Grid>

                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle"></label> <br />
                        <br />
                        <label className="subTitle">Role</label><br />
                        <Controls.DropDown data={roles} onChange={e => setRoleId(e.target.value)} defaultRole={role} />  <br /><br />
                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle">Contact Info</label> <br />
                        <label className="subTitle">First Name</label><br />
                        <input onChange={e => setFirstName(e.target.value)} name="firstName" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }}
                            value={firstName} />
                        <br />
                        <label className="subTitle">Email</label><br />
                        <input onChange={e => setEmail(e.target.value)} name="email" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }}
                            value={email} />
                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle"></label> <br /> <br />
                        <label className="subTitle">Last Name</label><br />
                        <input onChange={e => setLastName(e.target.value)} name="lastName" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }}
                            value={lastName} />
                        <br />
                        <label className="subTitle">Phone Number</label><br />
                        <input onChange={e => setPhoneNumber(e.target.value)} name="phoneNumber" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }}
                            value={phoneNumber} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default EditEmployee;