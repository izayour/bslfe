import React, { useEffect, useState } from 'react';
import { Paper, makeStyles, TableBody, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from '../../../../CostumeHooks/useTable';
import Controls from '../../../../Controls/Controls';
import { Search } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import * as UserFunctions from "../../../../Functions/ViewAllUsersFunctions";
import { APIURL, ENDPIONTS } from '../../../../APIs/API';

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
    { id: 'employeeId', label: 'Employee ID' },
    { id: 'fullName', label: 'Full Name' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    { id: 'createdBy', label: 'Created By', disableSorting: true },
    { id: 'creationDate', label: 'Creation Date', disableSorting: false }
]

const Employees = () => {
    const [records, setRecords] = useState();

    async function getAllUsers() {
        let result = await fetch(APIURL(ENDPIONTS.USER) + "GetAllUsers", {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        result = await result.json();
        console.log(result);

        if (result.httpStatus === 200)
            setRecords(result.result);
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);
    const classes = useStyles();
    let history = useHistory();

    function handleItemClick(item) {
        history.push("/usermanager/" + item.employeeId)
    }

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;

                else
                    return (
                        items.filter(x => x.firstName.toLowerCase().includes(target.value) || x.role.toLowerCase().includes(target.value)
                            || x.employeeId.toLowerCase().includes(target.value))
                    )
            }
        })
    }

    return (
        <>
            <Paper className={classes.pageContent}>
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
                        {recordsAfterPagingAndSorting() === null ?
                            []
                            :
                            recordsAfterPagingAndSorting().map((item, index) => (
                                <UserFunctions.ConditionalTableRow key={index} item={item} index={index} handleItemClick={() => handleItemClick(item)} />
                            ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
        </>
    );
}

export default Employees;