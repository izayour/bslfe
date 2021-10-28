import { TableBody, Toolbar, Grid, TableRow, TableCell } from '@material-ui/core';
import React, { useState } from 'react';
import useTable from '../../../../CostumeHooks/useTable';
import { ReactComponent as ImportIcon } from '../../../../Icons/importIcon.svg';
import { ReactComponent as ImportIcon2 } from '../../../../Icons/importicon2.svg';
import * as ExportFunctions from "../../../../Functions/ExportingFunctions";
import XLSX from 'xlsx'
import { ReactComponent as EditIcon } from "../../../../Icons/editPalletIcon.svg";
import { ReactComponent as DeleteIcon } from "../../../../Icons/deleteIcon.svg";
import { ReactComponent as AddPalletIcon } from "../../../../Icons/addUnit.svg";
import PopUp from '../../../Common/PopUp';
// import { ReactComponent as NoPalletLists } from '../../../../Icons/noPalletLists.svg';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import Notification from "../../../Common/Notification";
import ConfirmDialog from "../../../Common/ConfirmDialog";
import { APIURL, ENDPIONTS } from '../../../../APIs/API';

const headCells = [
    { id: 'serialNumber', label: 'Serial Number', disableSorting: true },
    { id: 'make', label: 'Make' },
    { id: 'model', label: 'Model', disableSorting: true },
    { id: 'type', label: 'Type' },
    { id: 'action', label: 'Action', disableSorting: true },
]

