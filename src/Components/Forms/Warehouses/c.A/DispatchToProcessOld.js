import NavBar from '../../../Bars/Nav/NavBar';
import SideBar from '../../../Bars/Side/SideBar';
import './DispatchToProcess.css';
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useEffect, useState } from 'react';
import { Grid, InputAdornment, makeStyles, TableBody, TableCell, TableRow, Toolbar } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../Controls/Controls';
import useTable from '../../../../CostumeHooks/useTable';
import { ReactComponent as CircleCheckIcon } from "../../../../Icons/circleCheck.svg";
import { ReactComponent as DeleteIcon } from "../../../../Icons/deletRedIcon.svg";
import { APIURL, ENDPIONTS } from '../../../../APIs/API';
import ConfirmDialog from '../../../Common/ConfirmDialog';
import ErrorMessage from '../../../Common/ErrorMessage';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '72.5%'
    },
    centerAdornment: {
        marginLeft: "50%" // or your relevant measure
    },
    centerText: {
        textAlign: "center"
    }
}))

const headCellsLeft = [
    { id: 'serialNumber', label: 'Serial Number', disableSorting: true },
    { id: 'model', label: 'Model', disableSorting: true },
    { id: 'action', label: 'Action', disableSorting: true },
]
const headCellsRight = [
    { id: 'serialNumber', label: 'Serial Number', disableSorting: true },
    { id: 'model', label: 'Model', disableSorting: true },
    { id: 'palletName', label: 'Pallet No.', disableSorting: true },
    { id: 'action', label: '', disableSorting: true },
]
const DispatchToProcess = () => {

    const classes = useStyles();

    let history = useHistory();
    const { id } = useParams();

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [errorMessage, setErrorMessage] = useState({ isOpen: false, title: '', subTitle: '' });

    const [recordsLeft, setRecordsLeft] = useState();
    const [filterFnLeft, setFilterFnLeft] = useState({ fn: items => { return items; } })
    const tableLeft = useTable(recordsLeft, headCellsLeft, filterFnLeft);

    // const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(recordsLeft, headCellsLeft, filterFnLeft);

    const [recordsRight, setRecordsRight] = useState([]);
    const [filterFnRight, setFilterFnRight] = useState({ fn: items => { return items; } })
    const tableRight = useTable(recordsRight, headCellsRight, filterFnRight);

    const [values, setValues] = useState({
        make: '',
        type: '',
        locationNumber: '',
        numberOfUnits: 0,
        warehouseLotId: 0,
        serialNumber: '',
        creationDate: '',
        addedByEmployeeId: '',
        warehouseLotNumber: ''
    });

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getData() {
        /* console.log({ id })
         */
        let ids = id.split(',')
        let queryString = ""
        for (let i = 0; i < ids.length; i++) {
            if (i === 0) {
                queryString += "WarehouseLotNames=" + ids[0]
            } else {
                queryString += "&WarehouseLotNames="
                queryString += ids[i]
            }
        }
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "GetUnitsOfLots?" + queryString, {
            //let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "GetUnitsOfLot/" + ids[0], {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        if (result.httpStatus === 200) {
            console.log(result)
            setRecordsLeft(result.units);
            setValues({
                ...values,
                numberOfUnits: result.units.length,
                /* warehouseLotId: result.warehouseLotInfo.warehouseLotId,
                locationNumber: result.warehouseLotInfo.locationNumber,
                make: result.warehouseLotInfo.make,
                type: result.warehouseLotInfo.type,
                creationDate: result.warehouseLotInfo.creationDate,
                addedByEmployeeId: result.warehouseLotInfo.addedByEmployeeId,
                warehouseLotNumber: result.warehouseLotInfo.warehouseLotNumber */
            });
        }
    }

    function redirectFunction() {
        history.push("/warehouses/warehouselots")
    }

    function validateForm() {
        return recordsRight.length > 0
    }

    async function handleFinishButton() {
        console.log("result")
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "DispatchToProcess", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(recordsRight)
        });

        result = await result.json();
        console.log(result)
        if (result.httpStatus === 200) {
            localStorage.setItem("pallet-import-info", "import CSV successfully");
            history.push("/warehouses/WarehouseLots/")
        }
    }

    function handleSearchLeft(e) {
        let target = e.target;
        setFilterFnLeft({
            fn: items => {
                if (target.value === "")
                    return items;

                else
                    return (
                        items
                            .filter(x => x.serialNumber.toLowerCase().includes(target.value) || x.model.toLowerCase().includes(target.value)
                            )
                    )
            }
        })
    }

    function handleSearchRight(e) {
        let target = e.target;
        setFilterFnRight({
            fn: items => {
                if (target.value === "")
                    return items;

                else
                    return (
                        items
                            .filter(x => x.serialNumber.toLowerCase().includes(target.value) || x.model.toLowerCase().includes(target.value)
                            )
                    )
            }
        })
    }
    function handleAddButton() {
        let newRecordsLeft = [...recordsLeft];
        let newRecordsRight = [...recordsRight];

        let index = newRecordsLeft.findIndex(o => o.serialNumber === values.serialNumberAdd);

        if (index !== -1) {
            newRecordsRight.push(newRecordsLeft[index]);
            setRecordsRight(newRecordsRight);

            newRecordsLeft.splice(index, 1);
            setRecordsLeft(newRecordsLeft);
        }
    }

    function handleAddSwitch(item) {
        let newRecordsRight = [...recordsRight];
        newRecordsRight.push(item);
        setRecordsRight(newRecordsRight);

        let newRecordsLeft = [...recordsLeft];
        let recordIndex = newRecordsLeft.indexOf(item);
        //newRecordsLeft[recordIndex].disabled = true;
        newRecordsLeft.splice(recordIndex, 1);
        setRecordsLeft(newRecordsLeft)
    }

    function handleDeleteClick(item) {
        let index = recordsRight.indexOf(item);
        let newRecordsRight = [...recordsRight];
        newRecordsRight.splice(index, 1);
        setRecordsRight(newRecordsRight);

        let newRecordsLeft = [...recordsLeft];
        // let recordIndex = newRecordsLeft.indexOf(item);
        // newRecordsLeft[recordIndex].disabled = false;
        newRecordsLeft.unshift(item)
        setRecordsLeft(newRecordsLeft)
    }
    function ConditionalTableRowLeft(props) {
        let { item, index } = props;

        if (index % 2 !== 0)
            return (
                <TableRow key={index} style={{
                    backgroundColor: "#FAFAFA",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>

                    <button className="addToggle" disabled={item.disabled} onClick={() => handleAddSwitch(item)}>
                        <CircleCheckIcon />
                        Add
                    </button>
                </TableRow>
            )
        else
            return (
                <TableRow key={index} style={{
                    backgroundColor: "white",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <button disabled={item.disabled} className="addToggle" onClick={() => handleAddSwitch(item)}>
                        <CircleCheckIcon />
                        Add
                    </button>
                </TableRow>
            )
    }

    function ConditionalTableRowRight(props) {
        let { item, index } = props;

        if (index % 2 !== 0)
            return (
                <TableRow key={index} style={{
                    backgroundColor: "#FAFAFA",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <TableCell style={{ border: 'none' }}><DeleteIcon onClick={() => handleDeleteClick(item)} /></TableCell>
                </TableRow>
            )
        else
            return (
                <TableRow key={index} style={{
                    backgroundColor: "white",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <TableCell style={{ border: 'none' }}><DeleteIcon onClick={() => handleDeleteClick(item)} /></TableCell>
                </TableRow>
            )
    }
    let records = tableLeft.recordsAfterPagingAndSorting()
    console.log({ records })
    return (
        <>
            <NavBar />
            <SideBar />

            <div className="container bg-white subContainer" style={{ position: "absolute", top: "50px", left: "245px", maxWidth: "82%" }}>
                <div className="row">
                    <div className="mt-2">
                        <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>
                            Warehouse Lots / {id} /
                        </label>
                        <label>  Dispatch to Processing</label>
                    </div>
                </div>

                <div className="row" style={{ height: "55px" }}>
                    <div className="mt-2">
                        <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                            onClick={redirectFunction} />
                        <label style={{ fontWeight: "500", fontSize: "20px" }}>Adding New Pallet</label>
                        <button disabled={!validateForm()} className="saveButton" onClick={() => setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure you want to add this pallet?',
                            // subTitle: "They will be locked out of their account.",
                            colors: "#8AC240",
                            onConfirm: () => { handleFinishButton() }
                        })}> Finish Adding </button>
                        <button className="cancelButton" onClick={redirectFunction}> Cancel </button>
                    </div>
                </div>
            </div>

            <div className="myContainer-secondTab leftSideTab">
                <Toolbar>
                    <Grid item lg={12} xs={12} container spacing={3}>
                        <Grid item lg={12} xs={12}>
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
                                onChange={handleSearchLeft}
                            />
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <Controls.Input id="addSerialNumberInput" onChange={e => setValues({ ...values, serialNumberAdd: e.target.value })} />
                            <button className="secondTab-Add" onClick={handleAddButton}>Add</button>
                        </Grid>
                    </Grid>
                </Toolbar>

                <tableLeft.TblContainer>
                    <tableLeft.TblHead />
                    <TableBody>
                        {
                            tableLeft.recordsAfterPagingAndSorting() === null ?
                                []
                                :
                                tableLeft.recordsAfterPagingAndSorting().map((item, index) => (
                                    <ConditionalTableRowLeft key={index} item={item} index={index} />
                                ))
                        }
                    </TableBody>
                </tableLeft.TblContainer>
                <tableLeft.TblPagination />

            </div>

            <div className="myContainer-secondTab rightSideTab">
                <Toolbar>
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
                        onChange={handleSearchRight}
                    />
                </Toolbar>

                <tableRight.TblContainer>
                    <tableRight.TblHead />
                    <TableBody>
                        {
                            tableRight.recordsAfterPagingAndSorting() === null ?
                                []
                                :
                                tableRight.recordsAfterPagingAndSorting().map((item, index) => (
                                    <ConditionalTableRowRight key={index} item={item} index={index} />
                                ))
                        }
                    </TableBody>
                </tableRight.TblContainer>
                {
                    recordsRight.length === 0 ?
                        []
                        :
                        <tableRight.TblPagination />
                }

                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />

                <ErrorMessage
                    confirmDialog={errorMessage}
                    setConfirmDialog={setErrorMessage}
                />
            </div>
        </>
    );
}

export default DispatchToProcess;