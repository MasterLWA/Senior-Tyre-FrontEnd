import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavButton from "../../../Components/NavButtons";
import { ENDPOINT } from "../../../config";

const QtySubGRN = () => {
  const { id } = useParams();
  const [grnItem, setGrnItem] = useState({
    ItemName: "",
    Quantity: 0, // Current quantity
    subGRNQuantity: 0, // SubGRN quantity
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

    const quantityChange = parseInt(e.target.QuantityChange.value);

    if (quantityChange !== 0) {
      let updatedQuantity = grnItem.Quantity;
      let updatedSubGRNQuantity = grnItem.subGRNQuantity;

      const selectedOperation = e.target.addRemove.value;

      if (selectedOperation === "add") {
        // Add to the Shop: Plus entered value to subGRNQuantity and minus it from Quantity
        updatedSubGRNQuantity += quantityChange;
        updatedQuantity -= quantityChange;
      } else if (selectedOperation === "return") {
        // Return to the Warehouse: Minus entered value from subGRNQuantity and plus it to Quantity
        updatedSubGRNQuantity -= quantityChange;
        updatedQuantity += quantityChange;
      } else if (selectedOperation === "remove") {
        // Remove from subGRNQuantity: Minus entered value from subGRNQuantity
        updatedSubGRNQuantity -= quantityChange;
      }

      const updatedGrnItem = {
        ...grnItem,
        subGRNQuantity: updatedSubGRNQuantity,
        Quantity: updatedQuantity,
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
          alert("GRN subGRNQuantity updated successfully");
          // Refresh the page as needed
          window.location.reload();
        } else {
          console.error("Failed to update GRN subGRNQuantity with status:", response.status);
          alert("Failed to update GRN subGRNQuantity! Refresh the page and try again.");
        }
      } catch (error) {
        console.error("Error updating GRN subGRNQuantity:", error.message);
      }
    } else {
      alert("Quantity change is zero. No updates were made.");
    }
  };

  return (
    <div>
      <NavButton />
      <div className="form container m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
        <h1 className="text-center mb-3">Change GRN subGRNQuantity</h1>
        <form onSubmit={handleSubmit}>
          <h4>Balance Shop Quantities of: <span className="text-danger">{grnItem.ItemName}</span></h4>
          <h5>Current Stock in the Warehouse is: <span className="text-success">{grnItem.Quantity}</span></h5>
          <h5>Current Stock in the Shop is: <span className="text-success">{grnItem.subGRNQuantity}</span></h5>
          <hr />

          <label htmlFor="QuantityChange">Change Item Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            className="mt-1 form-control mx-auto"
            name="QuantityChange"
            id="QuantityChange"
            required
          />
          <br />

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="addRemove"
              id="add"
              value="add"
              required
            />
            <label className="form-check-label" htmlFor="add">
              Add to the Shop
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="addRemove"
              id="return"
              value="return"
              required
            />
            <label className="form-check-label" htmlFor="return">
              Return to Warehouse
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="addRemove"
              id="remove"
              value="remove"
              required
            />
            <label className="form-check-label" htmlFor="remove">
              Remove from subGRNQuantity
            </label>
          </div>

          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </div>
  );
};

export default QtySubGRN;
