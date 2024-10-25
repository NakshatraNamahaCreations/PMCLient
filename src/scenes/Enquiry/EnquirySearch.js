import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import DataTable from "react-data-table-component";
import EnquiryTab from "./EnquiryTab";
import Header from "../../components/Header";
import { ApiUrl } from "../../ApiRUL";
import { useNavigate } from "react-router-dom";

const EnquirySearch = () => {
  const [FilteredData, setFilteredData] = useState([]);
  const [City, setCity] = useState([]);

  let InitialData = {
    customer: "",
    fromdate: "",
    todate: "",
    contact: "",
    city: "",
  };

  const [PayloadData, setPayloadData] = useState(InitialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayloadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        ApiUrl?.BASEURL + "/enquiry/EnquirySearch",
        PayloadData
      );
      if (response.status === 200) {
        setFilteredData(response.data.enquiryadd);
      } else {
        setFilteredData([]);
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    try {
      const response = await axios.get(
        "https://api.vijayhomesuperadmin.in/api/master/getcity"
      );
      if (response.status === 200) {
        setCity(response.data.mastercity);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const columns = [
    {
      name: "EnquiryId",
      selector: (row) => row.enquiryId,
      sortable: true,
      width: "150px",
    },
    {
      name: "Enquiry Date",
      selector: (row) => moment(row.createdAt).format("DD-MM-YYYY ,LT"),
      sortable: true,
      width: "150px",
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
      width: "150px",
    },
    { name: "Email", selector: (row) => row.email, width: "180px" },
    { name: "Contact", selector: (row) => row.contact1, width: "150px" },
    {
      name: "Drop location",
      selector: (row) => row.dropLocation,
      width: "180px",
    },
    {
      name: "Pickup Location",
      selector: (row) => row.pickupLocation,
      width: "180px",
    },
    {
      name: "Distance",
      selector: (row) => row.distance,
      width: "180px",
    },
    { name: "City", selector: (row) => row.city },
  ];

  const navigate = useNavigate();

  const handleRowClick = (row) => {
    console.log("yogiiiie");
    navigate("/enuirydetails", { state: row });
  };

  return (
    <Box m="20px">
      <EnquiryTab />
      <Header subtitle="Search Enquiry" />

      <div className="search-form-container p-4 border rounded">
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              value={PayloadData.customer}
              type="text"
              name="customer"
              placeholder="Customer name"
            />
          </div>
          <div className="col-md-4 mb-3">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              onChange={handleChange}
              value={PayloadData.fromdate}
              type="date"
              name="fromdate"
            />
          </div>
          <div className="col-md-4 mb-3">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              onChange={handleChange}
              value={PayloadData.todate}
              type="date"
              name="todate"
            />
          </div>
          <div className="col-md-4 mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              onChange={handleChange}
              value={PayloadData.contact}
              type="text"
              name="contact"
              placeholder="Contact number"
            />
          </div>
          <div className="col-md-4 mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select
              onChange={handleChange}
              value={PayloadData.city}
              name="city"
            >
              <option>Select City</option>
              {City.map((ele, index) => (
                <option key={index}>{ele.city}</option>
              ))}
            </Form.Select>
          </div>
        </div>

        <div className="row justify-content-center">
          <button className="btn btn-primary mx-2" onClick={handleSearch}>
            Search
          </button>
          <button
            className="btn btn-secondary mx-2"
            onClick={() => {
              setPayloadData(InitialData);
              setFilteredData([]);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-5">
        <DataTable
          data={FilteredData}
          columns={columns}
          pagination
          highlightOnHover
          striped
          responsive
          onRowClicked={handleRowClick}
          // customStyles={{
          //   headCells: {
          //     style: {
          //       fontWeight: "bold",
          //       fontSize: "16px",
          //     },
          //   },
          //   cells: {
          //     style: {
          //       padding: "8px",
          //     },
          //   },
          // }}
        />
      </div>
    </Box>
  );
};

export default EnquirySearch;
