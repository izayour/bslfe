import './AllWarehouseLots.css';
import React, { useEffect, useState } from "react";
import { Paper, makeStyles, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../../CostumeHooks/useTable';
import Controls from '../../../../Controls/Controls';
import { Search } from "@material-ui/icons";
import NoLotsIcon from '../../../../Icons/noLots.svg';

import { APIURL, ENDPIONTS } from "../../../../APIs/API";
import CustomNoRowsOverlay from "../../../CustomAgGridComponents/CustomNoRowsOverlay/CustomNoRowsOverlay";

import { AgGridReact } from "ag-grid-react";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    centerAdornment: {
        marginLeft: "50%" // or your relevant measure
    },
    centerText: {
        textAlign: "center"
    }
}))

const headCells = [
    { id: 'warehouseLotName', label: 'Warehouse Lot', disableSorting: true },
    { id: 'make', label: 'Make' },
    { id: 'type', label: 'Type' },
    { id: 'units', label: 'Units' },
    { id: 'locationId', label: 'Location ID' },
    { id: 'addedDate', label: 'Creation Date' },
    { id: 'createdBy', label: 'Created By' }
]

const AllWarehouseLotsTable = (props) => {

    const [records, setRecords] = useState();
    const [gridOptions, setGridOptions] = useState();

    const [filterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();
    const { recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

    const columnDefs = [
        {
            headerName: "Warehouse Lot",
            field: "warehouseLotName",
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            lockVisible: true,
            cellClass: 'locked-visible',
        },
        {
            headerName: "Make",
            field: "make"
        },
        {
            headerName: "Type",
            field: "type"
        },
        {
            headerName: "Units",
            field: "numberOfUnits"
        },
        {
            headerName: "Location ID",
            field: "locationName"
        },
        {
            headerName: "Creation Date",
            field: "addedDate"
        },
        {
            headerName: "Created By",
            field: "addedByEmployeeId"
        }
    ]

    const defaultColumnDefs = {
        filter: "agTextColumnFilter",
        sortable: true,
        resizable: true,
    }

    const frameworkComponents = {
        customNoRowsOverlay: CustomNoRowsOverlay
    }

    const noRowsOverlayComponentParams = {
        noRowsMessageFunc: () => 'No warehouse lots',
        noRowsImgFunc: () => NoLotsIcon
    }

    useEffect(() => {
        getAllWarehouseLots();
    }, []);

    async function getAllWarehouseLots() {
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "GetAllActiveLots", {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        console.log({ result })
        if (result.httpStatus === 200) {
            setRecords(result.result);
        } else if (result.httpStatus === 204) {
            setRecords([]);
        }
    }

    let recordsLocal = recordsAfterPagingAndSorting();
    console.log({ recordsLocal })

    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
        setGridOptions(params.api)
    };

    function onFilterTextBoxChanged() {
        if (gridOptions !== undefined)
            gridOptions.setQuickFilter(document.getElementById('filter-text-box').value);
    }

    const onSelectionChanged = (event) => {
        var selectedItemsLocal = event.api.getSelectedNodes().map((item) => {
            return item.data.warehouseLotName
        });
        console.log("selected items names: ", selectedItemsLocal)
        props.setSelectedItems(selectedItemsLocal)
    };

    return (
        <>
            <Paper className={classes.pageContent + " px-0"} >
                <Toolbar>
                    <Controls.Input
                        id="filter-text-box"
                        placeholder="Search"
                        className="py-2 mb-5"
                        style={{ height: "32px", width: "20%" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" id="InputAdornment">
                                    <Search style={{ textAlign: 'center' }} id="searchBox" />
                                </InputAdornment>
                            )
                        }}
                        onChange={onFilterTextBoxChanged}
                    />
                </Toolbar>

                <div className="ag-theme-alpine" style={{ height: "300px" }}>
                    <AgGridReact
                        rowHeight={40}
                        rowData={recordsLocal}
                        columnDefs={columnDefs}
                        animateRows={true}
                        defaultColDef={defaultColumnDefs}
                        onGridReady={onGridReady}
                        suppressRowClickSelection={true}
                        suppressCellSelection={false}
                        onSelectionChanged={onSelectionChanged}
                        rowSelection="multiple"
                        frameworkComponents={frameworkComponents}
                        noRowsOverlayComponent='customNoRowsOverlay'
                        noRowsOverlayComponentParams={noRowsOverlayComponentParams}
                    />
                </div>
            </Paper>
        </>
    );
}

export default AllWarehouseLotsTable;