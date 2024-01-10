import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { ENDPOINT } from "../../config";
import NavButton from "../../Components/NavButtons";

const Reports = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // generatePDFReport function
  const generatePDFReport = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/getbytime/${fromDate}/${toDate}`);
      const data = response.data;

      const doc = new jsPDF();
      doc.text(`Profit Analysis Report (${fromDate} to ${toDate})`, 15, 15);
      doc.setTextColor(0, 0, 255); // Set text color to blue

      const tableData = data.map(item => [
        item.item,
        item.unitCostPrice,
        item.unitSellingPrice,
        item.totalSellingItems,
        item.totalSellingPrice,
        item.profit,
        item.day,
      ]);

      doc.autoTable({
        head: [['Item', 'Unit Cost Price', 'Unit Selling Price', 'Total Selling Items', 'Total Selling Price', 'Profit', 'Day']],
        body: tableData,
        startY: 25,
        theme: 'striped', // Add striped background to the table
        styles: { textColor: [0, 0, 0], fontStyle: 'bold', fillColor: [200, 220, 255] }, // Set text color to black, make text bold, and set background color
      });

      const totalIncome = data.reduce((total, item) => total + item.totalSellingPrice, 0);
      const profit = data.reduce((total, item) => total + item.profit, 0);
      const totalCost = data.reduce((total, item) => total + item.unitCostPrice * item.totalSellingItems, 0);

      
      doc.text(`Total Income      : Rs.${totalIncome}`, 15, doc.autoTable.previous.finalY + 15);
      doc.text(`Total Cost        : Rs.${totalCost}`, 15, doc.autoTable.previous.finalY + 25);
      doc.text(`Total Profit      : Rs.${profit}`, 15, doc.autoTable.previous.finalY + 35); 


      // bottom of the page, center  shows powered by Lakindu
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        "Powered by LWA Technologies",
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      


      // doc.text(`Earnings: Rs.${earnings}`, 15, doc.autoTable.previous.finalY + 20);
      // doc.text(`Loss: Rs.${loss}`, 15, doc.autoTable.previous.finalY + 25);

      doc.save(`Profit_Analysis_Report_${fromDate}_${toDate}.pdf`);
    } catch (error) {
      console.error("Error generating PDF report:", error.message);
    }
  };


// generateExcelReport function
  const generateExcelReport = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/getbytime/${fromDate}/${toDate}`);
      const data = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Profit Analysis Report");

      // Add header row
      worksheet.addRow(['Item', 'Unit Cost Price', 'Unit Selling Price', 'Total Selling Items', 'Total Selling Price', 'Profit', 'Day']);

      // Add data rows
      data.forEach(item => {
        worksheet.addRow([item.item, item.unitCostPrice, item.unitSellingPrice, item.totalSellingItems, item.totalSellingPrice, item.profit, item.day]);
      });

      const totalIncome = data.reduce((total, item) => total + item.totalSellingPrice, 0);
      const profit = data.reduce((total, item) => total + item.profit, 0);
      const totalCost = data.reduce((total, item) => total + item.unitCostPrice * item.totalSellingItems, 0);
      const totalSellingItems = data.reduce((total, item) => total + item.totalSellingItems, 0);
  


      // Add totalProfit and totalCost to worksheet
      worksheet.addRow([]);
      worksheet.addRow(['Total Income', totalIncome]);
      worksheet.addRow(['Total Cost', totalCost]);
      worksheet.addRow(['Total Profit', profit]);
      worksheet.addRow(['Total Selling Items', totalSellingItems]);



      // Generate buffer and save
      const excelBuffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        `Profit_Analysis_Report_${fromDate}_${toDate}.xlsx`
      );
    } catch (error) {
      console.error("Error generating Excel report:", error.message);
    }
  };

// StockAnalysisexcel function
const stockAnalysisExcel = async () => {
  try {
    const response = await axios.get(`${ENDPOINT}/grn`);
    const data = response.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stock Analysis Report");

    // Add header row
    worksheet.addRow(['Item', 'Ware House Quantity', 'Shop Quantity']);

    // Add data rows
    data.forEach(item => {
      worksheet.addRow([item.ItemName, item.Quantity, item.subGRNQuantity]);
    });

    // Generate buffer and save
    const excelBuffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `Stock_Analysis_Report.xlsx`
    );
  } catch (error) {
    console.error("Error generating Excel report:", error.message);
  }
};


  return (
    <div>
       <NavButton />
      <div className="container">
        <h1 className="text-center mb-3 mt-3">Reports</h1>

        <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
          <form>

            <h3 className="text-center mb-3 mt-3"
            >Profit Analysis</h3>
            <div className="row">
              <div className="col">
                <label htmlFor="fromDate">From</label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  placeholder="From"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="toDate">To</label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  placeholder="To"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={generatePDFReport}
                  disabled={!fromDate || !toDate}
                >
                  Generate PDF
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-success mt-3"
                  onClick={generateExcelReport}
                  disabled={!fromDate || !toDate}
                >
                  Generate Excel
                </button>
              </div>
            </div>

            <hr />

            <div className="container text-center m-5">
              <h3 className="text-center mb-3 mt-3"
              >Stock Analysis</h3>
              <button type="button" className="btn btn-primary mt-3" onClick={stockAnalysisExcel}>
                View Stock Analysis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Reports;
