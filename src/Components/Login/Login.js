import React, { useEffect, useState } from 'react';
import logo from '../../images/logo320.png';
import './Login.css';
import { useHistory } from "react-router-dom";
import { APIURL, ENDPIONTS } from '../../APIs/API';
import ErrorMessage from '../Common/ErrorMessage';

function LoginForm({ error }) {

    let userInfo = JSON.parse(localStorage.getItem("user-info"));
    const [errorMessage, setErrorMessage] = useState({ isOpen: false, title: '', subTitle: '' });

    useEffect(() => {
        if (userInfo !== null) {
            routeTo(userInfo[0].role)
        }
    });

    const routeTo = (role) => {
        if (role === "Admin") {
            history.push("/warehouses/")
        } else if (role === "Technician Manager") {
            history.push("/UnderProcess")
        }
    }
    const history = useHistory();

    const [details, setDetails] = useState({
        employeeId: "",
        password: ""
    });

    async function handleSubmit(event) {
        event.preventDefault();
        let item = {
            employeeId: details.employeeId,
            password: details.password
        };

        try {
            let result = await fetch(APIURL(ENDPIONTS.USER) + "Login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item)
            });

            result = await result.json();
            if (result.httpStatus === 200) {
                console.log(result)
                let userInfoLocal = result.result
                localStorage.setItem("user-info", JSON.stringify(userInfoLocal));
                routeTo(userInfoLocal[0].role)
            }
            else {
                setErrorMessage({
                    isOpen: true,
                    title: result.message,
                    colors: "#E56969",
                });
            }

        } catch (error) {
            setErrorMessage({
                isOpen: true,
                title: error,
                colors: "#E56969",
            });
        }
    }

    return (
        <div className="login-superContainer">
            <div className="login-container">
                <div className="logo-Div" >
                    <img src={logo} alt="logo" />
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    {error ?
                        <div className="form-error">
                            {error}
                        </div>
                        : ''
                    }
                    <h3 className="red-text" >LOG IN</h3>
                    <div className="form-group">

                        <label>Employee ID</label><br />
                        <input className="input" type="text" name="employeeId"
                            onChange={e => setDetails({ ...details, employeeId: e.target.value })}
                            value={details.employeeId} />
                    </div>

                    <div className="form-group">
                        <label>Password</label><br />

                        <input className="input" type="password" name="password"
                            onChange={e => setDetails({ ...details, password: e.target.value })}
                            value={details.password} />
                    </div>

                    <input className="btn-primary btn-block" type="submit" value="Login" />
                </form >
            </div>
            <ErrorMessage
                confirmDialog={errorMessage}
                setConfirmDialog={setErrorMessage}
            />
        </div>
    )
}

export default LoginForm;