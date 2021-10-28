import React from "react";
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import './Side.css'
import { ReactComponent as ListIcon } from "../../../Icons/listIcon.svg";
import { ReactComponent as HouseIcon } from "../../../Icons/houseIcon.svg";
import { ReactComponent as Logo } from "../../../Icons/logo.svg";
import { ReactComponent as Vendors } from "../../../Icons/vendors.svg";

import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

const SideBar = () => {

    let invertoryTabs = [
        {
            name: "Pallet List",
            route: "warehouses/palletlist",
            icon: <ListIcon className="my-sidebar-link-icon" />
        },
        {
            name: "Add New Pallet",
            route: "warehouses/addNewPallet",
            icon: <AddBoxOutlinedIcon className="my-sidebar-link-icon" />
        }
    ];

    let invertoryReceivedTabs = [
        {
            name: "Warehouse Lots",
            route: "warehouses/WarehouseLots",
            icon: <HouseIcon className="my-sidebar-link-icon" />
        }
    ];

    let lotTabs = [
        {
            name: "Vendors",
            route: "page_under_construction",
            icon: <Vendors className="my-sidebar-link-icon" />
        }
    ];

    return (
        <>
            <Navbar className="col-md-2  d-none d-xl-block d-lg-block d-md-block sidebar" id="my-sidebar" >

                <label className="my-sidebar-label ">INBOUND INVENTORY</label> <br />
                {
                    Object.keys(invertoryTabs).map(id => {
                        return (
                            <>
                                <NavLink key={id} activeClassName="my-sidebar-link-active" className="my-sidebar-link" to={"/" + invertoryTabs[id].route}>
                                    {invertoryTabs[id].icon}
                                    {invertoryTabs[id].name}
                                </NavLink>
                                <br />
                            </>
                        )
                    })
                }
                <br />

                <label className="my-sidebar-label ">INVENTORY RECEIVED</label> <br />

                {
                    Object.keys(invertoryReceivedTabs).map(id => {
                        return (
                            <>
                                <NavLink key={id} activeClassName="my-sidebar-link-active" className="my-sidebar-link" to={"/" + invertoryReceivedTabs[id].route}>
                                    {invertoryReceivedTabs[id].icon}
                                    {invertoryReceivedTabs[id].name}
                                </NavLink>
                                <br />
                            </>
                        )
                    })
                }
                <br />

                <label className="my-sidebar-label ">LOT SETUP</label> <br />

                {
                    Object.keys(lotTabs).map(id => {
                        return (
                            <>
                                <NavLink key={id} activeClassName="my-sidebar-link-active" className="my-sidebar-link" to={"/" + lotTabs[id].route}>
                                    {lotTabs[id].icon}
                                    {lotTabs[id].name}
                                </NavLink>
                                <br />
                            </>
                        )
                    })
                }

                <Logo className="my-sidebar-logo" />
            </Navbar>


            <Navbar className="col-md-2 d-block d-sm-block d-sm-none sidebar" id="my-sidebar" >
                rdgfdkl;
            </Navbar>
        </>
    );
}

export default SideBar;