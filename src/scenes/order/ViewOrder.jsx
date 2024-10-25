import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

import { CiEdit } from "react-icons/ci";
import { GrFormViewHide } from "react-icons/gr";
import Multiselect from "multiselect-react-dropdown";
import CustomColumnMenu from "../customgrid";
import { ApiUrl } from "../../ApiRUL";
import { getData, postData, putData } from "../../methods";
import { useNavigate, useParams } from "react-router-dom";

const ViewOrder = () => {
  const theme = useTheme();

  const [selectedVendor, setSelectedVendor] = useState({
    id: "",
    customer: "",
  });

  const [ViewId, setViewId] = useState(null);
  const [OrderData, setOrderData] = useState(null);
  const [vendorData, setvendorData] = useState([]);

  const { id } = useParams();

  const handleVendorChange = (event) => {
    const selectedId = event.target.value;
    const selectedVendor = vendorData.find((item) => item._id === selectedId);
    setSelectedVendor({
      id: selectedVendor ? selectedVendor._id : "",
      customer: selectedVendor ? selectedVendor.vhsname : "",
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowDataString = urlParams.get("rowData");
    if (rowDataString) {
      const rowData = JSON.parse(rowDataString);
      setViewId(rowData);
    }
  }, [id]);
  console.log(ViewId);
  useEffect(() => {
    getORder();
  }, [ViewId]);

  useEffect(() => {
    if (OrderData?.city) {
      getVendors(OrderData.city);
    }
  }, [OrderData]);

  console.log(OrderData);
  const getORder = async () => {
    try {
      const response = await getData(ApiUrl.GETORDER);

      if (response.status === 200) {
        const filterData = response.data.find((ele) => ele._id == ViewId);
        setOrderData(filterData);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const getVendors = async (city) => {
    try {
      const response = await axios.get(
        `${ApiUrl.BASEURL}/getVendorwithCity/${city}`
      );
      if (response.status === 200) {
        setvendorData(response.data.data);
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const updateORder = async () => {
    try {
      const response = await putData(ApiUrl.UPDATVENDOR + OrderData?._id, {
        vendorName: selectedVendor.customer,
        vendorId: selectedVendor.id,
      });
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <Box m="20px">
      <div className="container mt-4">
        <div className="row">
          {/* Order Details */}
          <div className="col-md-7 mb-3 order-details">
            <div className="card shadow-sm">
              <table>
                <thead className="text-center">
                  <th className="p-2 main_h" colSpan={2}>
                    Order Details
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Order Id</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?._id || 0} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Customer name</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.customer} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Contact</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.phone} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Email</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.email} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>City</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.city} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Category</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.category} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Service</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.serviceName} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Pickup Location</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.pickupLocation} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Drop Location</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.dropLocation} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Service Date</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.serviceDate} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Booking Date</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.bookingDate} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Vendor</strong>
                    </td>{" "}
                    <td className="p-2">{OrderData?.vendorName}</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Scheduled Slot</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.slot}</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Vehicle name</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.vehicleName} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Vehicle Price</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.vehiclePrice} </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Paking Layer</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.packingLayer}</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Unpacking</strong>
                    </td>{" "}
                    <td className="p-2">
                      {" "}
                      {OrderData?.unpacking === "true" ? "YES" : "NO"}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Distance</strong>
                    </td>{" "}
                    <td className="p-2"> {Math.round(OrderData?.distance)} </td>
                  </tr>

                  <tr>
                    <td className="p-2">
                      {" "}
                      <strong>Total Amount</strong>
                    </td>{" "}
                    <td className="p-2"> {OrderData?.amount} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Assign Job To Vendors */}
          <div className="col-md-5 mb-3 assign-vendors">
            <div className="row  card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Assign Job To Vendors</h5>
                <div className="col-md-12 m-auto">
                  <div className="group pt-1">
                    <select
                      className="col-md-12 vhs-input-value"
                      onChange={handleVendorChange}
                    >
                      <option value="">--select--</option>
                      {vendorData.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.vhsname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className="save p-2 mt-3 w-100" onClick={updateORder}>
                  Update Order
                </button>
              </div>
            </div>
            <div className="row mt-4 m-auto">
              <strong>Items</strong>

              <table>
                <thead>
                  <th className="p-2">Category</th>
                  <th className="p-2">Subcategory</th>
                  <th className="p-2">Itemname</th>
                  <th className="p-2">Quantity</th>
                </thead>
                <tbody>
                  {OrderData?.Items?.map((ele) => (
                    <tr>
                      <td className="p-2">{ele?.category}</td>
                      <td className="p-2">{ele?.subcategory}</td>
                      <td className="p-2">{ele?.itemname}</td>
                      <td className="p-2">{ele?.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row mt-4 m-auto">
              <strong>Add Ons</strong>

              <table>
                <thead>
                  <th className="p-2">Name</th>

                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                </thead>
                <tbody>
                  {OrderData?.PMAddonsItems?.map((ele) => (
                    <tr>
                      <td className="p-2">{ele?.name}</td>
                      <td className="p-2">{ele?.qty}</td>
                      <td className="p-2">{ele?.qty * ele.offerPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ViewOrder;
