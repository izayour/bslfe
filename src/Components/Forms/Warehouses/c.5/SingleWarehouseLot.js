import React, { useState } from "react";
import NavBar from "../../../Bars/Nav/NavBar";
import SideBar from "../../../Bars/Side/SideBar";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from "react-router-dom";
import './SingleWarehouseLot.css';
import { Grid, InputAdornment, makeStyles, TableBody, TableCell, TableRow, Toolbar } from '@material-ui/core';
import Controls from "../../../../Controls/Controls";
import { Search } from "@material-ui/icons";
import useTable from '../../../../CostumeHooks/useTable';
import { useEffect } from "react";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";
import { ReactComponent as DeleteIcon } from "../../../../Icons/deleteIcon.svg";
import { ReactComponent as DispatchIcon } from "../../../../Icons/dispatchToProcess.svg";
import ConfirmDialog from "../../../Common/ConfirmDialog";
import ErrorMessage from "../../../Common/ErrorMessage";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '90%'
    },
    centerAdornment: {
        marginLeft: "50%" // or your relevant measure
    },
    centerText: {
        textAlign: "center"
    }
}))

const headCells = [
    { id: 'serialNumber', label: 'Serial Number', disableSorting: true },
    { id: 'model', label: 'Model', disableSorting: true },
    { id: 'palletName', label: 'Pallet No.', disableSorting: true },
    { id: 'action', label: 'Action', disableSorting: true }
]

