import React, { useState } from "react";
import NavBar from "../../../Bars/Nav/NavBar";
import SideBar from "../../../Bars/Side/SideBar";
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import './AllWarehouseLots.css';
import AllWarehouseLotsTable from './AllWarehouseLotsTable.js';
import PopUp from "../../../Common/PopUp";
import { useHistory } from "react-router-dom";
import AddNewWarehouseLot from "../c.2/AddNewWarehouseLot";
import dispatchToProcess from "../../../../Icons/dispatchToProcess.svg"
const AllWarehouseLots = () => {
    const [selectedItems, setSelectedItems] = useState([]);

    let userInfo = JSON.parse(localStorage.getItem("user-info"));

    let history = useHistory();

    const [openPopup, setOpenPopup] = useState(false)

    function handleAddClick() {
        setOpenPopup(true);
    }

    function handleItemClick(item) {
        //console.log(item)
        if (selectedItems.length > 0)
            history.push("/warehouses/WarehouseLots/DispatchToProcess/" + [...selectedItems])
    }



    return (
        <>
            <NavBar />
            <SideBar />
            <div className="sideBar-tab">
                <div className="col-sm-12 py-3" style={{
                    height: "70px",
                    display: "flex",
                    paddingLeft: "30px",
                    backgroundColor: "white"
                }}>

                    <label className="mt-2" style={{ fontWeight: "800", fontFamily: "Roboto" }}>Warehouse Lot</label>

                    <div className="d-flex ml-auto mt-0">
                        <button className="btn-white-blue me-2 px-4 py-2" onClick={handleItemClick} style={{ position: "relative", height: "40px" }}>
                            <img src={dispatchToProcess} alt="" />
                            {"     Create Disp. to Process"}
                        </button>
                        <button className="createEmp" onClick={handleAddClick} style={{ position: "relative", height: "40px", width: "300px", marginTop: "0px" }}>
                            <AddBoxTwoToneIcon style={{ color: "white", fontWeight: "10px" }} />
                            {"     Add New Lot"}
                        </button>
                    </div>

                </div>
                <AllWarehouseLotsTable setSelectedItems={setSelectedItems} />

                {/* <div cla
                ssName="myContainer">
                    hi
                </div> */}
            </div>

            <PopUp
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <AddNewWarehouseLot cancel={() => setOpenPopup(false)} userId={userInfo[0].userId} />
            </PopUp>
        </>
    );
}

export default AllWarehouseLots;