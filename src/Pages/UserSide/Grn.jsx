import React, { useState, useEffect } from "react";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";
import { Link } from "react-router-dom";

/**
 * Renders a form for creating and deleting GRN items.
 * @returns {JSX.Element} The GRN form component.
 */
const Grn = () => {


  const [grn, setGrn] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [newGrnItem, setNewGrnItem] = useState({
    ItemName: "",
    ItemCode: "",
    Quantity: "",
    CostPrice: "",
    MinSellPrice: "",
    WholeSellPrice: "",
    SellingPrice: "",
    SupplierName: "", // Updated field name to match the select element
    PaymentMethod: "", // Updated field name to match the select element
    ValueRemarks: "",
    subGRNQuantity:0,
  });


  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(ENDPOINT + '/supplier');
        const json = await res.json();

        if (res.ok) {
          setSuppliers(json);
        } else {
          console.error('Request failed with status', res.status);
        }
      } catch (error) {
        console.error('Error making GET request for suppliers:', error.message);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchGrn = async () => {
      try {
        const res = await fetch(ENDPOINT + '/grn');
        const json = await res.json();

        if (res.ok) {
          setGrn(json);
        } else {
          console.error('Request failed with status', res.status);
          alert('GRN failed to fetch');
        }
      } catch (error) {
        console.error('Error making GET request:', error.message);
      }
    };

    fetchGrn();
  }, []);

  const handleDeleteGrnItem = async (id) => {
    try {
      const response = await fetch(ENDPOINT + `/grn/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setGrn((prevGrn) => prevGrn.filter((grnItem) => grnItem._id !== id));
        alert('GRN item deleted successfully');
      } else {
        console.error('Failed to delete GRN item with status:', response.status);
        alert('Failed to delete GRN item! Refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error deleting GRN item:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENDPOINT + '/grn', {
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
          Quantity: "",
          CostPrice: "",
          MinSellPrice: "",
          WholeSellPrice: "",
          SellingPrice: "",
          SupplierName: "",
          subsubGRNQuantity:0,
          PaymentMethod: "",
          ValueRemarks: "",
        });
        alert('GRN item added successfully');
      } else {
        console.error('Failed to add GRN item with status:', response.status);
        alert('Failed to add GRN item! Refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error adding GRN item:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGrnItem({
      ...newGrnItem,
      [name]: value,
    });
  };

  const filteredGrn = grn.filter(grnItem =>
    grnItem.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
 );

  return (
    <div>
      <NavButton />

      <div className="form container m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">


          <h1 className="text-center mb-3">GRN Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group m-2">
              <label htmlFor="ItemName" className="form-label m-1">
                <span className="text-danger">1. </span>Item Name
              </label>
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
              <label htmlFor="ItemCode" className="form-label m-1">
                <span className="text-danger">2. </span>Item Code
              </label>
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
              <label htmlFor="Quantity" className="form-label m-1">
                <span className="text-danger">3. </span>Quantity
              </label>
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
              <label htmlFor="CostPrice" className="form-label m-1">
                <span className="text-danger">4. </span>Cost Price
              </label>
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
              <label htmlFor="MinSellPrice" className="form-label m-1">
                <span className="text-danger">5. </span>Min Sell Price
              </label>
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
              <label htmlFor="WholeSellPrice" className="form-label m-1">
                <span className="text-danger">6. </span>Whole Sell Price
              </label>
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
              <label htmlFor="SellingPrice" className="form-label m-1">
                <span className="text-danger">7. </span>Selling Price
              </label>
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
              <label htmlFor="SupplierName" className="form-label m-1">
                <span className="text-danger">9. </span>Supplier Name
              </label>
              <select
                className="form-control p-1 mx-auto"
                name="SupplierName"
                value={newGrnItem.SupplierName}
                onChange={handleChange}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier.companyName}>
                    {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group m-2">
              <label htmlFor="ValueRemarks" className="form-label m-1">
                <span className="text-danger">8. </span>Value Remarks
              </label>
              <input
                type="text"
                placeholder="Value Remarks"
                className="form-control p-1 mx-auto"
                name="ValueRemarks"
                value={newGrnItem.ValueRemarks}
                onChange={handleChange}
              />
            </div>

            <div className="form-group m-2">

            <label htmlFor="PaymentMethod" className="form-label m-1">
              <span className="text-danger">10. </span> Payment Method
            </label>

                <select
                  className="form-control p-1 mx-auto"
                  name="PaymentMethod"
                  value={newGrnItem.PaymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card Payment">Card Payment</option>
                  <option value="Cheque">Cheque</option>
                </select>
          </div>


            <div className="text-center m-2">
              <button type="submit" className="btn btn-primary text-center">
                Submit
              </button>
            </div>
          </form>
        </div>




      <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">

        <h1 className="text-center mb-3">GRN Table</h1>

        {/* Search grn and visit it */}
        <div className="row d-flex justify-content-center align-items-center m-1 p-4">
          <div className="col-md-8 text-start">
            <input
              type="text"
              placeholder="Enter name to search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Supplier Name</th>
              <th>Payment Method</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Min Sell Price</th>
              <th>Whole Sell Price</th>
              <th>Selling Price</th>
              <th>Value Remarks</th>

              <th>Update</th>
              <th>Delete</th>
              <td>Change Quantity</td>
            </tr>
          </thead>
          <tbody>
            {filteredGrn.map((grnItem) => (
              <tr key={grnItem._id}>
                <td>{grnItem.ItemName}</td>
                <td>{grnItem.SupplierName}</td>
                <td>{grnItem.PaymentMethod}</td>
                <td>{grnItem.Quantity}</td>
                <td>{grnItem.CostPrice}</td>
                <td>{grnItem.MinSellPrice}</td>
                <td>{grnItem.WholeSellPrice}</td>
                <td>{grnItem.SellingPrice}</td>
                <td>{grnItem.ValueRemarks}</td>
                <td>
                <Link to={`/grn/${grnItem._id}`}>
                  <button className="btn btn-primary">Update</button>
                </Link>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteGrnItem(grnItem._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <Link to={`/qtygrn/${grnItem._id}`}>
                    <button className="btn btn-primary">Change Quantity</button>
                  </Link>
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
