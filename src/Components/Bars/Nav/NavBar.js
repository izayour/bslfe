import React from "react";
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './Nav.css';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
import { logout, userRole } from "../../../Functions/Authentication";
import { userRoles } from "../../../Constants/Constants";
import logoutIcon from "../../../Icons/logout.svg";

const NavBar = () => {

    let tabs = [
        { name: "Warehouses", route: "warehouses" },
        { name: "Dispatched to Process", route: "dispatchedtoprocess" },
        { name: "Sales", route: "sales" },
        { name: "User Manager", route: "usermanager" },
        { name: "Time Tracking", route: "timetracking" }
    ];

    let userInfo = JSON.parse(localStorage.getItem("user-info"));

    return (
        <Navbar
            expand="lg"
            fixed="top"
            style={{ padding: "0px", backgroundColor: "#1E75B7" }}
        >
            {
                userRole() === userRoles.admin
                    ? <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            {
                                Object.keys(tabs).map(id => {
                                    return <NavLink key={id} activeClassName="my-navbar-link-active" className="my-navbar-link" to={"/" + tabs[id].route}> {tabs[id].name} </NavLink>
                                })
                            }
                        </Nav>
                    </Navbar.Collapse>
                    : userRole() === userRoles.technician_manager
                        ? <Navbar.Collapse id="basic-navbar-nav" className="ms-4" style={{ color: "white" }}>
                            <Nav>
                                <span>
                                    <b>
                                        {
                                            userInfo[0].employeeId
                                        }
                                    </b>
                                    &nbsp;-&nbsp;
                                    {
                                        userInfo[0].name
                                    }
                                </span>
                            </Nav>
                        </Navbar.Collapse>
                        : null
            }

            <Dropdown className='my-navbar-icon '>
                <Dropdown.Toggle
                    className="after-display-none me-2"
                    variant='light'
                    id='dropdown-basic'
                    style={{ padding: '0px', background: 'none', boxShadow: 'none', border: "unset" }}
                >
                    <AccountCircleIcon />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ border: '1px solid #7CB1FF', left: "-104px" }} className='dropdown-menu-start mt-1'>
                    <Dropdown.Item onClick={() => logout()}>
                        <img className="me-3" src={logoutIcon} alt="" style={{ width: "16px" }} />
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
}

export default NavBar;