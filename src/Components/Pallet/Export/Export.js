import React, { useState } from 'react';
import MaterialTable from 'material-table'
import XLSX from 'xlsx'
import './Export.css'

const EXTENSIONS = ['xlsx', 'xls', 'csv']

const Export = () => {

    const [colDefs, setColDefs] = useState([
        { title: 'Serial Number' },
        { title: 'Make' },
        { title: 'Model' },
        { title: 'Type' },
    ])
    const [data, setData] = useState()
    const [vendor, setVendor] = useState("");
    const [date, setDate] = useState();

    const getExention = (file) => {
        const parts = file.name.split('.')
        const extension = parts[parts.length - 1]
        return EXTENSIONS.includes(extension) // return boolean
    }

    const convertToJson = (headers, data) => {
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

    const importExcel = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (event) => {
            //parse data

            const bstr = event.target.result
            const workBook = XLSX.read(bstr, { type: "binary" })

            //get first sheet
            const workSheetName = workBook.SheetNames[0]
            const workSheet = workBook.Sheets[workSheetName]
            //convert to array
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
            // console.log(fileData)
            const headers = fileData[0]
            const heads = headers.map(head => ({ title: head, field: head }))
            setColDefs(heads)

            //removing header
            fileData.splice(0, 1)


            setData(convertToJson(headers, fileData))
            //console.log(convertToJson(headers, fileData))
        }

        if (file) {
            if (getExention(file)) {
                reader.readAsBinaryString(file)
            }
            else {
                alert("Invalid file input, Select Excel, CSV file")
            }
        } else {
            setData([])
            setColDefs([])
        }
    }

    async function saveData(dataList) {
        let itemList = [];

        // if (vendor === "" || typeof date === 'undefined' || typeof dataList === 'undefined' || dataList.Length === 0)
        //     console.log('error')

        // else {
        for (let i = 0; i < dataList.length; i++) {
            let item = {
                vendor: vendor,
                recievedDate: date,
                serialNumber: Object.entries(dataList[i])[0][1],
                make: Object.entries(dataList[i])[1][1],
                model: Object.entries(dataList[i])[2][1],
                type: Object.entries(dataList[i])[3][1]
            }
            itemList.push(item);

            // let result = await fetch("https://localhost:44340/api/Pallet", {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept": "application/json"
            //     },
            //     body: JSON.stringify(item)
            // });
            // result = await result.json();
            // console.log(result);
        }
        console.log(itemList)

        // let result = await fetch("https://localhost:44340/api/Pallet/InsertRange", {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Accept": "application/json"
        //     },
        //     body: JSON.stringify(itemList)
        // });
        // result = await result.json();
        // console.log(result)
        // if (result.httpStatus === 200) {
        //     //history.push
        // }
        //}
    }

    return (
        <div className="App">
            <h1 align="center">React-App</h1>
            {/* <h4 align='center'>Import Data from Excel, CSV in Material Table</h4> */}
            <div className="exportHead">
                <input type="file" onChange={importExcel} />
                <input type="text" placeholder="vendor" className="vendor" onChange={e => setVendor(e.target.value)} />
                <input type="date" className="datePicker" onChange={e => setDate(e.target.value)} />
            </div>
            <MaterialTable title="Excel Data" data={data} columns={colDefs} />
            <button className="saveButton" onClick={() => saveData(data)}>Save</button>
        </div>
    );
}

export default Export;
