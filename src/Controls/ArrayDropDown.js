import React from "react";

const ArrayDropDown = (props) => {

    const { data, onChange, defaultRole } = props;

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
                        return <option key={id} style={{ backgroundColor: "white" }} value={data[id]}
                            selected={data[id] === defaultRole}>{data[id]}</option>
                    })
            }
        </select>
    );
}

export default ArrayDropDown;