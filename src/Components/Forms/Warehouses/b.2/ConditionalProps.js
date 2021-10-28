import { TableCell, TableRow } from "@material-ui/core";
import React, { useState } from "react";
import { ReactComponent as EditIcon } from "../../../../Icons/editPalletIcon.svg";
import { ReactComponent as DeleteIcon } from "../../../../Icons/deleteIcon.svg";

export function TableRowWithEdit(props) {
    let { itemList, item, index, bgColor, pad, handleRemove, handleEdit } = props;
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
                <button className="palletRevomeButton" onClick={() => handleRemove(itemList, index)}>
                    <DeleteIcon style={{ width: "25%" }} />
                    Remove
                </button>
                <button className="palletEditButton" onClick={() => handleEdit(itemList, item, index)}>
                    <EditIcon style={{ width: "25%" }} />
                    Edit
                </button>
            </TableCell>
        </TableRow>
    )
}


export function TableRowWithSave(props) {

    let { itemList, item, index, bgColor, pad, handleSave, handleCancel } = props;

    const [serialNumber, setSerialNumber] = useState(item.serialNumber);
    const [make, setMake] = useState(item.make);
    const [model, setModel] = useState(item.model);
    const [type, setType] = useState(item.type);

    return (
        <TableRow className="editTableRow" style={{ backgroundColor: bgColor }}>
            <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                <input type="text" className="inputPalletEdit" value={serialNumber}
                    onChange={e => setSerialNumber(e.target.value)}
                />
            </TableCell>
            <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                <input type="text" className="inputPalletEdit" value={make}
                    onChange={e => setMake(e.target.value)}
                />
            </TableCell>
            <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                <input type="text" className="inputPalletEdit" value={model}
                    onChange={e => setModel(e.target.value)}
                />
            </TableCell>
            <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                <input type="text" className="inputPalletEdit" value={type}
                    onChange={e => setType(e.target.value)}
                />
            </TableCell>

            <TableCell style={{ border: 'none', paddingBottom: pad, paddingTop: pad }}>
                {/* onClick={() => handleRemoveClick(itemList, index)} */}
                <button className="palletCancelButton" onClick={handleCancel}>
                    Cancel
                </button>
                <button className="palletSaveButton" onClick={() => handleSave(serialNumber, make, model, type)}>
                    Save
                </button>
            </TableCell>
        </TableRow>
    )
}