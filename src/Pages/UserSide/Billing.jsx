import React, { useState, useEffect } from "react";
import NavButton from "../../Components/NavButtons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ENDPOINT } from "../../config";
import Select from 'react-select';

/**
 * Billing component for generating invoices and updating GRN item quantities.
 * @returns {JSX.Element} JSX element containing the Billing component.
 */
const Billing = () => {

  
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Select");
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [grn, setGrn] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [PricePerItem, setPricePerItem] = useState(0);
  const [selectedItemData, setSelectedItemData] = useState(null);

  const [serviceCharge, setServiceCharge] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [Checkedby, setCheckedby] = useState("");
  const [Remarks, setRemarks] = useState("");
  const [InvoiceNum, setInvoiceNum] = useState("");https://github.com/MasterLWA/Senior-Tyre-FrontEnd/actions


  // get index 

      useEffect(() => {
        /**
         * Fetches the GRN (Goods Received Note) data from the server.
         * @returns {Promise<void>} A promise that resolves when the data is fetched successfully.
         */
        const fetchGrn = async () => {
          try {
            const res = await fetch(ENDPOINT + "/grn");
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
      

      useEffect(() => {
        if (selectedItem !== "Select") {
          const selectedItemData = grn.find((item) => item.ItemName === selectedItem);
          setSelectedItemData(selectedItemData);
        } else {
          setSelectedItemData(null);
        }
      }, [selectedItem, grn]);


 // Assuming ENDPOINT is defined somewhere before this code

useEffect(() => {
  const fetchIndex = async () => {
    try {
      // Use the correct endpoint format by appending a slash before "index"
      const res = await fetch(ENDPOINT + "/index/658b1fb98822444dd9b9d167");
      
      // Check if the response status is in the range 200-299 for success
      if (res.ok) {
        const data = await res.json();
        // Ensure that the 'indexnum' property exists in the response data
        if (data && data.indexnum !== undefined) {
          // Assuming setInvoiceNum is a state setter function
          setInvoiceNum(data.indexnum);
        } else {
          console.error("Response data is missing the 'indexnum' property:", data);
        }
      } else {
        console.error("Request failed with status", res.status);
      }
    } catch (error) {
      console.error("Error making GET request:", error.message);
    }
  };

  // Call the fetchIndex function within the useEffect
  fetchIndex();
}, []); // Empty dependency array to run the effect only once when the component mounts


// update current index number after generating invoice by incrementing the index number by 1
const updateIndex = async () => {
  try {
    // Use the correct endpoint format by appending a slash before "index"
    const res = await fetch(ENDPOINT + "/index/658b1fb98822444dd9b9d167", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ indexnum: InvoiceNum + 1 }),
    });
    if (res.ok) {
      console.log("Index updated successfully");
    }
  } catch (error) {
    console.error("Error updating index:", error.message);
  }
};


        


      /**
       * Adds an item to the invoice.
       * 
       * @returns {void}
       */
      const addItemToInvoice = () => {
        if (selectedItem === "Select" || !selectedItemData || selectedItemData.subGRNQuantity <= 0 || PricePerItem <= 0) {
          return;
        }

        if (addedItems.includes(selectedItemData.ItemName)) {
          return;
        }

        const newItem = {
          Item: selectedItemData.ItemName,
          Quantity: quantity,
          Supplier: selectedItemData.SupplierName,
          Price: PricePerItem,
          Amount: quantity * PricePerItem,
        };

        setInvoiceItems([...invoiceItems, newItem]);
        setTotalAmount(totalAmount + newItem.Amount);

        setAddedItems([...addedItems, selectedItemData.ItemName]);

        setSelectedItem("Select");
        setQuantity(1);
        setPricePerItem(0);
      };



    /**
     * Updates the quantity of a GRN item.
     * @param {string} itemId - The ID of the GRN item.
     * @param {number} updatedQuantity - The updated quantity of the GRN item.
     * @returns {Promise<void>} - A promise that resolves when the quantity is updated successfully.
     * @throws {Error} - If there is an error updating the quantity.
     */
    const updateGRNItemQuantity = async (itemId, updatedQuantity) => {
      try {
        const response = await axios.patch(`${ENDPOINT}/grn/${itemId}`, {
          subGRNQuantity: updatedQuantity,
        });

        if (response.status === 200) {
          console.log(`GRN item ${itemId} quantity updated successfully`);
        } else {
          console.error(`Failed to update GRN item ${itemId} quantity with status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error updating GRN item ${itemId} quantity:`, error.message);
        throw error;
      }
    };

  const removeItemFromInvoice = (indexToRemove) => {
    const removedItem = invoiceItems[indexToRemove];
    const newTotalAmount = totalAmount - removedItem.Amount;

    setInvoiceItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
    setTotalAmount(newTotalAmount);

    setAddedItems(addedItems.filter((item) => item !== removedItem.Item));
  };



  const addSellItems = async (sellItems) => {
    try {
      const response = await axios.post(`${ENDPOINT}/sell`, sellItems);
      if (response.status === 200) {
        console.log("Sell items added successfully");
      } else {
        console.error(`Failed to add sell items with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding sell items:", error.message);
    }
  };


  const generateInvoice = async () => {
    const doc = new jsPDF();
    const columns = ["Item", "Quantity", "Price", "Amount"];
    const rows = invoiceItems.map((item) => [
      item.Item,
      item.Quantity,
      item.Price,
      item.Amount,
    ]);

    doc.setFontSize(16);
    doc.text("Senior Tyre & Battery Trading Company (PVT) Ltd", `${doc.internal.pageSize.getWidth() / 2}`, 18, "center");
    doc.setFontSize(12);

    doc.text("No. 114, Ebilipitya Road, Sooriyawewa", `${doc.internal.pageSize.getWidth() / 2}`, 25, "center");
    doc.setFontSize(8);

    doc.text("Contact No: 0472289700/0472288204", `${doc.internal.pageSize.getWidth() / 2}`, 30, "center");
    doc.setFontSize(8);

    doc.text("seniortyrecompany20@gmail.com", `${doc.internal.pageSize.getWidth() / 2}`, 35, "center");
    doc.setFontSize(8);

    doc.setFontSize(11);
    doc.text("Invoice", 20, 40);

    //invoice no is the current time and date with milliseconds and first 3 letters of the customer name
    doc.setFontSize(8);
    doc.text(`Invoice No `, 20, 44);
    doc.text(`: ${InvoiceNum}`, 45, 44);

    doc.setFontSize(8);
    doc.text(`Date` , 20, 48);
    doc.text(`: ${new Date().toLocaleDateString()}`, 45, 48);

    doc.setFontSize(8);
    doc.text(`Customer Name`, 20, 52);
    doc.text(`: ${customerName}`, 45, 52);

    doc.setFontSize(8);
    doc.text(`Checked by `, 20, 56);
    doc.text(`: ${Checkedby}`, 45, 56);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
      // make the table header transparent and cell borders black
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      // add line breaks between rows
    });

    doc.setFontSize(10);

    doc.text(`Sub Total       `, 120, doc.autoTable.previous.finalY + 6);
    doc.text(`: Rs.${totalAmount}`, 155, doc.autoTable.previous.finalY + 6);

    doc.text(`Service Charge     `, 120, doc.autoTable.previous.finalY + 11);
    doc.text(`: Rs.${serviceCharge}`, 155, doc.autoTable.previous.finalY + 11);

    doc.text(`Total Amount `, 120, doc.autoTable.previous.finalY + 17);
    doc.setFontSize(12);
    doc.text(`: Rs.${totalAmount+serviceCharge}`, 155, doc.autoTable.previous.finalY + 16);

    doc.setFontSize(8);
    doc.text(`Remarks : ${Remarks}`, 120, doc.autoTable.previous.finalY + 23);

    doc.setFontSize(8);
    doc.text("................................", 20, doc.autoTable.previous.finalY + 29);
    doc.text("................................ ", 55, doc.autoTable.previous.finalY + 29);
    doc.text("Customer Signature", 20, doc.autoTable.previous.finalY + 33);
    doc.text("Company Signature", 55, doc.autoTable.previous.finalY + 33);

    // bottom of the page, center  shows powered by Lakindu after signature
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Powered by LWA Technologies', doc.internal.pageSize.getWidth() / 2, doc.autoTable.previous.finalY + 38, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text('lakinduw.me', doc.internal.pageSize.getWidth() / 2, doc.autoTable.previous.finalY + 41, { align: 'center' });

    const sellItems = [];

    for (const invoiceItem of invoiceItems) {
      const grnItem = grn.find((item) => item.ItemName === invoiceItem.Item);
      if (grnItem) {
        const updatedSubGRNQuantity = grnItem.subGRNQuantity - invoiceItem.Quantity;
        await updateGRNItemQuantity(grnItem._id, updatedSubGRNQuantity);

        const sellItem = {
          item: invoiceItem.Item,
          unitCostPrice: grnItem.CostPrice,
          unitSellingPrice: invoiceItem.Price,
          totalSellingItems: invoiceItem.Quantity,
          totalSellingPrice: invoiceItem.Amount,
          profit: invoiceItem.Amount - (grnItem.CostPrice * invoiceItem.Quantity),
        };

        sellItems.push(sellItem);
        
      }
    }

    await addSellItems(sellItems);

    doc.save(`Invoice_${new Date().toLocaleDateString()}_${customerName}.pdf`);

    alert("Invoice generated successfully!");

    setInvoiceItems([]);
    setTotalAmount(0);
    setAddedItems([]);
    
    updateIndex();


    // reload the page after generating invoice
    window.location.reload();
    setInvoiceNum(null)
  };


  // Return from here
  return (
    <div className="w-100">
      <NavButton />

      <h1 className="text-center">Billing</h1>

      <div className="row d-flex justify-content-center">
        {/* add item to invoice */}
        <div className="col-md-4 border border-dark rounded bg-white m-1 d-inline-block p-5">
          <form className="m-2" onSubmit={(e) => e.preventDefault()}>

            <div className="form-group">
              <label htmlFor="item" className="label mt-3">
                Item
              </label>
              <Select
                  className="form-control"
                  id="item"
                  value={{ label: selectedItem, value: selectedItem }}
                  onChange={(selectedOption) => setSelectedItem(selectedOption.value)}
                  options={grn.map((item) => ({ label: item.ItemName, value: item.ItemName }))}
                  isSearchable
                />
            </div>

            {/* Show Prices of Selected Item */}
            <div className="container">
              {selectedItemData && (
                  <div className="mt-3 mb-3 border border-dark rounded bg-light p-3">
                    <h5>Cost Price:<span className="text-danger text font-weight-bold">Rs.{selectedItemData.CostPrice}</span> </h5>
                    <h5>MinSellPrice:<span className="text-danger text font-weight-bold">Rs.{selectedItemData.MinSellPrice}</span> </h5>
                    <h5>WholeSellPrice:<span className="text-danger text font-weight-bold"> Rs.{selectedItemData.WholeSellPrice}</span></h5>
                    <h5>SellingPrice: <span className="text-danger text font-weight-bold">Rs.{selectedItemData.SellingPrice}</span></h5>
                    <h5>Warehouse Quantity: {selectedItemData.Quantity}</h5>
                    <h5>shop Quantity: {selectedItemData.subGRNQuantity}</h5>
                  </div>
              )}
            </div>

                <div className="form-group">
                  <label htmlFor="PricePerItem" className="label mt-2">
                    Price per Item
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="PricePerItem"
                    placeholder="Price per Item"
                    value={PricePerItem}
                    onChange={(e) => setPricePerItem(parseFloat(e.target.value))}
                  />
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
              disabled={!(selectedItemData && selectedItemData.subGRNQuantity > 0 && PricePerItem > 0)}
            >
              Add Item
            </button>
          </form>

          <form onSubmit={(e) => e.preventDefault()} className="mt-5 border border-dark rounded bg-light p-3">
                <div className="form-group">

                  <h5 className="text-center">Additonal Details</h5>

                  <label htmlFor="serviceCharge" className="label mt-2">
                      Service Charge
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    id="serviceCharge"
                    placeholder="Service Charge"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(parseInt(e.target.value))}
                  />

                </div>


                <div className="form-group">
                      
                    <label htmlFor="customerName" className="label mt-2">
                        Customer Name
                    </label>
  
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      placeholder="Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
          
                  </div>

                  <label htmlFor="Remarks" className="label mt-2">
                      Remarks
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Remarks"
                    placeholder="Remarks"
                    value={Remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />


                  <div className="form-group">  
                      <label htmlFor="Checkedby" className="label mt-2">
                          Checked by
                      </label>

                      <input type="text" className="form-control" id="Checkedby" placeholder="Checked by" value={Checkedby} onChange={(e) => setCheckedby(e.target.value)} />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-2"
                  >  Additonal Details </button>
          
          </form>
        </div>

        {/* generate invoice */}
        <div className="col-md-7 border border-primary rounded bg-white m-1 p-5 shadow">
          <h3 className="text-center mt-2">Invoice</h3>
          <table className="table table-striped table-hover table-bordered mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Supplier</th>
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
                  <td>{item.Supplier}</td>
                  <td>{item.Price}</td>
                  <td>{item.Amount}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => removeItemFromInvoice(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row d-flex justify-content-end">
            <div className="col-md-4">
              <div className="card bg-primary text white m-2">
                <div className="card-body">
                  <h3 className="card-title">Total Amount</h3>
                  <h5 className="card-text">Rs.{totalAmount+serviceCharge}</h5>
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
