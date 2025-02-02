import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Table from "./Table"
import toast from 'react-hot-toast';

export default function FileUpload() {
  const [error, setError] = useState(null);
  const [sheets, setSheets] = useState([]); 
  const [selectedSheet, setSelectedSheet] = useState(""); 
  const [tableData, setTableData] = useState([]); 
  const [workbook , setWorkBook] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file.name.endsWith(".xlsx") || file.size >= 3 * 1024 * 1024) {
      setError("Only .xlsx files under 2MB are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheetNames = wb.SheetNames;
      setSheets(sheetNames);
      setSelectedSheet(sheetNames[0]); 
      loadSheetData(wb, sheetNames[0]); 
      setWorkBook(wb)
    };
    reader.readAsArrayBuffer(file);
  };

  const loadSheetData = (workbook, sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log("inside load sheet");
    
    setTableData(jsonData);
  };

  const handleSheetChange = (e) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    if (workbook) {
        loadSheetData(workbook, sheetName);
      }
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
    toast.success('Row is deleted successfully')
  };

  const handleImport = async () => {
    if (tableData.length === 0) {
      toast.error("No data to import!");
      return;
    }

    try {
      const response = await fetch("https://excel-data-importer-vjhs.onrender.com/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: tableData }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Data imported successfully!");
      } else {
        toast.error(`Some rows failed to import ${result.skipped}`);
      }
    } catch (error) {
      toast.error("Error importing data.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="p-6 flex flex-col justify-center items-center gap-8">
      <div {...getRootProps()} className="p-4 -md cursor-pointer border-dashed w-1/2 rounded-full mb-8">
        <input {...getInputProps()} />
        <p className="text-2xl font-bold text-blue-400 text-center mb-5">Drag and drop an Excel file, or click to select one.</p>
        {error && <p className="text-red-500">{error}</p>}
      </div>
        <div className="mt-8">
            <div className="mt-4">
                <label className="font-bold">Select Sheet:</label>
                <select value={selectedSheet} onChange={handleSheetChange} className="ml-2 border p-2">
                {sheets.map((sheet, index) => (
                    <option key={index} value={sheet}>
                    {sheet}
                    </option>
                ))}
                </select>
            </div>
            <Table tableData={tableData} onDeleteRow={handleDeleteRow} />
            <button
              onClick={handleImport}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Import Data
            </button>
        </div>
    </div>

  );
}
