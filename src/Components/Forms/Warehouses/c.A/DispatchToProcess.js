import NavBar from '../../../Bars/Nav/NavBar';
import SideBar from '../../../Bars/Side/SideBar';
import './DispatchToProcess.css';
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useEffect, useState } from 'react';
import { Grid, InputAdornment, makeStyles, Toolbar } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../Controls/Controls';
import { ReactComponent as CircleCheckIcon } from "../../../../Icons/circleCheck.svg";
import addUnitsGreen from "../../../../Icons/addUnitsGreen.svg";
import deletRedIcon from "../../../../Icons/deletRedIcon.svg";
import { APIURL, ENDPIONTS } from '../../../../APIs/API';
import ConfirmDialog from '../../../Common/ConfirmDialog';
import ErrorMessage from '../../../Common/ErrorMessage';
import { AgGridReact } from 'ag-grid-react';
import CustomNoRowsOverlay from "../../../CustomAgGridComponents/CustomNoRowsOverlay/CustomNoRowsOverlay";
import { Col, Row } from 'react-bootstrap';
import Notification from "../../../Common/Notification";

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

const DispatchToProcess = () => {

    const classes = useStyles();

    let history = useHistory();
    const { id } = useParams();

    const [selectedEmployeeId, setSelectedEmployeeId] = useState(-1);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [errorMessage, setErrorMessage] = useState({ isOpen: false, title: '', subTitle: '' });

    const [recordsLeft, setRecordsLeft] = useState([]);
    //const tableLeft = useTable(recordsLeft, headCellsLeft, filterFnLeft);

    // const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(recordsLeft, headCellsLeft, filterFnLeft);

    const [recordsRight, setRecordsRight] = useState([]);
    const [gridOptions, setGridOptions] = useState();
    const [rightGridOptions, setRightGridOptions] = useState();

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

    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        getData();
        getTechnicians()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getData() {

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
            });
        }
    }

    async function getTechnicians() {
        let queryString = "Technician%20Manager"
        let result = await fetch(APIURL(ENDPIONTS.USER) + "GetAllUsersInRole?Role=" + queryString, {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        if (result.httpStatus === 200) {
            console.log(result.result)
            setTechnicians(result.result)
        }
    }

    const columnDefs = [
        {
            headerName: "Serial Number",
            field: "serialNumber"
        },
        {
            headerName: "Model",
            field: "model"
        },
        {
            headerName: "Action",
            cellRenderer: "addRenderer"
        }
    ]

    const rightGridColumnDefs = [
        {
            headerName: "Serial Number",
            field: "serialNumber"
        },
        {
            headerName: "WH Lot",
            field: "warehouseLotName"
        },
        {
            headerName: "",
            cellRenderer: "deleteRenderer"
        }
    ]

    const defaultColumnDefs = {
        filter: "agTextColumnFilter",
        sortable: true,
        resizable: true,
    }

    const noRowsOverlayComponentParams = {
        noRowsMessageFunc: () => 'No added units',
        noRowsImgFunc: () => addUnitsGreen
    }
    const onLeftGridReady = (params) => {
        params.api.sizeColumnsToFit();
        setGridOptions(params.api)
    };

    const onRightGridReady = (params) => {
        params.api.sizeColumnsToFit();
        setRightGridOptions(params.api)

    };

    function onFilterLeftTextBoxChanged() {
        if (gridOptions !== undefined)
            gridOptions.setQuickFilter(document.getElementById('filter-text-box').value);
    }

    function onFilterRightTextBoxChanged() {
        if (rightGridOptions !== undefined)
            rightGridOptions.setQuickFilter(document.getElementById('right-filter-text-box').value);
    }


    function redirectFunction() {
        history.push("/warehouses/warehouselots")
    }

    function validateForm() {
        return recordsRight.length > 0 && selectedEmployeeId !== -1
    }

    async function handleFinishButton() {
        console.log("result")
        let userInfo = JSON.parse(localStorage.getItem("user-info"));
        let bodyData = recordsRight.map((item) => {
            return item.unitId
        })
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "DispatchToProcess?AssignedToUserId=" + selectedEmployeeId + "&AssignedByUserId=" + userInfo[0].userId, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        result = await result.json();
        console.log(result)
        if (result.httpStatus === 200) {
            localStorage.setItem("pallet-import-info", "import CSV successfully");
            setNotify({
                isOpen: true,
                message: 'Dispatch to Process Created',
                type: 'info'
            })
            history.push("/warehouses/WarehouseLots/")

        }
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

    function addRenderer(props) {
        let item = props.data;
        return <button className="addToggle" disabled={item.disabled}
            onClick={(e) => {
                e.preventDefault()
                props.context.handleAddSwitch(item)
            }}>
            <div className="d-flex justify-content-evenly h-100 align-items-center">
                <CircleCheckIcon />
                Add
            </div>
        </button>;
    };

    function deleteRenderer(props) {
        let item = props.data;
        return <button style={{ background: "transparent", border: "unset", padding: "0px", width: "100%", textAlign: "center" }} disabled={item.disabled}
            onClick={(e) => {
                e.preventDefault()
                props.context.handleDeleteClick(item)
            }}>
            <img src={deletRedIcon} alt="" />
        </button>;
    };

    const [rightGridFrameworkComponents] = useState({
        customNoRowsOverlay: CustomNoRowsOverlay,
        deleteRenderer: deleteRenderer
    })

    //console.log({ records })
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

                <div className="row" style={{ height: "65px" }}>
                    <div className="mt-2">
                        <ArrowBackIcon style={{ width: "22px", marginBottom: "5px", marginRight: "20px" }}
                            onClick={redirectFunction} />
                        <label style={{ fontWeight: "500", fontSize: "20px" }}>Adding New Pallet</label>
                        <div className="d-flex float-end">
                            <button className="btn-cancel me-4" onClick={redirectFunction}> Cancel </button>
                            <button className="btn-green px-4 me-4" disabled={!validateForm()} onClick={() => setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure you want to create the dispatch to process?',
                                colors: "#8AC240",
                                onConfirm: () => { handleFinishButton() }
                            })}> Complete Dispatch </button>

                            <select
                                className="select-blue"
                                style={{ width: "230px" }}
                                onChange={(e) => {
                                    setSelectedEmployeeId(e.target.value)
                                }}
                                value={selectedEmployeeId}
                            >
                                <option value={-1} disabled hidden>Select Technician</option>
                                {
                                    technicians.map((item) => {
                                        return <option key={item.userId} value={item.userId}>{item.firstName + " " + item.lastName}</option>

                                    })
                                }
                            </select>

                        </div>

                    </div>
                </div>
            </div>


            <div className="inner-container">
                <Row className="w-100 justify-content-evenly">
                    <Col className="white-card me-5">
                        <Toolbar>
                            <Grid item lg={12} xs={12} container spacing={3}>
                                <Grid item lg={12} xs={12}>
                                    <Controls.Input
                                        id="filter-text-box"
                                        placeholder="Search"
                                        className={classes.searchInput}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" id="InputAdornment">
                                                    <Search style={{ textAlign: 'center' }} id="searchBox" />
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={onFilterLeftTextBoxChanged}
                                    />
                                </Grid>
                                <Grid item lg={12} xs={12}>
                                    <Controls.Input id="addSerialNumberInput" onChange={e => setValues({ ...values, serialNumberAdd: e.target.value })} />
                                    <button className="secondTab-Add" onClick={handleAddButton}>Add</button>
                                </Grid>
                            </Grid>
                        </Toolbar>
                        <div className="ag-theme-alpine mt-3" style={{ height: "300px" }}>
                            <AgGridReact
                                rowHeight={40}
                                rowData={recordsLeft}
                                columnDefs={columnDefs}
                                animateRows={true}
                                defaultColDef={defaultColumnDefs}
                                onGridReady={onLeftGridReady}
                                frameworkComponents={{
                                    addRenderer: addRenderer
                                }}
                                context={{
                                    handleAddSwitch
                                }}
                            />
                        </div>
                    </Col>

                    <Col className="white-card px-0">
                        <Toolbar >
                            <div className="me-2">
                                Added units ({recordsRight.length})
                            </div>

                            <Controls.Input
                                id="right-filter-text-box"
                                className="ms-auto"
                                placeholder="Search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" id="InputAdornment">
                                            <Search style={{ textAlign: 'center' }} id="searchBox" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={onFilterRightTextBoxChanged}
                            />
                        </Toolbar>

                        <div className="ag-theme-alpine mt-3" style={{ height: "350px" }}>
                            <AgGridReact
                                rowHeight={40}
                                rowData={recordsRight}
                                columnDefs={rightGridColumnDefs}
                                animateRows={true}
                                defaultColDef={defaultColumnDefs}
                                onGridReady={onRightGridReady}
                                frameworkComponents={rightGridFrameworkComponents}
                                noRowsOverlayComponent='customNoRowsOverlay'
                                noRowsOverlayComponentParams={noRowsOverlayComponentParams}
                                context={{
                                    handleDeleteClick
                                }}
                            />
                        </div>

                        <ConfirmDialog
                            confirmDialog={confirmDialog}
                            setConfirmDialog={setConfirmDialog}
                        />

                        <ErrorMessage
                            confirmDialog={errorMessage}
                            setConfirmDialog={setErrorMessage}
                        />

                        <Notification
                            notify={notify}
                            setNotify={setNotify}
                        />

                    </Col>
                </Row>

            </div>

        </>
    );
}

export default DispatchToProcess;