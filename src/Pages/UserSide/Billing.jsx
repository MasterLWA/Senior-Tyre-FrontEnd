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
  const [grn, setGrn] = useState([]); // Assuming you have access to /grn data
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [addedItems, setAddedItems] = useState([]);

    // Fetch /grn data on component mount
    useEffect(() => {
        const fetchGrn = async () => {
        try {
            const res = await fetch(ENDPOINT+"/grn");
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

    /**
     * Updates the quantity count in the GRN for a specific item.
     * @param {string} itemName - The name of the item to update.
     * @param {number} quantitySold - The quantity sold of the item.
     * @returns {void}
     */
    const updateGrnQuantity = (itemName, quantitySold) => {
        const updatedGrn = grn.map((item) => {
        if (item.ItemName === itemName) {
            // Decrease the quantity count of the selected item
            item.Quantity -= quantitySold;
        }
        return item;
        });

        // Update the state with the new GRN data
        setGrn(updatedGrn);
    };

    /**
     * Adds a new item to the invoice and updates the GRN.
     * @returns {void}
     */
    const addItemToInvoice = () => {
        if (selectedItem === "Select" || quantity <= 0) {
        return;
        }

        const selectedItemData = grn.find((item) => item.ItemName === selectedItem);

        if (!selectedItemData) {
        return;
        }

        // Check if the item has already been added to the invoice
        if (addedItems.includes(selectedItemData.ItemName)) {
        return;
        }

        const newItem = {
        Item: selectedItemData.ItemName,
        Quantity: quantity,
        Price: selectedItemData.SellingPrice,
        Amount: quantity * selectedItemData.SellingPrice,
        };

        // Update the invoice items and total amount
        setInvoiceItems([...invoiceItems, newItem]);
        setTotalAmount(totalAmount + newItem.Amount);

        // Mark the item as added to the invoice
        setAddedItems([...addedItems, selectedItemData.ItemName]);

        // Clear the form fields
        setSelectedItem("Select");
        setQuantity(1);
        setDiscountPercentage(0);
    };

    /**
     * Removes an item from the invoice and updates the GRN.
     * @param {number} indexToRemove - The index of the item to remove from the invoice.
     * @returns {void}
     */
    const removeItemFromInvoice = (indexToRemove) => {
        const removedItem = invoiceItems[indexToRemove];

        // Calculate the new total amount
        const newTotalAmount = totalAmount - removedItem.Amount;

        // Update the invoice items and total amount
        setInvoiceItems((prevItems) =>
        prevItems.filter((_, index) => index !== indexToRemove)
        );
        setTotalAmount(newTotalAmount);

        // Mark the item as removed from the added items list
        setAddedItems(
        addedItems.filter((item) => item !== removedItem.Item)
        );
    };

    /**
     * Apply the discount as a percentage of the total amount.
     * @returns {void}
     */
    const applyDiscount = () => {
       // const discountAmount = (discountPercentage / 100) * totalAmount;
        const discountedTotalAmount = totalAmount - discountPercentage;

        // Update the total amount with the discount applied
        setTotalAmount(discountedTotalAmount);
        // setDiscountPercentage(0); // Reset discount percentage
    };


    /**
     * Generate invoice, reduce the quantity of items in GRN, and generate the invoice PDF.
     * @returns {void}
     */
    const generateInvoice = () => {
        // Create a new jsPDF instance
        const doc = new jsPDF();
      
        // Define the columns and rows for the invoice table
        const columns = ["Item", "Quantity", "Price", "Amount"];
        const rows = invoiceItems.map((item) => [
          item.Item,
          item.Quantity,
          item.Price,
          item.Amount,
        ]);
      
        // Calculate the total amount after applying the discount
        const discount = discountPercentage;
        const discountedTotalAmount = totalAmount - discount;
      
        // Set the content of the invoice PDF
        doc.text("Invoice", 10, 10);
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 20,
        });
      
        // Add the total amount and discount to the PDF
        doc.text(`Total Amount: Rs.${totalAmount}`, 10, doc.autoTable.previous.finalY + 10);
        doc.text(`Discount: Rs.${discountPercentage}`, 10, doc.autoTable.previous.finalY + 20);
        doc.text(`Total Amount (after discount): Rs.${discountedTotalAmount}`, 10, doc.autoTable.previous.finalY + 30);
      
        // Save the PDF
        doc.save("invoice.pdf");
      
        // Iterate over invoice items to update the GRN quantity
        invoiceItems.forEach((invoiceItem) => {
          const grnItem = grn.find((item) => item.ItemName === invoiceItem.Item);
          if (grnItem) {
            const updatedQuantity = grnItem.Quantity - invoiceItem.Quantity;
            updateGRNItemQuantity(grnItem._id, updatedQuantity);
          }
        });
      
        // Show an alert
        alert("Invoice generated successfully!");
      
        // You may want to clear the invoice or show a success message
        setInvoiceItems([]);
        setTotalAmount(0);
      
        // You can also reset the discount input field
        setDiscountPercentage(0);
      
        // Reset the added items list
        setAddedItems([]);
      };

    async function updateGRNItemQuantity(itemId, updatedQuantity) {
        try {
        const response = await axios.patch(ENDPOINT+`/grn/${itemId}`, { Quantity: updatedQuantity }, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        if (response.status === 200) {
            console.log(`GRN item ${itemId} quantity updated successfully`);
        } else {
            console.error(`Failed to update GRN item ${itemId} quantity with status: ${response.status}`);
        }
        } catch (error) {
        console.error(`Error updating GRN item ${itemId} quantity:`, error.message);
        }
    }
    

  return (
    <div className="w-100">
      <NavButton />

      <h1 className="text-center">Billing</h1>

      <div className="row d-flex justify-content-center">
        {/* form to add items to invoice */}
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
                    {item.ItemName}
                  </option>
                ))}
              </select>
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
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addItemToInvoice}
            >
              Add Item
            </button>
          </form>
        </div>

        {/* table to show items in invoice */}
        <div className="col-md-7 border border-primary rounded bg-white m-1 p-5 shadow">
          <h3 className="text-center mt-2">Invoice</h3>
          <table className="table table-striped table-hover table-bordered mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
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
              {/* input to add discount */}
              <div className="form-group">
                <label htmlFor="discount" className="label mt-2">
                  Add Discount
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="discount"
                  placeholder="Discount"
                  value={discountPercentage}
                  onChange={(e) =>
                    setDiscountPercentage(parseFloat(e.target.value))
                  }
                />
              </div>

              {/* show total amount */}
              <div className="card bg-primary text-white m-2">
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
