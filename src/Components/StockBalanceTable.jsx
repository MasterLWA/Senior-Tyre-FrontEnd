import { ENDPOINT } from "../config";
import React, { useState, useEffect } from "react";

const StockBalanceTable = () => {
    const [grn, setGrn] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    /**
     * Filter GRN items by name
     * @param {string} grnItem - GRN item
     */
    const filteredGrn = grn.filter(grnItem =>
        grnItem.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
   
            <div className="container text-center m-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-fit">
                <h1 className="text-center mb-3"> GRN Analysis Table</h1>

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
                            <th>Supplier</th>
                            <th>Cost Price</th>
                            <th>Min Sell Price</th>
                            <th>Whole Sell Price</th>
                            <th>Selling Price</th>
                            <th>Quantities in Warehouse</th>
                            <th>Shop Quantities</th>


                        </tr>
                    </thead>

                    <tbody>
                        {filteredGrn.map((grnItem) => (
                            <tr key={grnItem._id}>
                                <td>{grnItem.ItemName}</td>
                                <td>{grnItem.SupplierName}</td>
                                <td>Rs.{grnItem.CostPrice}</td>
                                <td>Rs.{grnItem.MinSellPrice}</td>
                                <td>Rs.{grnItem.WholeSellPrice}</td>
                                <td>Rs.{grnItem.SellingPrice}</td>
                                <td className={grnItem.Quantity > 0 ? 'bg-success text-white' : 'bg-danger text-white'}>{grnItem.Quantity} </td>
                                <td className={grnItem.subGRNQuantity > 0 ? 'bg-success text-white' : 'bg-danger text-white'}>{grnItem.subGRNQuantity} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockBalanceTable;
