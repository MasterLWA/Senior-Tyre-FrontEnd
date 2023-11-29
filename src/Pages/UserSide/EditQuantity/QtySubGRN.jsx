import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavButton from "../../../Components/NavButtons";
import { ENDPOINT } from "../../../config";

const QtySubGRN = () => {
  const { id } = useParams();
  const [grnItem, setGrnItem] = useState({
    ItemName: "",
    Quantity: 0,
    subGRNQuantity: 0,
  });

  const [quantityChange, setQuantityChange] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState("add");

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

  const handleQuantityChange = (e) => {
    setQuantityChange(parseInt(e.target.value));
  };

  const handleOperationChange = (operation) => {
    setSelectedOperation(operation);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantityChange !== 0) {
      let updatedSubGRNQuantity = grnItem.subGRNQuantity;
      let updatedQuantity = grnItem.Quantity;

      switch (selectedOperation) {
        case "add":
          updatedSubGRNQuantity += quantityChange;
          updatedQuantity -= quantityChange;
          break;
        case "return":
          updatedSubGRNQuantity -= quantityChange;
          updatedQuantity += quantityChange;
          break;
        case "remove":
          updatedSubGRNQuantity -= quantityChange;
          break;
        default:
          break;
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
          <h4>
            Balance Shop Quantities of: <span className="text-danger">{grnItem.ItemName}</span>
          </h4>
          <h5>
            Current Stock in the Warehouse is: <span className="text-success">{grnItem.Quantity}</span>
          </h5>
          <h5>
            Current Stock in the Shop is: <span className="text-success">{grnItem.subGRNQuantity}</span>
          </h5>
          <hr />

          <label htmlFor="QuantityChange">Change Item Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            className="mt-1 form-control mx-auto"
            name="QuantityChange"
            id="QuantityChange"
            value={quantityChange}
            onChange={handleQuantityChange}
            required
          />
          <br />

          {["add", "return", "remove"].map((operation) => (
            <div className="form-check" key={operation}>
              <input
                className="form-check-input"
                type="radio"
                name="addRemove"
                id={operation}
                value={operation}
                checked={selectedOperation === operation}
                onChange={() => handleOperationChange(operation)}
                required
              />
              <label className="form-check-label" htmlFor={operation}>
                {operation === "add" && "Add to the Shop"}
                {operation === "return" && "Return to Warehouse"}
                {operation === "remove" && "Remove from subGRNQuantity"}
              </label>
            </div>
          ))}

          <input type="submit" value="Save" className="btn btn-primary mt-3" />
        </form>
      </div>
    </div>
  );
};

export default QtySubGRN;
