import { TableCell, TableRow } from '@material-ui/core';

export function ConditionalTableCell(props) {

    if (props.value === '')
        return null;

    else if (props.value === 'Active')
        return (
            <TableCell style={{ color: "#52C41A", border: "none" }}>
                <label style={{
                    border: "2px solid #52C41A",
                    backgroundColor: "#F7FFF0",
                    borderRadius: "4px",
                    padding: "3px 7px",
                    fontWeight: "400"
                }}>
                    {props.value}
                </label>
            </TableCell>
        )
    else
        return (
            <TableCell style={{ color: "#E56969", border: "none" }}>
                <label style={{
                    border: "2px solid #FFA39E",
                    backgroundColor: "#FFF1F0",
                    borderRadius: "4px",
                    padding: "3px 7px",
                    fontWeight: "400"
                }}>
                    {props.value}
                </label>
            </TableCell>
        )
}

export function ConditionalTableRow(props) {
    let { item, index, handleItemClick} = props;

    if (index % 2 !== 0)
        return (
            <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                backgroundColor: "#FAFAFA",
                fontFamily: "Roboto",
                border: 'none'
            }}>
                <TableCell style={{ border: 'none' }}>{item.employeeId}</TableCell>
                <TableCell style={{ border: 'none' }}>{item.firstName + " " + item.lastName }</TableCell>
                <TableCell style={{ border: 'none' }}>{item.role}</TableCell>
                <ConditionalTableCell value={item.status}></ConditionalTableCell>
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
                <TableCell style={{ border: 'none' }}>{item.employeeId}</TableCell>
                <TableCell style={{ border: 'none' }}>{item.firstName + " " + item.lastName}</TableCell>
                <TableCell style={{ border: 'none' }}>{item.role}</TableCell>
                <ConditionalTableCell value={item.status}></ConditionalTableCell>
                <TableCell style={{ border: 'none' }}>{item.addedByEmployeeId}</TableCell>
                <TableCell style={{ border: 'none' }}>{item.addedDate}</TableCell>
            </TableRow>
        )
}
