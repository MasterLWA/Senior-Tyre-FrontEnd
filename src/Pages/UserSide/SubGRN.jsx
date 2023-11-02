import { Link } from "react-router-dom";
import NavButton from "../../Components/NavButtons"
import { ENDPOINT } from "../../config"
import React, { useState, useEffect } from "react";

const SubGRN = () => {

    const [grn, setGrn] = useState([]);

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


    return (
        <div>
            <NavButton />
            <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
                <h1 className="text-center mb-3">Shop GRN Table</h1>
                
                <table className="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Supplier</th>
                            <th>Min Sell Price</th>
                            <th>Whole Sell Price</th>
                            <th>Selling Price</th>
                            <th>Quantities in WareHouse</th>
                            <th>Shop Quantities</th>
                            <th>Add Quantities to Shop</th>
                            {/* <th>Update Quantities</th>
                            <th>Add</th>
                            <th>Remove</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Map date into table */}
                        {grn.map((grnItem) => (
                            <tr key={grnItem._id}>
                                <td>{grnItem.ItemName}</td>
                                <td>{grnItem.SupplierName}</td>
                                <td>{grnItem.MinSellPrice}</td>
                                <td>{grnItem.WholeSellPrice}</td>
                                <td>{grnItem.SellingPrice}</td>
                                <td>{grnItem.Quantity}</td>
                                <td>{grnItem.subGRNQuantity}</td>
                                <td>
                                    <Link to={`/qtysubgrn/${grnItem._id}`} className="btn btn-primary">Add Quantities to Shop</Link>
                                </td>
                                {/* <th><input type="number" value={QuantitiestoShop} onChange={(e) => setQuantitiestoShop(e.target.value)}
                                ></input></th>
                                <td><button className="btn btn-success"
                                >Add</button></td>
                                <td><button className="btn btn-warning"
                                >Remove</button></td> */}
                            </tr>
                        ))}
                    </tbody>
    
                </table>
            </div>
        </div>
    )}

export default SubGRN