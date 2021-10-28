import React, { useEffect, useState } from "react";
import { Grid, styled, Switch } from '@material-ui/core';
import Controls from '../../../../Controls/Controls';
import NavBar from '../../../Bars/Nav/NavBar';
import './CreateNewEmployee.css';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: "green",
        '&:hover': {
            backgroundColor: "green",
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: "green",
    },
}));
const CreateNewEmployee = () => {

    let history = useHistory();
    let userInfo = JSON.parse(localStorage.getItem("user-info"));

    // const [statusInt, setStatus] = useState(true);
    const [roles, setRoles] = useState("Admin");
    const [employeeId, setEmployeeId] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [roleId, setRoleId] = useState(1);
    const [status, setStatus] = useState(true);
    const [password, setPassword] = useState();
    const [phoneNumber, setPhoneNumber] = useState();

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

        console.log(result)
        if (result.httpStatus === 200) {
            setRoles(result.result);
        }
    }
    useEffect(() => {
        getRoles();
    }, []);

    function redirectFunction() {
        history.push("/usermanager/")
    }

    function validateForm() {
        return employeeId.length > 0 && password.length > 0 && firstName.length > 0
            && lastName.length > 0 && roleId !== 0 && email.length > 0 && phoneNumber.length > 0 &&
            email.Include("@") && email.Include(".")
    }

    async function handleCreate() {

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
                status: status,
                password: password,
                addedByEmployeeId: "" + userInfo[0].employeeId
            }
            //console.log(item)
            let result = await fetch(APIURL(ENDPIONTS.USER), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            console.log(result);
            if (result.httpStatus === 200) {
                localStorage.setItem("new-user-info", "new user added successfully");
                history.push("/usermanager/" + employeeId)
            }
        }
    }

    function changeStatus() {
        setStatus(!status);
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
                    <label>  Create Employee</label>
                </div>

                <div>
                    <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                        onClick={redirectFunction} />
                    <label style={{ fontWeight: "500", fontSize: "20px" }}>Create Employee</label>
                    <button className="saveButton2" onClick={handleCreate}> Create </button>
                    <button className="cancelButton2" onClick={redirectFunction}> Cancel </button>
                </div>
            </div>

            <div className="myContainer">
                <Grid item lg={12} xs={6} container spacing={2}>
                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle">Account Info</label> <br />
                        <label className="subTitle">Employee ID</label><br />
                        <input onChange={e => setEmployeeId(e.target.value)} name="userId" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                        <br />
                        <label className="subTitle">Initial Password</label><br />
                        <input onChange={e => setPassword(e.target.value)} name="password" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                    </Grid>

                    <Grid item lg={3} xs={12}>
                        <label className="sectionTitle"></label> <br />
                        <br />
                        <label className="subTitle">Role</label><br />
                        <Controls.DropDown data={roles} onChange={e => setRoleId(e.target.value)} />  <br /><br />
                        <label className="subTitle">Status</label>
                        <GreenSwitch defaultChecked onChange={changeStatus} />
                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle">Contact Info</label> <br />
                        <label className="subTitle">First Name</label><br />
                        <input onChange={e => setFirstName(e.target.value)} name="firstName" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                        <br />
                        <label className="subTitle">Email</label><br />
                        <input onChange={e => setEmail(e.target.value)} name="email" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                    </Grid>
                    <Grid item lg={3} xs={12} >
                        <label className="sectionTitle"></label> <br /> <br />
                        <label className="subTitle">Last Name</label><br />
                        <input onChange={e => setLastName(e.target.value)} name="lastName" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                        <br />
                        <label className="subTitle">Phone Number</label><br />
                        <input onChange={e => setPhoneNumber(e.target.value)} name="phoneNumber" type="text" className="textInput" style={{ width: "200px", backgroundColor: "white", border: "1px solid black" }} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default CreateNewEmployee;