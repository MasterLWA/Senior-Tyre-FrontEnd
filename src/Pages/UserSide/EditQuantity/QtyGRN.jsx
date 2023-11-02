import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavButton from "../../../Components/NavButtons";
import { ENDPOINT } from "../../../config";

const QtyGRN = () => {
  const { id } = useParams();
  const [grnItem, setGrnItem] = useState({
    ItemName: "",
    Quantity: 0,
    addRemove: "add",
    QuantityChange: 0,
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

    const quantityChange = parseInt(grnItem.QuantityChange);

    if (quantityChange !== 0 && (grnItem.addRemove === "add" || grnItem.addRemove === "remove")) {
      const updatedQuantity =
        grnItem.addRemove === "add"
          ? grnItem.Quantity + quantityChange
          : grnItem.Quantity - quantityChange;

      const updatedGrnItem = {
        ...grnItem,
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
          alert("GRN quantity updated successfully");
          // refresh the page
          window.location.reload();
        } else {
          console.error("Failed to update GRN quantity with status:", response.status);
          alert("Failed to update GRN quantity! Refresh the page and try again.");
        }
      } catch (error) {
        console.error("Error updating GRN quantity:", error.message);
      }
    } else {
      alert("Quantity change is zero or 'Add'/'Remove' is not selected. No updates were made.");
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
        <h1 className="text-center mb-3">Change GRN Quantity</h1>
        <form onSubmit={handleSubmit}>
          <h5>Editing Details of: <span className="text-danger">{grnItem.ItemName}</span></h5>
          <h5>Current Stock in the Warehouse is: <span className="text-success">{grnItem.Quantity}</span></h5>
          <hr />

          <label htmlFor="QuantityChange">Change Item Quantity</label>
          <input
            type="text"
            placeholder="Quantity"
            className="mt-1 form-control mx-auto"
            name="QuantityChange"
            id="QuantityChange"
            value={grnItem.QuantityChange || 0}
            onChange={handleChange}
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
              required
            />
            <label className="form-check-label" htmlFor="remove">
              Remove
            </label>
          </div>

          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </div>
  );
};

export default QtyGRN;
