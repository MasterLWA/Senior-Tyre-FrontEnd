import React, { useState, useEffect } from "react";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";

const Grn = () => {
  const [grn, setGrn] = useState([]);
    const [newGrnItem, setNewGrnItem] = useState({
        ItemName: "",
        ItemCode: "",
        Quantity: "",
        CostPrice: "",
        MinSellPrice: "",
        WholeSellPrice: "",
        SellingPrice: "",
        ValueRemarks: "",
    });

        useEffect(() => {
            /**
             * Fetches GRN data from the server.
             * @async
             * @function fetchGrn
             * @returns {Promise<void>}
             */
            const fetchGrn = async () => {
                try {
                    const res = await fetch(ENDPOINT+'/grn');
                    const json = await res.json();

                    if (res.ok) {
                        setGrn(json);
                    } else {
                        console.error('Request failed with status', res.status);
                        // show alert
                        alert('GRN failed to fetch');
                    }
                } catch (error) {
                    console.error('Error making GET request:', error.message);
                }
            };

            fetchGrn();
        }, []);

        console.log(grn);



        /**
         * Deletes a GRN item with the specified ID from the server and updates the state accordingly.
         * @async
         * @param {string} id - The ID of the GRN item to be deleted.
         * @returns {Promise<void>}
         */

        const handleDeleteGrnItem = async (id) => {
            try {
            const response = await fetch(ENDPOINT+`/grn/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setGrn((prevGrn) => prevGrn.filter((grnItem) => grnItem._id !== id));
                // show alert
                alert('GRN item deleted successfully');
            } else {
                console.error('Failed to delete GRN item with status:', response.status);
                // show alert
                alert('Failed to delete GRN item! Refresh the page and try again.');
            }
            } catch (error) {
            console.error('Error deleting GRN item:', error.message);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
            const response = await fetch(ENDPOINT+'/grn', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGrnItem),
            });

            if (response.ok) {
                const newGrnItemData = await response.json();
                setGrn([...grn, newGrnItemData]);
                setNewGrnItem({
                ItemName: "",
                ItemCode: "",
                Quantity: 0,
                CostPrice: 0,
                MinSellPrice: 0,
                WholeSellPrice: 0,
                SellingPrice: 0,
                ValueRemarks: "",
                });
                // show alert
                alert('GRN item added successfully');
            } else {
                console.error('Failed to add GRN item with status:', response.status);
                // show alert
                alert('Failed to add GRN item! Refresh the page and try again.');
            }
            } catch (error) {
            console.error('Error adding GRN item:', error.message);
            }
        };

    // Handles the change event of the input elements.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewGrnItem({
        ...newGrnItem,
        [name]: value,
        });
    };

  return (
    <div>

      <NavButton />

      <div className="form container m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">

        <h1 className="text-center mb-3">GRN Form</h1>

        <form onSubmit={handleSubmit}>

            <div className="form-group m-2">

                <label htmlFor="ItemName" className="form-label m-1"> <span className="text-danger">1. </span>Item Name</label>

                <input
                type="text"
                placeholder="Item Name"
                className="form-control p-1 mx-auto"
                name="ItemName"
                value={newGrnItem.ItemName}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="ItemCode" className="form-label m-1"> <span className="text-danger">2. </span>Item Code</label>

                <input
                type="text"
                placeholder="Item Code"
                className="form-control p-1 mx-auto"
                name="ItemCode"
                value={newGrnItem.ItemCode}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="Quantity" className="form-label m-1"> <span className="text-danger">3. </span>Quantity</label>

                <input
                type="number"
                placeholder="Quantity"
                className="form-control p-1 mx-auto"
                name="Quantity"
                value={newGrnItem.Quantity}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="CostPrice" className="form-label m-1"> <span className="text-danger">4. </span>Cost Price</label>

                <input
                type="number"
                placeholder="Cost Price"
                className="form-control p-1 mx-auto"
                name="CostPrice"
                value={newGrnItem.CostPrice}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="MinSellPrice" className="form-label m-1"> <span className="text-danger">5. </span>Min Sell Price</label>

                <input
                type="number"
                placeholder="Min Sell Price"
                className="form-control p-1 mx-auto"
                name="MinSellPrice"
                value={newGrnItem.MinSellPrice}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="WholeSellPrice" className="form-label m-1"> <span className="text-danger">6. </span>Whole Sell Price</label>

                <input
                type="number"
                placeholder="Whole Sell Price"
                className="form-control p-1 mx-auto"
                name="WholeSellPrice"
                value={newGrnItem.WholeSellPrice}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="SellingPrice" className="form-label m-1"> <span className="text-danger">7. </span>Selling Price</label>

                <input
                type="number"
                placeholder="Selling Price"
                className="form-control p-1 mx-auto"
                name="SellingPrice"
                value={newGrnItem.SellingPrice}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group m-2">

                <label htmlFor="ValueRemarks" className="form-label m-1"> <span className="text-danger">8. </span>Value Remarks</label>

                <input
                type="text"
                placeholder="Value Remarks"
                className="form-control p-1 mx-auto"
                name="ValueRemarks"
                value={newGrnItem.ValueRemarks}
                onChange={handleChange}
                />
            </div>

            {/* submit button */}
            <div className="text-center m-2">
            <button type="submit" className="btn btn-primary text-center">Submit</button>
            </div>

        </form>

      </div>
      <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
        <h1 className="text-center mb-3">GRN Table</h1>
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Min Sell Price</th>
              <th>Whole Sell Price</th>
              <th>Selling Price</th>
              <th>Value Remarks</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {grn.map((grnItem) => (
              <tr key={grnItem._id}>
                <td>{grnItem.ItemName}</td>
                <td>{grnItem.Quantity}</td>
                <td>{grnItem.CostPrice}</td>
                <td>{grnItem.MinSellPrice}</td>
                <td>{grnItem.WholeSellPrice}</td>
                <td>{grnItem.SellingPrice}</td>
                <td>{grnItem.ValueRemarks}</td>
                <td>
                  <button className="btn btn-primary">Update</button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteGrnItem(grnItem._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grn;