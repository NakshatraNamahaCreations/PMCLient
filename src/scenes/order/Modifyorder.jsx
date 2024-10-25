import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Form } from "react-bootstrap";
import { ApiUrl } from "../../ApiRUL";
import { getData, putData } from "../../methods";
import { useParams } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";

const ModifyOrder = () => {
  const initialData = {
    customer: "",
    email: "",
    phone: "",
    bookingDate: "",
    serviceDate: "",
    Excutive: "",
    amount: "",
    bookingAmount: "",
    slot: "",
    city: "",
    Items: [],
  };

  const [OrderData, setOrderData] = useState([]);
  const [ItemData, setItemData] = useState([]);
  const [EditData, setEditData] = useState(initialData);
  const [ViewData, setViewData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowDataString = urlParams.get("rowData");

    if (rowDataString) {
      const rowData = JSON.parse(rowDataString);
      setViewData(rowData);
    }
    getItem();
  }, [id]);
  useEffect(() => { getOrder() }, [])

  const getOrder = async () => {
    try {
      const response = await getData(ApiUrl.GETORDER);
      if (response.status === 200) {
        let filteredData = response.data.find((ele) =>
          ViewData._id === ele._id)
        setOrderData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);

    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      return dateString;
    }
    return parsedDate.toISOString().split('T')[0];
  };


  useEffect(() => {
    if (OrderData) {
      const items = OrderData.Items || [];
      const initialAmount = calculateTotalAmount(items);

      setEditData({
        customer: OrderData.customer || "",
        email: OrderData.email || "",
        phone: OrderData.phone || "",
        bookingDate: formatDate(OrderData.bookingDate),
        serviceDate: formatDate(OrderData.serviceDate),
        Excutive: OrderData.Excutive || "",
        amount: initialAmount,
        bookingAmount: OrderData.bookingAmount || "",
        slot: OrderData.slot || "",
        city: OrderData.city || "",
        Items: items,
      });
    }
  }, [OrderData]);


  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.offerPrice * item.qty), 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...EditData.Items];

    if (name === 'itemname') {
      const selectedItem = ItemData.find(item => item.itemname === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemname: value,
          category: selectedItem.category || "",
          subcategory: selectedItem.subcategory || "",
          offerPrice: selectedItem.offerPrice || 0,
          qty: updatedItems[index].qty || 1
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value
      };
    }

    const updatedAmount = calculateTotalAmount(updatedItems);

    setEditData((prevState) => ({
      ...prevState,
      Items: updatedItems,
      amount: updatedAmount
    }));
  };

  const updateOrder = async () => {
    try {
      const response = await putData(`${ApiUrl.UPDATORDER}${OrderData._id}`, EditData);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // alert("Failed to update the order.");
    }
  };

  const getItem = async () => {
    try {
      const response = await getData(`${ApiUrl.GETITEMS}`);
      if (response.status === 200) {
        setItemData(response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      // alert("Failed to fetch items.");
    }
  };

  const handelAddItem = () => {
    const newItem = {
      itemname: "",
      category: "",
      subcategory: "",
      offerPrice: 0,
      qty: 1
    };

    setEditData((prevState) => ({
      ...prevState,
      Items: [...prevState.Items, newItem]
    }));
  };

  console.log(OrderData, "OrderData")
  return (
    <Box m="20px">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-10 m-auto mb-3 order-details">
            <div className="card shadow-sm p-3">
              <form className="row">
                {/* Form Fields */}
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer"
                    value={EditData.customer}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={EditData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={EditData.city}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={EditData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Booking Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="bookingDate"
                    value={EditData.bookingDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Service Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="serviceDate"
                    value={EditData.serviceDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Slot</Form.Label>
                  <Form.Control
                    type="text"
                    name="slot"
                    value={EditData.slot}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Booking Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="bookingAmount" readOnly
                    value={EditData.bookingAmount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4 mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={EditData.amount}
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="row">
                  <div className="col-md-2"><IoAddCircleOutline className="add-icon"
                    onClick={handelAddItem} /></div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>SI No</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EditData.Items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Control
                            type="text"
                            name="category" readOnly
                            value={item.category}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="subcategory" readOnly
                            value={item.subcategory}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <Form.Select
                            name="itemname"
                            value={item.itemname}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control"
                          >
                            <option>Select Item</option>
                            {ItemData.map((ele) => (
                              <option key={ele.itemname}>
                                {ele.itemname}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            name="qty"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="offerPrice"
                            value={item.offerPrice * item.qty}
                            readOnly
                            className="form-control"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={updateOrder}
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ModifyOrder;
