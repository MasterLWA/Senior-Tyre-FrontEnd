import { Link } from "react-router-dom";
import NavButton from "../../Components/NavButtons";
import { ENDPOINT } from "../../config";
import React, { useState, useEffect } from "react";

const SubGRN = () => {
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

    const filteredGrn = grn.filter(grnItem =>
        grnItem.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div>
            <NavButton />
            <div className="container text-center m-2 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
                <h1 className="text-center mb-3">Shop GRN Table</h1>

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

                {/* GRN Table */}
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
                            <th>Add Quantities to Shop</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredGrn.map((grnItem) => (
                            <tr key={grnItem._id}>
                                <td>{grnItem.ItemName}</td>
                                <td>{grnItem.SupplierName}</td>
                                <td>{grnItem.CostPrice}</td>
                                <td>{grnItem.MinSellPrice}</td>
                                <td>{grnItem.WholeSellPrice}</td>
                                <td>{grnItem.SellingPrice}</td>
                                <td>{grnItem.Quantity}</td>
                                <td className={grnItem.subGRNQuantity > 0 ? 'bg-success text-white' : 'bg-danger text-white'}>{grnItem.subGRNQuantity} </td>
                                <td>
                                    <Link to={`/qtysubgrn/${grnItem._id}`} className="btn btn-primary">
                                        Add Quantities to Shop
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

export default SubGRN;