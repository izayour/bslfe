import React from "react";
import NavBar from "../../../Bars/Nav/NavBar";
import SideBar from "../../../Bars/Side/SideBar";
// import { useHistory, useLocation } from "react-router-dom";
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddNewPalletPartTwo from "./AddNewPalletPartTwo";
import "./AddNewPallet.css"
// import { ReactComponent as NoPalletLists } from '../../../../Icons/noPalletLists.svg';

const AddNewPallet = () => {

    // let history = useHistory();
    // let location = useLocation();

    // function redirectFunction() {
    //     history.push({
    //         pathname: "/warehouses/palletlist",
    //         
    //     })
    // }

   // async function handleFinishButton() {
        // let result = await fetch("https://localhost:44340/api/Pallet/InsertRange", {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Accept": "application/json"
        //     },
        //     body: JSON.stringify(itemList)
        // });
        // result = await result.json();
        // console.log(result)
        // if (result.httpStatus === 200) {
        //     //history.push
        // }
        //}
    //}

    return (
        <>
            <NavBar />         
            <SideBar />
            <AddNewPalletPartTwo />

 
        </>
    );
}

export default AddNewPallet;