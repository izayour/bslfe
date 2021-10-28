import React, { useEffect, useState } from "react";
import { APIURL, ENDPIONTS } from "../../../../APIs/API";
import Controls from "../../../../Controls/Controls";
import "./AddNewWarehouseLot.css"
import LocationDropdown from "./LocationDropdown";
import { useHistory } from "react-router-dom";

const AddNewWarehouseLot = (props) => {

    let history = useHistory();
    const initialFieldValues = {
        warehouseLotName: '',
        make: '',
        type: '',
        locationId: 0,
        unitsToAdd: 0,
        addedByUserId: props.userId
    };
    // console.log(props.userId);

    const [values, setValues] = useState(initialFieldValues);
    const [types, setTypes] = useState();
    const [makes, setMakes] = useState();
    const [locations, setLocations] = useState();

    async function getAllLocationsTypesAndMakes() {
        let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "GetAllLocationsTypesAndMakes", {
            method: 'Get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        result = await result.json();
        console.log(result)
        if (result.httpStatus === 200) {
            setTypes(result.types);
            setMakes(result.makes);
            setLocations(result.locations);
            setValues(
                {
                    ...values,
                    make: result.makes[0],
                    type: result.types[0],
                    locationId: result.locations[0].locationId
                });
        }
    }

    useEffect(() => {
        getAllLocationsTypesAndMakes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    async function handleCreateClick() {
        if (!validateForm)
            console.log('error');

        else {
            let item = values;

            let result = await fetch(APIURL(ENDPIONTS.WAREHOUSELOT) + "CreateWarehouseLot", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            console.log(item);

            if (result.httpStatus === 200) {
                history.push("/warehouses/WarehouseLots/" + result.warehouseLotInfo.warehouseLotName)
            }
        }
    }

    function validateForm() {
        return values.warehouseLotName.length > 0 && values.make.length > 0 && values.type.length > 0 &&
            values.locationId > 0 && values.unitsToAdd > 0
    }

    function handleInputChange(e) {
        var { name, value } = e.target;

        setValues({
            ...values,
            [name]: value
        })
    }

    return (
        <>
            <div className="resetPass-Container" style={{ height: "380px" }}>
                <div className="resetPass-Header">
                    New Lot
                </div>

                <div className="addLot-subContainer">
                    <label className="addLot-label">Warehouse Lot ID</label>
                    <input type="text" className="addLot-Input" name="warehouseLotName" onChange={handleInputChange} />
                </div>

                <div className="addLot-subContainer">
                    <label className="addLot-label">Make</label>
                    <Controls.ArrayDropDown data={makes} onChange={e => setValues({ ...values, make: e.target.value })} />
                    {/* <input type="text" name="make" onChange={handleInputChange} /> */}
                </div>

                <div className="addLot-subContainer">
                    <label className="addLot-label">Type</label>
                    <Controls.ArrayDropDown data={types} onChange={e => setValues({ ...values, type: e.target.value })} />
                    {/* <input type="text" name="type" onChange={handleInputChange} /> */}
                </div>

                <div className="addLot-subContainer">
                    <label className="addLot-label">Location ID</label>
                    <LocationDropdown data={locations} onChange={e => setValues({ ...values, locationId: e.target.value })} />
                    {/* <input type="text" className="addLot-Input" name="locationName" onChange={handleInputChange} /> */}
                </div>

                <div className="addLot-subContainer">
                    <label className="addLot-label">No. of Units to add</label>
                    <input type="number" className="addLot-Input" name="unitsToAdd" onChange={handleInputChange} />
                </div>

                <div>
                    <button className="addLot-Button" onClick={handleCreateClick} disabled={!validateForm()}>Create List</button>
                    <button className="cancelAddLot-Button" onClick={props.cancel}>Cancel</button>
                </div >
            </div>
        </>
    );
}

export default AddNewWarehouseLot;