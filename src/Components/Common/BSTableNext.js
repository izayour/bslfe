import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";

const Table = ({ columns, data, defaultSorted, rowClicked, isActive }) => {
    const tableRowEvents = {
        onClick: (e, row, rowIndex) => {
            rowClicked(row);
            isActive(true);
        },
    };
    const { SearchBar } = Search;

    const options = {
        withFirstAndLast: false,
        prePageText: " << ",
        nextPageText: " >> ",
        showTotal: true,
        sizePerPageList: [
            {
                text: "10",
                value: 10,
            },
            {
                text: "25",
                value: 25,
            },
            {
                text: "50",
                value: 50,
            },
            {
                text: "All",
                value: data.length,
            },
        ],
        alwaysShowAllBtns: true,
    };
    return (
        <ToolkitProvider
            // keyField={columns[0].dataField}
            keyField={columns[0].label}
            data={data}
            columns={columns}
            search={{
                searchFormatted: true,
            }}
        >
            {(props) => (
                <div className="custom-table">
                    <SearchBar {...props.searchProps} />
                    <span className="fa fa-search"></span>
                    <BootstrapTable
                        bootstrap4
                        striped
                        hover
                        bordered={false}
                        keyField={defaultSorted}
                        data={data}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        rowEvents={tableRowEvents}
                        pagination={paginationFactory(options)}
                        {...props.baseProps}
                    />
                </div>
            )}
        </ToolkitProvider>
    );
};

export default Table;
