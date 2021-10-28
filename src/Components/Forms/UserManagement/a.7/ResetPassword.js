import React, { useEffect, useState } from 'react'
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { OutlinedInput } from '@material-ui/core';
import './ResetPassword.css';
import { APIURL, ENDPIONTS } from '../../../../APIs/API';

const ResetPassword = (props) => {

    useEffect(() => {
        localStorage.removeItem('reset-info');
    }, [])

    const [password2, setPassword] = useState();
    const [confirmpassword2, setConfirmPassword] = useState();

    let user = JSON.parse(localStorage.getItem("user-info"));

    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });

    const [values2, setValues2] = React.useState({
        confirmPassword: "",
        showConfirmPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setValues({ ...values2, [prop]: event.target.value });
        setPassword(event.target.value)
    };

    const handleClickShowPassword2 = () => {
        setValues2({ ...values2, showConfirmPassword: !values2.showConfirmPassword });
    };

    const handlePasswordChange2 = (prop) => (event) => {
        setValues2({ ...values, [prop]: event.target.value });
        setConfirmPassword(event.target.value)
    };

    function validatePasses() {
        return password2 !== '' && password2 !== confirmpassword2;
    }
    async function handleResetClick() {
        let result = await fetch(APIURL(ENDPIONTS.USER) + "ResetPassword/" + props.employeeId
            + "?Password=" + password2 + "&ChangingEmployeeId=" + user[0].employeeId
            , { method: 'PUT' }
        );
        result = await result.json();

        if (result.httpStatus === 200) {
            localStorage.setItem("reset-info", "reset is done");
            window.location.reload();
            //props.cancel();
        }
    }
    return (
        <>
            <div className="resetPass-Container">
                <div className="resetPass-Header">
                    Reset Passord
                </div>

                <div className="resetPass-subContainer">
                    <label className="resetPass-Label" style={{ marginRight: "69px" }}>
                        New Password
                    </label>
                    <OutlinedInput className="outlined-Input"
                        id="standard-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handlePasswordChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>
                <div className="resetPass-subContainer">
                    <label style={{
                        marginRight: "10px"
                    }}>Confirm New Password</label>
                    <OutlinedInput className="outlined-Input"
                        type={values2.showConfirmPassword ? "text" : "password"}
                        onChange={handlePasswordChange2("confirmPassword")}
                        value={values2.confirmPassword}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword2}
                                    onMouseDown={handleMouseDownPassword}>
                                    {values2.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>
                <div>
                    <button className="reset-Button" onClick={handleResetClick} disabled={!validatePasses}>Reset</button>
                    <button className="cancel-Button" onClick={props.cancel}>Cancel</button>
                </div >
            </div >
        </>
    );
}

export default ResetPassword;