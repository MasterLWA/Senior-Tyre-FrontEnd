import { ENDPOINT } from "../config";
import React, { useState, useEffect } from "react";

const StockBalanceTable = () => {
    const [grn, setGrn] = useState([]);

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

    return (
        <div>
   
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
                            <th>Quantities in Warehouse</th>
                            <th>Shop Quantities</th>
                        </tr>
                    </thead>

                    <tbody>
                        {grn.map((grnItem) => (
                            <tr key={grnItem._id}>
                                <td>{grnItem.ItemName}</td>
                                <td>{grnItem.SupplierName}</td>
                                <td>{grnItem.MinSellPrice}</td>
                                <td>{grnItem.WholeSellPrice}</td>
                                <td>{grnItem.SellingPrice}</td>
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
