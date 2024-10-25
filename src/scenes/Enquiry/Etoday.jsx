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
import { GrFormViewHide } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";

const EnquiryToday = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [EnquiryData, setEnquiryData] = useState([]);

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
    {
      field: "customer",
      headerName: "Customer Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "contact1",
      headerName: "Number",
      width: 200,
    },
    {
      field: "pickupLocation",
      headerName: "Pickup Location",
      width: 200,
    },

    {
      field: "dropLocation",
      headerName: "Drop Location",
      width: 200,
    },
    {
      field: "type",
      headerName: "Reference",
      width: 200,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
    },

    {
      field: "service",
      headerName: "Service",
      width: 200,
    },

    {
      field: "followupData",
      headerName: "Response",
      width: 200,
      renderCell: (params) => {
        return params.row.followupData?.[0]?.response || "-";
      },
    },
  ];

  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate("/enquiryadd", { state: row });
  };

  const handleEnquiryView = (data) => {
    navigate("/enuirydetails", { state: data.row });
  };

  useEffect(() => {
    getEnquiry();
  }, []);

  const getEnquiry = async () => {
    try {
      const response = await getData(ApiUrl.GETENQUIRYTODAY);

      if (response.status === 200) {
        const rowsWithId = response.data.map((enquiry, index) => ({
          ...enquiry,
          id: enquiry._id,
          index: index + 1,
        }));

        setEnquiryData(rowsWithId);
      }
    } catch (error) {
      console.error("Error fetching enquiry data:", error);
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
          checkboxSelection
          onRowClick={handleEnquiryView}
          rows={EnquiryData}
          columns={columns}
          getRowClassName={(params) => {
            // Apply a specific CSS class if response is 'confirmed'
            if (params.row.followupData?.[0]?.response === "Confirmed") {
              return "row-confirmed";
            }
            return "";
          }}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default EnquiryToday;
