import ReactPaginate from "react-paginate";
import { useState } from "react";


export default function Table({ tableData , onDeleteRow}) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; 
    
    const totalPages = Math.ceil((tableData?.length - 1) / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = tableData.slice(startIndex, endIndex);
    return (
        <>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                {tableData.length > 0 &&
                  tableData[0].map((header, index) => (
                    <th key={index} className="border p-2 text-white bg-green-300">{header}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">{cell}</td>
                  ))}
                   <td>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => onDeleteRow(rowIndex)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      
          <div className="mt-4 flex justify-center">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded">Prev</button>
      
            <span className="px-4">{currentPage} / {totalPages}</span>
      
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-300 rounded">Next</button>
          </div>
        </>
      );
}
