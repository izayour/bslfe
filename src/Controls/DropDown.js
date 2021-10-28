import React from "react";

const DropDown = (props) => {

    const { data, onChange, defaultRole} = props;

    console.log(defaultRole)

    return (
        <select style={{
            width: "200px",
            height: "30px",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "3px"
        }}
            onChange={onChange}
        >
            {/* <option style={{ backgroundColor: "white" }} disabled selected>Select</option> */}
            {
                typeof data !== "object" ?
                    []
                    :
                    Object.keys(data).map(id => {
                        return <option key={id} style={{ backgroundColor: "white" }} value={data[id].roleId}
                            selected={data[id].name === defaultRole}>{data[id].name}</option>
                    })
            }
        </select>
    );
}

export default DropDown;