import React, { useState, useEffect } from "react";
import { ENDPOINT } from "../config";
import DashboardNavbar from "../Components/DashboardNavbar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [date] = useState(new Date().toISOString().slice(0, 10));

  // Call the API to get transactions based on the date
  useEffect(() => {
    fetch(`${ENDPOINT}/getbydate/${date}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.log(err));
  }, [date]);


  const updatesubGRNQuantitybyName = async (itemName, newQuantity) => {
    try {
      const response = await fetch(`${ENDPOINT}/grnbyname/${itemName}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valueToAdd: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subGRNQuantity");
      }
    } catch (err) {
      console.error("Error updating subGRNQuantity:", err.message);
    }
  };

  const deleteTransaction = async (id, itemName, quantity) => {
    try {
      const response = await fetch(`${ENDPOINT}/deletesell/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        window.alert("Deleted successfully!");
        updatesubGRNQuantitybyName(itemName, quantity);
      } else {
        console.log("Failed to delete transaction! Server returned an error.");
        window.alert("Failed to delete transaction!");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err.message);
      window.alert("Error deleting transaction. Please try again later.");
    } finally {
      window.location.reload();
    }
  };

  return (
    <div>
      <DashboardNavbar />

      <div className="container">
        <h1 className="text-center mb-3 mt-3 text-primary">Transactions</h1>
        <h3 className="text-center mb-3 mt-3">Date: {date}</h3>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Item Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Profit</th>
              <th scope="col">Total Price</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.item}</td>
                <td>{transaction.totalSellingItems}</td>
                <td>{transaction.profit}</td>
                <td>{transaction.unitSellingPrice}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTransaction(transaction._id, transaction.item, transaction.totalSellingItems)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;