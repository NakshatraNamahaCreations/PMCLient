import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import EnquiryTab from "./EnquiryTab";
import CustomColumnMenu from "../customgrid";
import { ApiUrl } from "../../ApiRUL";
import { deleteData, getData } from "../../methods";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md"; // Correct icon
import { CiEdit } from "react-icons/ci";
import { GrFormViewHide } from "react-icons/gr";
import axios from "axios";

const Enquiry = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [EnquiryData, setEnquiryData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "enquiryId", headerName: "EnquiryId" },
    {
      field: "enquiryDate",
      headerName: "Enquiry Date",
      width: 200,
      renderCell: (params) => {
        const formattedDate = moment(params.row.createdAt).format(
          "DD/MM/YYYY,LT"
        );
        return formattedDate;
      },
    },
    { field: "customer", headerName: "Customer Name", width: 200 },
    { field: "contact1", headerName: "Number", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "pickupLocation", headerName: "Pickup Location", width: 200 },
    { field: "dropLocation", headerName: "Drop Location", width: 200 },
    { field: "type", headerName: "Reference", width: 200 },
    { field: "city", headerName: "City", width: 100 },
    { field: "service", headerName: "Service", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <CiEdit
            style={{ fontSize: "32px" }}
            className="cursor-pointer text-blue-600 text-xl"
            onClick={() => handleEdit(params.row.id)}
          />
          <GrFormViewHide
            style={{ fontSize: "32px" }}
            className="cursor-pointer text-gray-600 text-xl"
            onClick={() => handleEnquiryView(params.row)}
          />
          <MdDeleteForever
            style={{ fontSize: "32px" }}
            className="cursor-pointer text-red-600 text-xl"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    navigate("/enquiryadd", { state: id });
  };

  const handleEnquiryView = (row) => {
    navigate("/enuirydetails", { state: row });
  };

  // };

  const handleDelete = async (id) => {
    axios({
      method: "post",
      url: ApiUrl.BASEURL + "/enquiry/trash/" + id,
    })
      .then(function (response) {
        console.log(response);
        alert("Deleted successfully");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  useEffect(() => {
    getEnquiry();
  }, []);

  const getEnquiry = async () => {
    try {
      const response = await getData(ApiUrl.GETENQUIRYNEW);
      if (response.status === 200) {
        const rowsWithId = response.data.map((enquiry, index) => ({
          ...enquiry,
          id: enquiry._id,
          index: index + 1,
        }));
        setEnquiryData(rowsWithId);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  return (
    <Box m="20px">
      <EnquiryTab />
      <Header title="ENQUIRY" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          // onCellClick={(params) => handleEnquiryView(params.row)} // Use onCellClick instead of onRowClick
          rows={EnquiryData}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default Enquiry;
