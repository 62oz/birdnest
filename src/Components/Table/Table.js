import React, { useContext } from "react"
import { useTable } from "react-table"
import { useState } from "react"
import { useMemo } from "react"
import { SearchContext } from "../Droneslist/Droneslist"
import "../../App.css"

function Table({ data }) {

const columns = React.useMemo(
  () => [    {      Header: 'Drone SN',      accessor: 'droneSN'    },    {      Header: 'Distance',      accessor: 'distance',      defaultSortDesc: true    },    {      Header: 'First Name',      accessor: 'firstName'    },    {      Header: 'Last Name',      accessor: 'lastName'    },    {      Header: 'Phone',      accessor: 'phoneNumber'    },    {      Header: 'E-mail',      accessor: 'email'    },    {      Header: 'Colour',      accessor: 'colour',      Cell: ({ value }) => (        <div style={{ color: value, backgroundColor: value, width: '100%', height: '100%' }}>          {value}        </div>      )    }  ],
  []
)

const [sortBy, setSortBy] = useState({});
const [sortDirection, setSortDirection] = useState(null);
const { searchQuery } = useContext(SearchContext);
const filteredData = useMemo(() => {
  return data.filter(row => {
    return Object.values(row).some(val =>
      val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
}, [data, searchQuery]);

const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
} = useTable({ columns, data: filteredData, state: { sortBy, sortDirection }, manualSorting: true });

// Function to handle sorting when a column header is clicked
const handleSort = column => {
  setSortBy(column);
  setSortDirection(sortBy.accessor === column.accessor ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
    };

    if (!filteredData.length) {
      return <p>No results found</p>;
    }
    
  
return (

  <table {...getTableProps()} className="table">
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()} onClick={() => handleSort(column)}>
              {column.render('Header')}
              {sortBy.accessor === column.accessor && (
                <span>
                  {sortDirection === 'asc' ? ' v' : ' ^'}
                </span>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
  
);
  }

  export default Table