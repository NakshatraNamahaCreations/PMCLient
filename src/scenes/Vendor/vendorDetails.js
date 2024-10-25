import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Button, ButtonToolbar } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { ApiUrl } from "../../ApiRUL";

function Vendordetails() {
  const [amt, setamt] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const { id } = useParams();
  const [data, setdata] = useState({});
  const [servicedata, setservicedata] = useState([]);
  const [totalRecords, setTotalRecords] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterdata, setfilterdata] = useState([]);
  const [desc, setdesc] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowDataString = urlParams.get("rowData");
    const rowData = JSON.parse(rowDataString);
    setdata(rowData);
  }, [id]);

  useEffect(() => {
    const getVendorServices = async () => {
      try {
        const res = await axios.get(
          ApiUrl.BASEURL + `/order/getfindwithvendorid/${id}`
        );
        if (res.status === 200) {
          setservicedata(res.data?.data);
          setfilterdata(res.data?.data);
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error fetching vendor services:", error);
      }
    };

    getVendorServices();

    // Cleanup function (if needed)
    return () => {
      // Cleanup code (if needed)
    };
  }, [id, setservicedata]);

  const updateRecharge = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        ApiUrl.BASEURL + `/updatevendorAmt/${id}`,
        { vendorAmt: amt, desc: desc },
        { headers: { "content-type": "application/json" } }
      );

      if (response.status === 200) {
        handleClose();
        alert("Successfully Added");
        window.location.assign("/vendor");
      }
    } catch (error) {
      console.log("Error response:", error.response);
      handleClose();

      if (error.response) {
        alert(error.response.data.error || "Something went wrong");
      } else {
        alert("Network error or something went wrong");
      }
    }
  };

  const [penaltydata, setvendorPenaltydata] = useState([]);
  const [walletdata, setwalletdata] = useState([]);

  const [vDocumnets, setvDocumnets] = useState([]);

  useEffect(() => {
    getdocuments();
  }, [id]);

  const getdocuments = async () => {
    try {
      const response = await axios.post(
        ApiUrl.BASEURL + `/findwithvendorId/${id}`
      );

      if (response.status === 200) {
        setvDocumnets(response.data?.vdocuments);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Handle the error appropriately (e.g., show a user-friendly message).
    }
  };

  useEffect(() => {
    getpenality();
    getwalletdetails();
  }, []);

  const getpenality = async () => {
    // let res = await axios.get(ApiUrl.BASEURL + `/getvPenalty/${id}`);
    // if (res.status === 200) {
    //   setvendorPenaltydata(res.data?.vPenalty);
    // }
  };

  const getwalletdetails = async () => {
    let res = await axios.get(
      ApiUrl.BASEURL + `/VendorwalletHistorybyid/${id}`
    );
    if (res.status === 200) {
      // console.log("res.data?.data", res.data?.data);
      setwalletdata(res.data?.data);
    }
  };

  const totalPenalty = penaltydata.reduce((total, item) => {
    return total + parseInt(item?.vPenalty);
  }, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      name: "Sl  No",
      selector: (row, index) => (currentPage - 1) * 15 + index + 1,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },

    {
      name: "Contact",
      selector: (row) => row.mainContact,
    },

    {
      name: "Service ",
      selector: (row) => row.service,
    },
    {
      name: "SG ",
      selector: (row) => row.GrandTotal,
    },
    {
      name: "Vendor Charge",
      selector: (row) => {
        const vendorChargeAmount = parseFloat(row.vendorChargeAmount ?? 0);

        return vendorChargeAmount.toFixed(1);
      },
    },
    {
      name: "PM ",
      selector: (row) => row.serviceInfo[0]?.paymentMode,
    },
    {
      name: "Booked Date",

      cell: (row) => (
        <div>
          {row.serviceInfo[0]?.date} <br />
          {row.serviceInfo[0]?.time}
        </div>
      ),
    },

    {
      name: "Service Date",
      selector: (row) => row.serviceDate,
    },
  ];

  const exportData = () => {
    const fileName = "Vendor_Report.xlsx";
    // Assuming each object in searchResults has properties like 'category' and 'img'
    const filteredData1 = filterdata?.map((item) => ({
      CustomerName: item.serviceInfo[0]?.customerData[0]?.customerName,
      category: item?.category,
      city: item?.serviceInfo[0]?.city,
      number: item?.serviceInfo[0]?.customerData[0]?.mainContact,
      desc: item?.serviceInfo[0]?.desc,
      amount: item?.serviceInfo[0]?.GrandTotal,
      vendorCharge: item.vendorChargeAmount,
      BD: item.serviceInfo[0]?.date,
      SD: item.serviceDate,
      service: item?.serviceInfo[0]?.service,
      paymentmode: item?.serviceInfo[0]?.paymentMode,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData1);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="row m-2">
      <div>
        <h5 style={{ color: "rgb(76, 206, 206)" }}>Vendor Details</h5>
      </div>
      <div className="row">
        <div className="col-4 d-flex g-5">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            className="img"
          />
          <div className="mx-5">
            <p className="vp">
              Name:
              <b>{data?.vhsname}</b>
            </p>
            <p className="vp">
              Number:
              <b>{data?.number}</b>
            </p>
            <p className="vp">
              Experiance:
              <b>{data?.experiance}</b>
            </p>
            <p className="vp">
              Language:
              <b>{data?.languagesknow}</b>
            </p>
            <p className="vp">
              Password:
              <b>{data?.password}</b>
            </p>
          </div>
        </div>
        {/* <div className="col-4">
          <h5 style={{ color: "#a33535" }}>Documents</h5>
          <p>Id : {vDocumnets[0]?.IDProofNo}</p>
          <img
            src={`https://api.vijayhomeservicebengaluru.in/vDocuments/${vDocumnets[0]?.IDproofImg}`}
            width="200px"
            height="200px"
          />
        </div> */}
        <div className="mt-1 col-4">
          <div className="wallet">
            <div>
              <i
                class="fa-solid fa-wallet fa-beat"
                style={{ color: "rgb(139, 20, 20)", fontSize: "60px" }}
              ></i>
            </div>
            <div>
              <h5>
                <b>Wallet Balance</b>
              </h5>
              <div>
                <b style={{ fontSize: "25px" }}>
                  <i class="fa-solid fa-indian-rupee-sign"></i>
                  {Math.floor(data?.vendorAmt)}
                </b>
              </div>

              <Button
                style={{
                  background: "rgb(76, 206, 206)",
                  marginTop: "10px",
                  border: "none",
                }}
                onClick={handleShow}
              >
                Recharge{" "}
              </Button>
              <p
                style={{
                  textDecoration: "underline",
                  marginLeft: "20px",
                  color: "#198754",
                  cursor: "pointer",
                }}
                onClick={handleShow1}
              >
                History
              </p>
            </div>
          </div>
          {/* <div className="mt-3">
            <h5> Total Penalty Charges= {totalPenalty} Rs</h5>
          </div> */}
        </div>
      </div>
      <h5 className="mt-4">Services list</h5>

      <button
        className="ps-3 pt-2 pb-2 pe-3 ms-2"
        style={{
          border: 0,
          color: "white",
          backgroundColor: "rgb(76, 206, 206)",
          borderRadius: "5px",
          width: "150px",
          float: "right",
        }}
        onClick={exportData}
      >
        <i
          class="fa-solid fa-download"
          title="Download"
          // style={{ color: "white", fontSize: "27px" }}
        ></i>
        Export
      </button>
      <div className="mt-1 border">
        <DataTable
          columns={columns}
          data={filterdata}
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          paginationPerPage={15}
          paginationRowsPerPageOptions={[15, 30, 50]}
          onChangePage={(current) => setCurrentPage(current)}
          selectableRowsHighlight
          subHeaderAlign="left"
          highlightOnHover
        />

        <div style={{ fontWeight: "500" }}>
          Service Total :
          {filterdata?.reduce(
            (total, selectedData) =>
              total + parseFloat(selectedData?.serviceInfo[0]?.GrandTotal),
            0
          )}
        </div>
        <div style={{ fontWeight: "500" }}>
          Vendor Total :
          {filterdata
            ?.reduce(
              (total, selectedData) =>
                total + parseFloat(selectedData?.vendorChargeAmount ?? 0),
              0
            )

            .toFixed(1)}
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Recharge to vendor wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            class="form-control mt-4"
            placeholder="100"
            aria-label="Amount"
            onChange={(e) => setamt(e.target.value)}
            aria-describedby="basic-addon1"
            onKeyPress={(e) => {
              // Allow only numbers (0-9)
              const isValidInput = /[0-9]/.test(e.key);
              if (!isValidInput) {
                e.preventDefault();
              }
            }}
            style={{
              width: "100%",
              borderRadius: "3px",
              borderLeft: "2px solid rgb(76, 206, 206)",
            }}
          />

          <input
            type="text"
            class="form-control mt-4"
            placeholder="desc"
            aria-label="Username"
            onChange={(e) => setdesc(e.target.value)}
            aria-describedby="basic-addon1"
            style={{
              width: "100%",

              borderRadius: "3px",
              borderLeft: "2px solid rgb(76, 206, 206)",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCLE
          </Button>
          <Button variant="primary" onClick={updateRecharge}>
            ADD
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title> {data?.vhsname} wallet transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sl.No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amt</TableCell>
                  <TableCell align="right">Desc</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {walletdata.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(row.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align="right">{row.wAmt}</TableCell>
                    <TableCell align="right">{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Vendordetails;