const SingleWarehouseLot = () => {

    let history = useHistory();
    const { id } = useParams();
    const [numberOfUnits, setNumberOfUnits] = useState(0);

    const classes = useStyles();

    const [records, setRecords] = useState();
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [errorMessage, setErrorMessage] = useState({ isOpen: false, title: '', subTitle: '' });
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);
    const [values, setValues] = useState({
        make: '',
        type: '',
        locationNumber: '',
        numberOfUnits: 0,
        warehouseLotId: 0,
        serialNumber: '',
        creationDate: '',
        employeeId: '',
        warehouseLotNumber: ''
    });

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const getData = async () => {
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "GetUnitsOfLot/" + id, {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        if (result.httpStatus === 200) {
            console.log(result)
            setRecords(result.units);
            setValues({
                ...values,
                numberOfUnits: result.units.length,
                warehouseLotId: result.warehouseLotInfo.warehouseLotId,
                locationNumber: result.warehouseLotInfo.locationName,
                make: result.warehouseLotInfo.make,
                type: result.warehouseLotInfo.type,
                creationDate: result.warehouseLotInfo.addedDate,
                employeeId: result.warehouseLotInfo.addedByEmployeeId,
                warehouseLotNumber: result.warehouseLotInfo.warehouseLotName
            });
        }
    }

    function redirectFunction() {
        history.push("/warehouses/WarehouseLots")
    }

    async function handleAddButton() {
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "AddPalletToLot?SerialNumber="
            + values.serialNumber + "&WarehouseLotId=" + values.warehouseLotId, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        console.log(result)
        if (result.httpStatus === 200) {
            window.location.reload(false);
            setNumberOfUnits(numberOfUnits + 1);
        }
        else if (result.httpStatus === 500 || result.httpStatus === 400 || result.httpStatus === 404) {
            setErrorMessage({
                isOpen: true,
                title: result.message,
                colors: "#E56969",
            });
        }
    }

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;

                else
                    return (
                        items
                            .filter(x => x.serialNumber.toLowerCase().includes(target.value) || x.model.toLowerCase().includes(target.value)
                                || x.palletName.toLowerCase().includes(target.value)
                            )
                    )
            }
        })
    }

    async function handleDeletePallet(item) {
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "RemovePalletFromLot/" + item.serialNumber, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();

        console.log(result)
        if (result.httpStatus === 200) {
            window.location.reload(false);
        }
    }

    function handleDispatchClick() {
        history.push("/warehouses/WarehouseLots/DispatchToProcess/" + values.warehouseLotNumber)
    }

    function ConditionalTableRow(props) {
        let { item, index } = props;

        if (index % 2 !== 0)
            return (
                <TableRow key={item.id} style={{
                    backgroundColor: "#FAFAFA",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <button className="palletRevomeButton" style={{ width: "46%", marginTop: "15px" }} onClick={() =>
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to remove unit ' + item.serialNumber + '?',
                            // subTitle: "This will permanently delete it from the database.",
                            colors: "#E56969",
                            onConfirm: () => { handleDeletePallet(item) }
                        })}>
                        <DeleteIcon style={{ width: "25%" }} />
                        Remove
                    </button>
                </TableRow>
            )
        else
            return (
                <TableRow key={item.id} style={{
                    backgroundColor: "white",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <button className="palletRevomeButton" style={{ width: "46%", marginTop: "15px" }} onClick={() =>
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to remove unit ' + item.serialNumber + '?',
                            // subTitle: "This will permanently delete it from the database.",
                            colors: "#E56969",
                            onConfirm: () => { handleDeletePallet(item) }
                        })}>
                        <DeleteIcon style={{ width: "25%" }} />
                        Remove
                    </button>
                </TableRow>
            )
    }
    return (
        <>
            <NavBar />
            <SideBar />

            <div className="sideBar-tab">
                <div className="col-sm-12" style={{
                    height: "100px",
                    display: "table-cell",
                    width: "1%",
                    paddingLeft: "30px",
                    paddingTop: "16px",
                    backgroundColor: "white"
                }}>
                    <div>
                        <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>
                            Warehouse Lots / </label>
                        <label>   {id}</label>
                    </div>

                    <div>
                        <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                            onClick={redirectFunction} />
                        <label style={{ fontWeight: "500", fontSize: "20px" }}>{id}</label>

                        <button className="dispatchButton" onClick={handleDispatchClick}>
                            <DispatchIcon style={{ marginRight: "10px" }} />
                            Dispatch To Process
                        </button>

                        {/* <button disabled={!validateForm()} className="saveButton" onClick={() => setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure you want to add this pallet?',
                            // subTitle: "They will be locked out of their account.",
                            colors: "#8AC240",
                            onConfirm: () => { handleFinishButton() }
                        })}> Finish Adding </button>
                        <button className="cancelButton" onClick={redirectFunction}> Cancel </button> */}

                    </div>
                </div>
            </div>

            <div className="myContainer-secondTab" style={{ padding: "0px" }}>
                <div className="singleLot-SubHeader">
                    {id}
                </div>

                <div style={{ padding: "10px 20px" }}>
                    <Grid item lg={12} xs={6} container spacing={2}>
                        <Grid item lg={2} xs={12}>
                            <label className="singleLot-Label1">Make</label> <br />
                            <label className="singleLot-Label2">{values.make}</label>
                        </Grid>
                        <Grid item lg={2} xs={12}>
                            <label className="singleLot-Label1">Type</label><br />
                            <label className="singleLot-Label2">{values.type}</label>
                        </Grid>
                        <Grid item lg={2} xs={12}>
                            <label className="singleLot-Label1">Location ID</label><br />
                            <label className="singleLot-Label2">{values.locationNumber}</label>
                        </Grid>
                        <Grid item lg={2} xs={12}>
                            <label className="singleLot-Label1">Units</label><br />
                            <label className="singleLot-Label2">{values.numberOfUnits}</label>
                        </Grid>
                        <Grid item lg={1} xs={12}>

                        </Grid>
                        <Grid item lg={2} xs={12}>
                            <label className="singleLot-Label1">Creation Date</label> <br />
                            <label className="singleLot-Label1">Created by</label>
                        </Grid>
                        <Grid item lg={1} xs={12}>
                            <label className="singleLot-Label2">{values.creationDate}</label><br />
                            <label className="singleLot-Label2">{values.employeeId}</label>
                        </Grid>
                    </Grid>
                </div>
            </div>

            <div className="myContainer-thirdTab">
                <Toolbar>
                    <Grid item lg={12} xs={6} container spacing={2}>
                        <Grid item lg={4} xs={12} style={{ paddingRight: "40px" }}>
                            <Controls.Input
                                id="searchInput"
                                placeholder="Search"
                                className={classes.searchInput}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" id="InputAdornment">
                                            <Search style={{ textAlign: 'center' }} id="searchBox" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={handleSearch}
                            />
                            {/* <label className="secondTab-Label"> Added Units ({numberOfUnits})</label> <br /> */}
                            {/* <input className="secondTab-Input" type="text" name="palletName" onChange={handleInputChange} /> */}
                        </Grid>

                        <Grid item lg={3} xs={12} style={{ paddingRight: "40px" }}>

                        </Grid>

                        <Grid item lg={5} xs={12} style={{ paddingRight: "40px" }}>
                            {/* <label className="secondTab-Label">Vendor</label> <br /> */}
                            <Controls.Input id="addSerialNumberInput" onChange={e => setValues({ ...values, serialNumber: e.target.value })} />
                            {/* <input className="secondTab-Input" type="text" name="vendor" onChange={handleInputChange} /> */}
                            <button className="secondTab-Add" onClick={handleAddButton}>Add</button>
                        </Grid>

                    </Grid>
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting() === null ?
                                []
                                :
                                recordsAfterPagingAndSorting().map((item, index) => (
                                    <ConditionalTableRow key={index} item={item} index={index} />
                                ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </div>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

            <ErrorMessage
                confirmDialog={errorMessage}
                setConfirmDialog={setErrorMessage}
            />

            {/* <BSTableNext
                columns={headCells}
                data = {data}
            >

            </BSTableNext> */}
        </>
    );
}

export default SingleWarehouseLot;