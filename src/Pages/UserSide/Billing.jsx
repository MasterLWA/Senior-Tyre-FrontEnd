import React, { useState, useEffect } from "react";
import NavButton from "../../Components/NavButtons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ENDPOINT } from "../../config";

const Billing = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Select");
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [grn, setGrn] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [PricePerItem, setPricePerItem] = useState(0);
  const [selectedItemData, setSelectedItemData] = useState(null);

  // Fetch /grn data on component mount
  useEffect(() => {
    const fetchGrn = async () => {
      try {
        const res = await fetch(ENDPOINT + "/grn");
        if (res.ok) {
          const data = await res.json();
          setGrn(data);
        } else {
          console.error("Request failed with status", res.status);
        }
      } catch (error) {
        console.error("Error making GET request:", error.message);
      }
    };

    fetchGrn();
  }, []);

  useEffect(() => {
    if (selectedItem !== "Select") {
      const selectedItemData = grn.find((item) => item.ItemName === selectedItem);
      setSelectedItemData(selectedItemData);
    } else {
      setSelectedItemData(null);
    }
  }, [selectedItem, grn]);

  const updateGrnQuantity = (itemName, quantitySold) => {
    const updatedGrn = grn.map((item) => {
      if (item.ItemName === itemName) {
        item.subGRNQuantity -= quantitySold;
      }
      return item;
    });

    setGrn(updatedGrn);
  };

  const addItemToInvoice = () => {
    if (selectedItem === "Select" || !selectedItemData || selectedItemData.subGRNQuantity <= 0 || PricePerItem <= 0) {
      return;
    }

    if (addedItems.includes(selectedItemData.ItemName)) {
      return;
    }

    const newItem = {
      Item: selectedItemData.ItemName,
      Quantity: quantity,
      Supplier: selectedItemData.SupplierName,
      Price: PricePerItem,
      Amount: quantity * PricePerItem,
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setTotalAmount(totalAmount + newItem.Amount);

    setAddedItems([...addedItems, selectedItemData.ItemName]);

    const updatedSubGRNQuantity = selectedItemData.subGRNQuantity - quantity;
    updateGrnQuantity(selectedItemData.ItemName, quantity);

    setSelectedItem("Select");
    setQuantity(1);
    setPricePerItem(0);
    setDiscountPercentage(0);
  };

  const removeItemFromInvoice = (indexToRemove) => {
    const removedItem = invoiceItems[indexToRemove];
    const newTotalAmount = totalAmount - removedItem.Amount;

    setInvoiceItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
    setTotalAmount(newTotalAmount);

    setAddedItems(addedItems.filter((item) => item !== removedItem.Item));
  };

  const applyDiscount = () => {
    const discountedTotalAmount = totalAmount - discountPercentage;
    setTotalAmount(discountedTotalAmount);
  };

  const generateInvoice = () => {
    const doc = new jsPDF();

    const columns = ["Item", "Quantity","Supplier", "Price", "Amount"];
    const rows = invoiceItems.map((item) => [
      item.Item,
      item.Quantity,
      item.Supplier,
      item.Price,
      item.Amount,
    ]);

    const discount = discountPercentage;
    const discountedTotalAmount = totalAmount - discount;

    doc.text("Invoice", 10, 10);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.text(`Total Amount: Rs.${totalAmount}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`Discount: Rs.${discountPercentage}`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Total Amount (after discount): Rs.${discountedTotalAmount}`, 10, doc.autoTable.previous.finalY + 30);

    doc.save("invoice.pdf");

    invoiceItems.forEach((invoiceItem) => {
      const grnItem = grn.find((item) => item.ItemName === invoiceItem.Item);
      if (grnItem) {
        const updatedSubGRNQuantity = grnItem.subGRNQuantity - invoiceItem.Quantity;
        updateGrnQuantity(grnItem.ItemName, updatedSubGRNQuantity);
      }
    });

    alert("Invoice generated successfully!");

    setInvoiceItems([]);
    setTotalAmount(0);
    setDiscountPercentage(0);
    setAddedItems([]);
  };



  return (
    <div className="w-100">
      <NavButton />

      <h1 className="text-center">Billing</h1>

      <div className="row d-flex justify-content-center">
        <div className="col-md-4 border border-dark rounded bg-white m-1 d-inline-block p-5">
          <form className="m-2" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="item" className="label mt-3">
                Item
              </label>
              <select
                className="form-control"
                id="item"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="Select">Select</option>
                {grn.map((item) => (
                  <option key={item._id} value={item.ItemName}>
                    {item.ItemName} - Price: {item.Price} - subGRNQuantity: {item.subGRNQuantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="PricePerItem" className="label mt-2">
                Price per Item
              </label>
              <input
                type="number"
                className="form-control"
                id="PricePerItem"
                placeholder="Price per Item"
                value={PricePerItem}
                onChange={(e) => setPricePerItem(parseFloat(e.target.value))} />
            </div>


            <div className="form-group">
              <label htmlFor="quantity" className="label mt-2">
                Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))
              } />
            </div>

            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addItemToInvoice}
              disabled={!(selectedItemData && selectedItemData.subGRNQuantity > 0 && PricePerItem > 0)}
            >
              Add Item
            </button>
          </form>
        </div>

        <div className="col-md-7 border border-primary rounded bg-white m-1 p-5 shadow">
          <h3 className="text-center mt-2">Invoice</h3>
          <table className="table table-striped table-hover table-bordered mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.Item}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.Supplier}</td>
                  <td>{item.Price}</td>
                  <td>{item.Amount}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItemFromInvoice(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row d-flex justify-content-end">
            <div className="col-md-4">
              <div className="card bg-primary text white m-2">
                <div className="card-body">
                  <h3 className="card-title">Total Amount</h3>
                  <h5 className="card-text">Rs.{totalAmount}</h5>
                  <button className="btn btn-light" onClick={generateInvoice}>
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Billing;
