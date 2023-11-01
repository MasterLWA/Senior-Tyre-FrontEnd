import React, { useState, useEffect } from "react";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";

const Supplier = () => {
    
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
  });


    /**
     * Fetches suppliers from the server.
     * @async
     * @function
     * @returns {Promise<void>}
     */
        
        useEffect(() => {

            const fetchSuppliers = async () => {
                try {
                    const res = await fetch(ENDPOINT+'/supplier'); // Corrected the URL here
                    const json = await res.json();

                    if (res.ok) {
                        setSuppliers(json);
                    } else {
                        console.error('Request failed with status', res.status);
                    }
                } catch (error) {
                    console.error('Error making GET request:', error.message);
                }
            };

            fetchSuppliers();
        }, []);

        console.log(suppliers);


    /**
     * Deletes a supplier with the given ID from the server and updates the state of suppliers.
     * @async
     * @param {string} id - The ID of the supplier to be deleted.
     * @returns {Promise<void>}
     */
        const handleDeleteSupplier = async (id) => {
            try {
                const response = await fetch(ENDPOINT+`/supplier/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier._id !== id));
                    // show alert 
                    alert("Supplier Deleted Successfully!");
                } else {
                    console.error('Failed to delete supplier with status:', response.status);
                    // show alert
                    alert("Failed to delete supplier! Refresh the page and try again.");
                }
            } catch (error) {
                console.error('Error deleting supplier:', error.message);
            }
        };


        /**
         * Handles the submission of a new supplier to the server.
         * @async
         * @param {Event} e - The form submission event.
         * @returns {Promise<void>}
         */
            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                const response = await fetch(ENDPOINT+'/supplier', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSupplier),
                });

                if (response.ok) {
                    const newSupplierData = await response.json();
                    setSuppliers([...suppliers, newSupplierData]);
                    setNewSupplier({
                    companyName: "",
                    companyAddress: "",
                    companyPhone: "",
                    companyEmail: "",
                    });

                    // show alert
                    alert("Supplier Added Successfully!");

                } else {
                    console.error('Failed to add supplier with status:', response.status);
                    // show alert
                    alert("Failed to add supplier!  Maybe the supplier already exists. So please check again.");
                }
                } catch (error) {
                console.error('Error adding supplier:', error.message);
                }
            };

            /**
             * Updates the state with the new supplier information when the user types in the input fields.
             * @param {Object} e - The event object.
             */
            const handleChange = (e) => {
                const { name, value } = e.target;
                setNewSupplier({
                    ...newSupplier,
                    [name]: value,
                });
            };

    return (
            <div>

            <NavButton /> {/* form to add supplier */}
            
            <div className="form container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">

                <h1 className="text-center mb-3">Add Supplier</h1>

                <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Supplier Company"
                    className="mt-1 form-control mx-auto"
                    name="companyName"
                    value={newSupplier.companyName}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="text"
                    placeholder="Supplier Address"
                    className="mt-1 form-control mx-auto"
                    name="companyAddress"
                    value={newSupplier.companyAddress}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="text"
                    placeholder="Supplier Phone"
                    className="mt-1 form-control mx-auto"
                    name="companyPhone"
                    value={newSupplier.companyPhone}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="email"
                    placeholder="Supplier Email"
                    className="mt-1 form-control mx-auto"
                    name="companyEmail"
                    value={newSupplier.companyEmail}
                    onChange={handleChange}
                />
                <br />
                <input type="submit" value="Submit" className="btn btn-primary" />
                </form>

            </div>

            <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
                <h1 className="text-center mb-3">Supplier Table</h1>
                <table className="table table-striped table-hover table-bordered">

                <thead>
                    <tr>
                    <th>Company</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Update</th>
                    <th>Delete</th>
                    </tr>
                </thead>

                <tbody> 
                    {/* map data into tables */}
                    {suppliers.map((supplier) => (
                    <tr key={supplier._id}>
                        <td>{supplier.companyName}</td>
                        <td>{supplier.companyAddress}</td>
                        <td>{supplier.companyPhone}</td>
                        <td>{supplier.companyEmail}</td>
                        <td>
                        <button className="btn btn-primary">Update</button>
                        </td>
                        <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteSupplier(supplier._id)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>

                </table>
            </div>
            </div>
    );
};

export default Supplier;