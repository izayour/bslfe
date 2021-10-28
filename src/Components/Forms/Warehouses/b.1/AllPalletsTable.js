import React, { useEffect, useState } from "react";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../../CostumeHooks/useTable';
import Controls from '../../../../Controls/Controls';
import { Search } from "@material-ui/icons";
import { ReactComponent as NoPalletLists } from '../../../../Icons/noPalletLists.svg';
import { useHistory } from "react-router-dom";
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
    { id: 'palletListId', label: 'Pallet No.' },
    { id: 'dateReceived', label: 'Date Received' },
    { id: 'numberOfUnits', label: 'Units' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'addedBy', label: 'Added By', disableSorting: true },
    { id: 'dateAdded', label: 'Date Added', disableSorting: false }
]

const AllPalletsTable = () => {
    const history = useHistory();

    const [records, setRecords] = useState();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();
    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

    async function getAllPalletLists() {
        let result = await fetch(APIURL(ENDPIONTS.PALLET) + "GetAllPallets", {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        result = await result.json();

        if (result.httpStatus === 200) {
            setRecords(result.result);
        }
    }
    useEffect(() => {
        getAllPalletLists();
    }, []);

    function ConditionalDiv() {
        if (typeof records === 'undefined') {
            return (
                <div style={{
                    padding: "15% 43%"
                }}>
                    <NoPalletLists style={{
                        marginLeft: "27%"
                    }} />
                    <label style={{
                        color: "#8AC240"
                    }}>No pallets to show</label>
                </div>
            )
        }
        return null;
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
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.receivedDate}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.numberOfUnits}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.vendor}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.addedByEmployeeId}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.addedDate}</TableCell>
                </TableRow>
            )
        else
            return (
                <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                    backgroundColor: "white",
                    fontFamily: "Roboto",
                    border: 'none'
                }}>
                    <TableCell style={{ border: 'none' }}>{item.palletName}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.receivedDate}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.numberOfUnits}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.vendor}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.addedByEmployeeId}</TableCell>
                    <TableCell style={{ border: 'none' }}>{item.addedDate}</TableCell>
                </TableRow>
            )
    }

    function handleItemClick(item) {
        history.push("/warehouses/palletlist/" + item.palletName)
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
                            .filter(x => x.numberOfUnits === parseInt(target.value) || x.vendor.toLowerCase().includes(target.value)
                                || x.employeeId.toLowerCase().includes(target.value) || x.palletName.toLowerCase().includes(target.value)
                            )
                    )
            }
        })
    }
    return (
        <>
            <Paper className={classes.pageContent}>
                {/* <EmployeeForm /> */}
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
                        onChange={handleSearch}
                    />
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

                <ConditionalDiv />
            </Paper>
        </>
    );
}

export default AllPalletsTable;