const AddNewPalletPartTwo = () => {

    let user = JSON.parse(localStorage.getItem("user-info"));
    let history = useHistory();
    let filterFn = { fn: items => { return items; } };

    const [values, setValues] = useState({
        serialNumber: '',
        make: '',
        model: '',
        type: '',
        palletName: '',
        date: '',
        vendor: ''
    });

    const [inEditMode, setInEditMode] = useState({
        isInEditMode: false,
        editModeIndex: -1
    });

    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [records, setRecords] = useState();

    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

    function redirectFunction() {
        history.push("/warehouses/palletlist")
    }

    function validateForm() {
        return values.vendor.length > 0 && values.date.length > 0 && values.palletName.length > 0
            && typeof records !== 'undefined'
    }

    async function handleFinishButton() {
        function setElement(element) {
            element.vendor = values.vendor;
            element.palletName = values.palletName;
            element.recievedDate = values.date;
        }

        if (records.length !== 0 && values.vendor.length !== 0 && values.date.length !== 0 && values.palletName.length !== 0) {
            records.forEach(element => { setElement(element) });

            let result = await fetch(APIURL(ENDPIONTS.UNIT) + "InsertRange?userId=" + user[0].userId, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(records)
            });
            result = await result.json();
            console.log(result)
            if (result.httpStatus === 200) {
                localStorage.setItem("pallet-import-info", "import CSV successfully");
                history.push("/warehouses/palletlist/" + values.palletName)
            }
        }
    }

    const handleInputChange = e => {
        var { name, value } = e.target;

        setValues({
            ...values,
            [name]: value
        })
    }

    function ConditionalDiv() {
        if (typeof records === 'undefined') {
            return (
                <div style={{
                    padding: "10% 43%", width: "74.5vw"
                }}>
                    <ImportIcon style={{ marginLeft: "27%" }} />
                    <label style={{ color: "#8AC240" }}>Import CSV File</label>
                    <div className="importCSV">
                        <label onChange={importExcel} htmlFor="formId">
                            <input name="" type="file" id="formId" hidden />
                            <ImportIcon2 style={{ color: "white", fontWeight: "10px" }} />
                            Import CSV
                        </label>
                    </div>
                </div>
            )
        }
        else {
            return (
                // <div style = {{marginTop: "-5%"}}>
                <>
                    <button className="addPalletManually" onClick={() => setOpenPopup(true)}>
                        <AddPalletIcon style={{ width: "25%" }} />
                        Add Unit Manually
                    </button>

                    <button className="disabledImportButton" >
                        <ImportIcon2 style={{ color: "white", fontWeight: "10px" }} />
                        Import CSV
                    </button>
                </>
                // </div>
            )
        }
    }

    function handleRemoveClick(itemList, item) {
        const index = itemList.indexOf(item);
        let newItemList = [...itemList];
        newItemList.splice(index, 1);
        setRecords(newItemList);
    }

    function handleEditClick(index) {
        console.log(index)
        setInEditMode({
            isInEditMode: true,
            editModeIndex: index
        });
    }

    function handleCancelClick() {
        setInEditMode({
            isInEditMode: false,
            editModeIndex: -1
        });
    }

    function handleSaveClick(serialNumber, make, model, type, itemList, item) {
        let objIndex = itemList.findIndex((obj => obj === item));
        itemList[objIndex].serialNumber = serialNumber;
        itemList[objIndex].make = make;
        itemList[objIndex].model = model
        itemList[objIndex].type = type;
        setRecords(itemList);
        setInEditMode({
            isInEditMode: false,
            editModeIndex: -1
        });
    }

    function TableRowWithEdit(props) {
        let { itemList, item, index, bgColor, pad } = props;
        return (
            <TableRow style={{
                backgroundColor: bgColor,
                fontFamily: "Roboto",
                border: 'none', paddingBottom: "0", paddingTop: "0"
            }}>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>{item.serialNumber}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>{item.make}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>{item.model}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>{item.type}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    <button className="palletRevomeButton" onClick={() => handleRemoveClick(itemList, item)}>
                        <DeleteIcon style={{ width: "25%" }} />
                        Remove
                    </button>
                    <button className="palletEditButton" onClick={() => handleEditClick(index)}>
                        <EditIcon style={{ width: "25%" }} />
                        Edit
                    </button>
                </TableCell>
            </TableRow>
        )
    }

    function TableRowWithSave(props) {

        let { itemList, item, bgColor, pad } = props;

        const [values2, setValues2] = useState({
            serialNumber: item.serialNumber,
            make: item.make,
            model: item.model,
            type: item.type
        })
        const handleInputChange2 = e => {
            var { name, value } = e.target;

            setValues2({
                ...values2,
                [name]: value
            })
        }
        return (
            <TableRow className="editTableRow" style={{ backgroundColor: bgColor }}>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    <input type="text" className="inputPalletEdit" value={values2.serialNumber} name="serialNumber"
                        onChange={handleInputChange2} />
                </TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    <input type="text" className="inputPalletEdit" value={values2.make} name="make"
                        onChange={handleInputChange2} />
                </TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    <input type="text" className="inputPalletEdit" value={values2.model} name="model"
                        onChange={handleInputChange2} />
                </TableCell>
                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    <input type="text" className="inputPalletEdit" value={values2.type} name="type"
                        onChange={handleInputChange2} />
                </TableCell>

                <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                    {/* onClick={() => handleRemoveClick(itemList, index)} */}
                    <button className="palletCancelButton" onClick={handleCancelClick}>
                        Cancel
                    </button>
                    <button className="palletSaveButton" onClick={() => handleSaveClick(values2.serialNumber, values2.make, values2.model,
                        values2.type, itemList, item)}>
                        Save
                    </button>
                </TableCell>
            </TableRow>
        )
    }

    function ConditionalTableRow(props) {
        let { itemList, item, index } = props;

        if (!inEditMode.isInEditMode || inEditMode.editModeIndex === -1) {
            if (index % 2 !== 0)
                return (<TableRowWithEdit itemList={itemList} item={item} index={index} bgColor="#FAFAFA" />)
            else
                return (<TableRowWithEdit itemList={itemList} item={item} index={index} bgColor="white" />)
        }
        else {

            if (index % 2 !== 0 && index === inEditMode.editModeIndex)
                return (<TableRowWithSave itemList={itemList} item={item} index={index} bgColor="#FAFAFA" pad="17px" />)
            else if (index % 2 === 0 && index === inEditMode.editModeIndex) {
                return (<TableRowWithSave itemList={itemList} item={item} index={index} bgColor="white" pad="17px" />)
            }
            else if (index % 2 !== 0)
                return (<TableRowWithEdit itemList={itemList} item={item} index={index} bgColor="#FAFAFA" pad="17px" />)
            else
                return (<TableRowWithEdit itemList={itemList} item={item} index={index} bgColor="white" pad="17px" />)
        }
    }

    function testing() {
        console.log("hi")
    }

    const importExcel = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
            const bstr = event.target.result
            const workBook = XLSX.read(bstr, { type: "binary" })
            const workSheetName = workBook.SheetNames[0]
            const workSheet = workBook.Sheets[workSheetName]
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
            fileData.splice(0, 8)
            const headers = fileData[0]
            fileData.splice(0, 1)

            let dataList = ExportFunctions.convertToJson(headers, fileData);
            let itemList = [];

            for (let i = 0; i < dataList.length; i++) {
                if (Object.entries(dataList[i]).length === 0)
                    continue;

                else if (Object.entries(dataList[i])[0][1] !== 0) {
                    let item = {
                        vendor: values.vendor,
                        recievedDate: values.date,
                        serialNumber: Object.entries(dataList[i])[0][1],
                        make: Object.entries(dataList[i])[1][1],
                        model: Object.entries(dataList[i])[2][1],
                        type: Object.entries(dataList[i])[3][1],
                        palletName: values.palletName
                    }
                    itemList.push(item);
                }
                else
                    continue;
            }
            setRecords(itemList)
            setNotify({
                isOpen: true,
                message: 'Imported Successfully',
                type: 'info'
            })
            // console.log(itemList)
        }
        if (file) {
            if (ExportFunctions.getExention(file)) {
                reader.readAsBinaryString(file)
            }
            else {
                alert("Invalid file input, Select Excel, CSV file")
            }
        }
    }

    function handleAddingCancelClick() {
        setOpenPopup(false)
    }
    function handleAddingUnitClick() {
        if (typeof records !== 'undefined') {
            if (values.serialNumber.length > 0 && values.make.length > 0 &&
                values.model.length > 0 && values.type.length > 0) {
                records.unshift({
                    serialNumber: values.serialNumber,
                    make: values.make,
                    model: values.model,
                    type: values.type,
                });
                setRecords(records);
                setOpenPopup(false);
                setNotify({
                    isOpen: true,
                    message: 'Unit successfully added manually',
                    type: 'info'
                })
            }
        }
    }
    return (
        <>
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
                        <label style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "5px", marginBottom: "8px", marginRight: "4px" }}>Pallet List /</label>
                        <label>  Add New Pallet</label>
                    </div>

                    <div>
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
            <div className="myContainer-secondTab">
                <Toolbar>
                    <Grid item lg={12} xs={6} container spacing={2}>
                        <Grid item lg={4} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label"> Pallet No.</label> <br />
                            <input className="secondTab-Input" type="text" name="palletName" onChange={handleInputChange} />
                        </Grid>

                        <Grid item lg={4} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label">Vendor</label> <br />
                            <input className="secondTab-Input" type="text" name="vendor" onChange={handleInputChange} />
                        </Grid>

                        <Grid item lg={4} xs={12} style={{ paddingRight: "40px" }}>
                            <label className="secondTab-Label">Date Received</label> <br />
                            <input className="secondTab-Input" type="date" name="date" onChange={handleInputChange}
                                required style={{ width: "202px" }} />
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
                                    <ConditionalTableRow key={index} item={item} index={index} handleItemClick={testing}
                                        itemList={records} />
                                ))}
                    </TableBody>
                </TblContainer>

                <div style={{ display: "flex" }}>
                    <TblPagination />
                    <ConditionalDiv />
                </div>

                <PopUp openPopup={openPopup}
                    setOpenPopup={setOpenPopup}>
                    <div className="resetPass-Container" style={{ height: "320px" }}>
                        <div className="resetPass-Header">
                            Add Unit Manually
                        </div>
                        <div className="addUnit-subContainer">
                            <label className="addUnit-label">Serial Number</label>
                            <input type="text" name="serialNumber" onChange={handleInputChange} />
                        </div>
                        <div className="addUnit-subContainer">
                            <label className="addUnit-label" style={{ paddingRight: "66px" }}>Make</label>
                            <input type="text" name="make" onChange={handleInputChange} />
                        </div>
                        <div className="addUnit-subContainer">
                            <label className="addUnit-label" style={{ paddingRight: "66px" }}>Model</label>
                            <input type="text" name="model" onChange={handleInputChange} />
                        </div>
                        <div className="addUnit-subContainer">
                            <label className="addUnit-label" style={{ paddingRight: "75px" }} >Type</label>
                            <input type="text" name="type" onChange={handleInputChange} />
                        </div>

                        <div style={{ backgroundColor: "#FAFAFA" }}>
                            <button className="reset-Button" style={{ width: "83px" }} onClick={handleAddingUnitClick}>Add Unit</button>
                            <button className="cancel-Button" onClick={handleAddingCancelClick}>Cancel</button>
                        </div >
                    </div>
                </PopUp>
            </div>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    );
}

export default AddNewPalletPartTwo;