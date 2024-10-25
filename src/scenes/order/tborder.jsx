import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { GrFormViewHide } from "react-icons/gr";
import CustomColumnMenu from "../customgrid";
import { ApiUrl } from "../../ApiRUL";
import { getData } from "../../methods";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [filterData, setFilterData] = useState([]);

  const [ViewData, setViewData] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [OrderData, setOrderData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [error, setError] = useState(null);
  const { selectedDate } = useParams();

  const columns = [
    {
      field: "createdAt",
      headerName: "Customer name",
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          }}
        >
          {moment(params.row.createdAt).format("lll")}
        </div>
      ),
    },
    {
      field: "customer",
      headerName: "Customer name",
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone No.",
    },
    {
      field: "pickupLocation",
      headerName: "Pickup Location",
      width: 250, // Adjusted width for content
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          }}
        >
          {params.row.pickupLocation}
        </div>
      ),
    },
    {
      field: "dropLocation",
      headerName: "Drop Location",
      width: 250, // Adjusted width for content
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          }}
        >
          {params.row.dropLocation}
        </div>
      ),
    },
    {
      field: "city",
      headerName: "City",
    },

    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            height: "auto",
          }}
        >
          Update
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getData("/gettborder");
      if (response.status === 200) {
        setOrderData(response.data);
        setFilterData(response.data);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (row) => {
    const queryString = new URLSearchParams({
      rowData: JSON.stringify(row),
    }).toString();
    window.open(`/modifyorder/${row._id}?${queryString._id}`);
  };

  const ViewMore = (row) => {
    const queryString = new URLSearchParams({
      rowData: JSON.stringify(row.id),
    }).toString();
    window.open(`/vieworder/${row.id}?${queryString}`);
  };

  const getRowId = (row) => row._id;

  return (
    <Box m="20px">
      <Header title="Try to booking ORDER" subtitle="List of Orders" />
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
        {error && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}

        <DataGrid
          onRowClick={ViewMore}
          rows={filterData}
          columns={columns}
          getRowId={getRowId}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderDetails;
