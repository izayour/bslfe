import { TableCell, TableRow } from "@material-ui/core"
import { ReactComponent as EditIcon } from "../Icons/editPalletIcon.svg";
import { ReactComponent as DeleteIcon } from "../Icons/deleteIcon.svg";

const EXTENSIONS = ['xlsx', 'xls', 'csv']

export const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) // return boolean
}

export const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
        let rowData = {}
        row.forEach((element, index) => {
            rowData[headers[index]] = element
        })
        rows.push(rowData)

    });
    return rows
}

export function ConditionalTableRow(props) {
    let { item, index, handleItemClick } = props;

    if (index % 2 !== 0)
        return (
            <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                backgroundColor: "#FAFAFA",
                fontFamily: "Roboto",
                border: 'none',
                paddingBottom: "0",
                paddingTop: "0"
            }}>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.serialNumber}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.make}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.model}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.type}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>
                    <button className="palletRevomeButton">
                        <DeleteIcon style={{width: "25%"}}/>
                        Remove
                    </button>
                    <button className="palletEditButton">
                        <EditIcon style={{ width: "25%" }} />
                        Edit
                    </button>
                </TableCell>  
            </TableRow>
        )
    else
        return (
            <TableRow onClick={() => handleItemClick(item)} key={item.id} style={{
                backgroundColor: "white",
                fontFamily: "Roboto",
                border: 'none',
                paddingBottom: "0",
                paddingTop: "0"
            }}>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.serialNumber}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.make}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.model}</TableCell>
                <TableCell style={{ border: 'none', paddingBottom: "0", paddingTop: "0" }}>{item.type}</TableCell>
            </TableRow>
        )
}