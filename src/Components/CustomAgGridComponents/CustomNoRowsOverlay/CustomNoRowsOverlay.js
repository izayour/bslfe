export default function CustomNoRowsOverlay({ noRowsImgFunc, noRowsMessageFunc }) {
    return (
        <div className="ag-overlay-loading-center mt-4" style={{ height: '9%', border: "unset", boxShadow: "unset", color: "#8AC240" }}>
            <img src={noRowsImgFunc()} alt="" />
            <div > {noRowsMessageFunc()}</div>
        </div>
    );
};