import React, { useState, useEffect } from "react";
import {useParams } from "react-router-dom";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";

const Editgrn = () => {
  const { id } = useParams();
  const [grnItem, setGrnItem] = useState({
    ItemName: "",
    CostPrice: "",
    MinSellPrice: "",
    WholeSellPrice: "",
    SellingPrice: "",
    ValueRemarks: "",
    addRemove: "add",
  });

  useEffect(() => {
    const fetchGrnItem = async () => {
      try {
        const res = await fetch(`${ENDPOINT}/grn/${id}`);
        const json = await res.json();

        if (res.ok) {
          setGrnItem(json);
        } else {
          console.error("Failed to fetch GRN item with status:", res.status);
        }
      } catch (error) {
        console.error("Error fetching GRN item:", error.message);
      }
    };

    fetchGrnItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedGrnItem = {
      ...grnItem,
    };

    try {
      const response = await fetch(`${ENDPOINT}/grn/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGrnItem),
      });

      if (response.ok) {
        alert("GRN item updated successfully");
        // refresh the page
        window.location.reload();
      } else {
        console.error("Failed to update GRN item with status:", response.status);
        alert("Failed to update GRN item! Refresh the page and try again.");
      }
    } catch (error) {
      console.error("Error updating GRN item:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrnItem({
      ...grnItem,
      [name]: value,
    });
  };

  return (
    <div>
      <NavButton />
      <div className="form container m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
        <h1 className="text-center mb-3">Update GRN Form</h1>
        <form onSubmit={handleSubmit}>
          <h5>Editing Details of: <span className="text-danger">{grnItem.ItemName}</span></h5>
          <h5>Current Stock in the WareHouse is: <span className="text-success">{grnItem.Quantity}</span></h5>
          <hr />

          <label htmlFor="ItemName">1. Item Name</label>
          <input
            type="text"
            placeholder="Item Name"
            className="mt-1 form-control mx-auto"
            name="ItemName"
            id="ItemName"
            value={grnItem.ItemName}
            onChange={handleChange}
          />

          <label htmlFor="CostPrice">2. Cost Price</label>
          <input
            type="text"
            placeholder="Cost Price"
            className="mt-1 form-control mx-auto"
            name="CostPrice"
            id="CostPrice"
            value={grnItem.CostPrice}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="MinSellPrice">3. Min Sell Price</label>
          <input
            type="text"
            placeholder="Min Sell Price"
            className="mt-1 form-control mx-auto"
            name="MinSellPrice"
            id="MinSellPrice"
            value={grnItem.MinSellPrice}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="WholeSellPrice">4. Whole Sell Price</label>
          <input
            type="text"
            placeholder="Whole Sell Price"
            className="mt-1 form-control mx-auto"
            name="WholeSellPrice"
            id="WholeSellPrice"
            value={grnItem.WholeSellPrice}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="SellingPrice">5. Selling Price</label>
          <input
            type="text"
            placeholder="Selling Price"
            className="mt-1 form-control mx-auto"
            name="SellingPrice"
            id="SellingPrice"
            value={grnItem.SellingPrice}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="ValueRemarks">6. Value Remarks</label>
          <input
            type="text"
            placeholder="Value Remarks"
            className="mt-1 form-control mx-auto"
            name="ValueRemarks"
            id="ValueRemarks"
            value={grnItem.ValueRemarks}
            onChange={handleChange}
          />
          <br />
{/* 
          <label htmlFor="QuantityChange">7. Quantity (add/remove)</label>
          <input
            type="text"
            placeholder="Quantity"
            className="mt-1 form-control mx-auto"
            name="QuantityChange"
            id="QuantityChange"
            value={grnItem.QuantityChange || 0}
            onChange={handleChange}
          />
          <br />
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="addRemove"
              id="add"
              value="add"
              checked={grnItem.addRemove === "add"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="add">
              Add
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="addRemove"
              id="remove"
              value="remove"
              checked={grnItem.addRemove === "remove"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="remove">
              Remove
            </label>
          </div> */}

          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </div>
  );
};

export default Editgrn;
