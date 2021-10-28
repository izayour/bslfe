import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import NavBar from "../../../Bars/Nav/NavBar";
import SideBar from "../../../Bars/Side/SideBar";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ViewPalletInfoTable from "./ViewPalletInfoTable";
import Notification from "../../../Common/Notification";

const ViewPalletInfo = () => {
    let palletInfo = localStorage.getItem("pallet-import-info");
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const { id } = useParams();
    let history = useHistory();

    function redirectFunction() {
        history.push("/warehouses/palletlist")
    }

    useEffect(() => {
        if (palletInfo === 'import CSV successfully') {
            setNotify({
                isOpen: true,
                message: 'Pallet added',
                type: 'info'
            })
            localStorage.removeItem('pallet-import-info');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    width: "100vw"
                }}>
                    <div>
                        <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>Pallet List /</label>
                        <label>  {id} </label>
                    </div>
                    <div>
                        <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                            onClick={redirectFunction} />
                        <label style={{ fontWeight: "500", fontSize: "20px" }}>{id}</label>
                    </div>
                </div>
                <ViewPalletInfoTable palletName={id} />
            </div>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    );
}

export default ViewPalletInfo;