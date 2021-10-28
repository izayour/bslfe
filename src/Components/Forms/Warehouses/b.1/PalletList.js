import React from "react";
import NavBar from "../../../Bars/Nav/NavBar";
import SideBar from "../../../Bars/Side/SideBar";
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import './PalletList.css'
import AllPalletsTable from "./AllPalletsTable";
import { useHistory } from "react-router-dom";

const PalletList = () => {

    let history = useHistory();

    function handleAddClick() {
        history.push("/warehouses/addNewPallet")
    }
    return (
        <>
            <NavBar />
            <SideBar />

            <div className="sideBar-tab">
                <div className="col-sm-12" style={{
                    height: "60px",
                    display: "table-cell",
                    verticalAlign: "middle",
                    paddingLeft: "30px",
                    backgroundColor: "white",
                    width: "90vw"
                }}>
                    <label style={{ fontWeight: "800", fontFamily: "Roboto" }}>Pallet List</label>
                    <button className="createEmp" onClick={handleAddClick}>
                        <AddBoxTwoToneIcon style={{ color: "white", fontWeight: "10px" }} />
                        {"     Add New Pallet"}
                    </button>
                </div>
                <AllPalletsTable />

                {/* <div cla
                ssName="myContainer">
                    hi
                </div> */}
            </div>
        </>
    );
}

export default PalletList;