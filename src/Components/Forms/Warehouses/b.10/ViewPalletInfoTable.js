import { Grid, makeStyles, Paper, TableBody, TableCell, TableRow, Toolbar } from "@material-ui/core";
import useTable from '../../../../CostumeHooks/useTable';
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../../../../Icons/deleteIcon.svg";
import { ReactComponent as AddPalletIcon } from "../../../../Icons/addUnit.svg";
import "./ViewPalletInfo.css";
import PopUp from "../../../Common/PopUp";
import ConfirmDialog from "../../../Common/ConfirmDialog";
import Notification from "../../../Common/Notification";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '20%',
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
    { id: 'make', label: 'Make' },
    { id: 'model', label: 'Model', disableSorting: true },
    { id: 'type', label: 'Type' },
    { id: 'action', label: 'Action', disableSorting: true },
]

const ViewPalletInfoTable = (props) => {

    let { palletName } = props;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [openPopup, setOpenPopup] = useState(false)

    let history = useHistory();

    const [editLabel, setEditLabel] = useState("Edit");
    const [cancelDisplay, setCancelDisplay] = useState("none");
    const [dateDisplay, setDateDisplay] = useState("inherit");
    const [disabled, setDisabled] = useState(true);
    const [date, setDate] = useState();
    const classes = useStyles();
    const [records, setRecords] = useState();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [values, setValues] = useState({
        palletName: '',
        vendor: '',
        recievedDate: ''
    });

    const [values2, setValues2] = useState({
        serialNumber: '',
        make: '',
        model: '',
        type: ''
    });

    const [filterFn] = useState({ fn: items => { return items; } })
    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

    async function handleAddingUnitClick() {
        let item = {
            vendor: values.vendor,
            recievedDate: values.recievedDate,
            palletName: values.palletName,
            make: values2.make,
            model: values2.model,
            serialNumber: values2.serialNumber,
            type: values2.type
        }
        let result = await fetch(APIURL(ENDPIONTS.UNIT), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(item)
        });
        result = await result.json();
        console.log(item)
        if (result.httpStatus === 200) {
            localStorage.setItem("new-palletUnit-info", "new pallet added successfully");
            window.location.reload();
        }
    }

    function handleAddingCancelClick() {
        setOpenPopup(false)
    }

    async function getAllUnits() {
        let result = await fetch(APIURL(ENDPIONTS.UNIT) + "GetAllUnitsOfPallet/" + palletName, {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        console.log(result)

        if (result.httpStatus === 200) {
            const [day, month, year] = result.result[0].recievedDate.split('/');
            setDate(`${year}-${month}-${day}`);

            //console.log(result.result)
            setRecords(result.result);
            setValues({
                palletName: result.result[0].palletName,
                vendor: result.result[0].vendor,
                recievedDate: result.result[0].recievedDate
            })
        }
    }

    useEffect(() => {
        let palletUnit = localStorage.getItem("new-palletUnit-info");
        let palletDelete = localStorage.getItem("delete-pallet-info");

        if (palletUnit === 'new pallet added successfully') {
            setNotify({
                isOpen: true,
                message: 'Unit successfully added manually',
                type: 'info'
            })
            localStorage.removeItem('new-palletUnit-info');
        }

        if (palletDelete === "pallet deleted") {
            setNotify({
                isOpen: true,
                message: 'Pallet successfully deleted',
                type: 'info'
            })
            localStorage.removeItem('delete-pallet-info');
        }
        getAllUnits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleEditClick(palletName) {
        if (editLabel === "Edit") {
            setEditLabel("Save");
            setCancelDisplay("inherit");
            setDateDisplay("none")
            setDisabled(false);
        }
        else {
            let result = await fetch(APIURL(ENDPIONTS.UNIT) + "UpdateSubCategories/" + palletName + "?NewVendor="
                + values.vendor + "&NewDate=" + values.recievedDate + "&NewPalletName=" + values.palletName, {
                method: 'PUT'
            });
            result = await result.json();
            console.log(result)

            if (result.httpStatus === 200) {
                history.push("/warehouses/PalletList/" + values.palletName)
                setEditLabel("Edit");
                setCancelDisplay("none")
                setDateDisplay("inherit")
                setDisabled(true);
                setNotify({
                    isOpen: true,
                    message: 'Your changes have been saved',
                    type: 'info'
                })
            }
        }
    }

    function handleCancelClick() {
        setEditLabel("Edit");
        setCancelDisplay("none")
        setDateDisplay("inherit")
        setDisabled(true);
    }
    function handleItemClick(item) {
        // history.push({
        //     pathname: "/usermanager/" + item.employeeId,
        //     state: {
        //         from: location.pathname
        //     }
        // })
    }

    async function handleDeletePallet(item) {
        let result = await fetch(APIURL(ENDPIONTS.PALLET) + "Delete/" + item.palletId, {
            method: 'DELETE'
        });
        result = await result.json();
        if (result.httpStatus === 200) {
            localStorage.setItem("delete-pallet-info", "pallet deleted");
            window.location.reload();
        }
    }

    function ConditionalTableRow(props) {
        let { item, index } = props;

        if (index % 2 !== 0)
            return (
                <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                    backgroundColor: "#FAFAFA",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.make}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.type}</TableCell>
                    <TableCell style={{ border: 'none' }}>
                        <button className="palletRevomeButton" style={{ width: "46%" }} onClick={() =>
                            setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to remove unit ' + item.serialNumber + '?',
                                subTitle: "This will permanently delete it from the database.",
                                colors: "#E56969",
                                onConfirm: () => { handleDeletePallet(item) }
                            })}>
                            <DeleteIcon style={{ width: "25%" }} />
                            Remove
                        </button>
                    </TableCell>
                </TableRow>
            )
        else
            return (
                <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                    backgroundColor: "white",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.serialNumber}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.make}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.model}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.type}</TableCell>
                    <TableCell style={{ border: 'none' }}>
                        <button className="palletRevomeButton" style={{ width: "46%" }} onClick={() =>
                            setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to remove unit ' + item.serialNumber + '?',
                                subTitle: "This will permanently delete it from the database.",
                                colors: "#E56969",
                                onConfirm: () => { handleDeletePallet(item) }
                            })} >
                            <DeleteIcon style={{ width: "25%" }} />
                            Remove
                        </button>
                    </TableCell>
                </TableRow>
            )
    }

    const handleInputChange = e => {
        var { name, value } = e.target;

        setValues({
            ...values,
            [name]: value
        })
    }

    const handleInputChanges2 = e => {
        var { name, value } = e.target;

        setValues2({
            ...values2,
            [name]: value
        })
    }
    return (
        <>
            <Paper className={classes.pageContent}>
                {/* <EmployeeForm /> */}
                <Toolbar>
                    <Grid item lg={12} xs={6} container spacing={2}>
                        <Grid item lg={3} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label"> Pallet No.</label> <br />
                            <input className="secondTab-Input" type="text" name="palletName" onChange={handleInputChange}
                                disabled={disabled} value={values.palletName} />
                        </Grid>

                        <Grid item lg={3} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label">Vendor</label> <br />
                            <input className="secondTab-Input" type="text" name="vendor" onChange={handleInputChange}
                                disabled={disabled} value={values.vendor} />
                        </Grid>

                        <Grid item lg={3} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label">Date Received</label> <br />
                            <input className="secondTab-Input" disabled={disabled} type="text" value={values.recievedDate}
                                style={{ width: "202px", display: dateDisplay }} />
                            <input className="secondTab-Input" type="date" defaultValue={date} onChange={handleInputChange}
                                name="recievedDate" style={{ width: "202px", display: cancelDisplay }} />
                        </Grid>

                        <Grid item lg={3} xs={12} style={{ paddingRight: "40px", display: "grid" }}>
                            <button className="viewPalletInfoEdit" onClick={() => handleEditClick(palletName)}>{editLabel} </button>
                            <button className="viewPalletInfoCancel" style={{ display: cancelDisplay }} onClick={handleCancelClick}>Cancel </button>
                        </Grid>
                    </Grid>
                    {/* <Controls.Input
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
                    /> */}
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
                <div style={{ display: "flex" }}>
                    <TblPagination />
                    <button className="addPalletManually" style={{ marginLeft: "450px" }} onClick={() => setOpenPopup(true)}>
                        <AddPalletIcon style={{ width: "25%" }} />
                        Add Unit Manually
                    </button>
                </div>
                {/* <ConditionalDiv /> */}

            </Paper>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

            <PopUp openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <div className="resetPass-Container" style={{ height: "320px" }}>
                    <div className="resetPass-Header">
                        Add Unit Manually
                    </div>
                    <div className="addUnit-subContainer">
                        <label className="addUnit-label">Serial Number</label>
                        <input type="text" name="serialNumber" onChange={handleInputChanges2} />
                    </div>
                    <div className="addUnit-subContainer">
                        <label className="addUnit-label" style={{ paddingRight: "66px" }}>Make</label>
                        <input type="text" name="make" onChange={handleInputChanges2} />
                    </div>
                    <div className="addUnit-subContainer">
                        <label className="addUnit-label" style={{ paddingRight: "66px" }}>Model</label>
                        <input type="text" name="model" onChange={handleInputChanges2} />
                    </div>
                    <div className="addUnit-subContainer">
                        <label className="addUnit-label" style={{ paddingRight: "75px" }} >Type</label>
                        <input type="text" name="type" onChange={handleInputChanges2} />
                    </div>

                    <div style={{ backgroundColor: "#FAFAFA" }}>
                        <button className="reset-Button" style={{ width: "83px" }} onClick={handleAddingUnitClick}>Add Unit</button>
                        <button className="cancel-Button" onClick={handleAddingCancelClick}>Cancel</button>
                    </div >
                </div>
            </PopUp>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    );
}

export default ViewPalletInfoTable;