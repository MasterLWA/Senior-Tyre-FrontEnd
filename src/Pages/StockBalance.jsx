import React,{useState,useEffect} from "react";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";


const StockBalanceTable = () => {
  
  const [stockData, setStockData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ENDPOINT);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  // Function to determine availability color based on a condition
  const getAvailabilityColor = (availability) => (availability ? 'green' : 'red');

  return (
    <div className="container">
      <h1 className="text-center mb-3">Stock Balance Table</h1>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stockItem) => (
            <tr key={stockItem.id}>
              <td>{stockItem.item}</td>
              <td>{stockItem.quantity}</td>
              <td>{stockItem.costPrice}</td>
              <td style={{ color: getAvailabilityColor(stockItem.availability) }}>
                {stockItem.availability ? 'Available' : 'Not Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockBalanceTable;
