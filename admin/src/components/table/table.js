import ReactTable from "react-table";
import "react-table/react-table.css";
import React from "react";
import "./table.css";
export default function Table({ data, columns, clickHandler}) {
  return (
    <ReactTable
      className="-striped -highlight"
      data={data}
      columns={columns}
      pageSizeOptions={[5, 10]}
      showPageSizeOptions={false}
      defaultPageSize={10}
      getTdProps={(state, rowInfo, column, instance) => {
        return {
          onClick: (e, handleOriginal) => {
            clickHandler(rowInfo,column);
            if (handleOriginal) {
              handleOriginal()
            }
          }
        }
      }}
    ></ReactTable>
  );
}
