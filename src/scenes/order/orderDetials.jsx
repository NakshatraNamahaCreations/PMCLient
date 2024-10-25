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
      field: "serviceDate",
      headerName: "Service Date",
      width: 100,
    },
    {
      field: "customer",
      headerName: "Customer name",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone No.",
      width: 100,
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
      width: 100,
    },
    {
      field: "slot",
      headerName: "Slot",
      width: 100,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      renderCell: (params) => <div key={params.row}>{params.row.vendor}</div>,
      width: 200,
    },

    {
      field: "amount",
      headerName: "Amount",
      width: 200,
    },
    {
      field: "paymentStatus",
      headerName: "Adv Payment",
      width: 200,
    },
    {
      field: "fullPaymentStatus ",
      headerName: "Full Payment",
      width: 200,
    },

    // {
    //   headerName: "Action",
    //   renderCell: ({ row }) => (
    //     <div color={colors.grey[100]} sx={{ ml: "5px" }}>
    //       {/* <CiEdit
    //         className="cursor edit me-2 fs-6"
    //         onClick={() => handleEdit(row)}
    //       />
    //       |{" "} */}
    //       <GrFormViewHide
    //         className="cursor delete fs-6"
    //         onClick={() => ViewMore(row)}
    //       />
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getData(ApiUrl.GETORDER);
        if (response.status === 200) {
          setOrderData(response.data);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl.BASEURL}/getVendorwithCity/${ViewData?.city}`
        );
        if (response.status === 200) {
          setVendorData(response.data.data);
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchOrders();
    if (ViewData?.city) fetchVendors();
  }, [ViewData?.city]);
  useEffect(() => {
    if (selectedDate && OrderData.length > 0) {
      const filteredData = OrderData.filter((order) => {
        const orderDate = moment(order.serviceDate, "DD-MM-YYYY");
        return orderDate.isSame(moment(selectedDate, "DD-MM-YYYY"), "day");
      });
      setFilterData(filteredData);
    }
  }, [selectedDate, OrderData]);

  useEffect(() => {
    if (ViewData?.vendor && vendorData.length > 0) {
      setSelectedVendors(ViewData.vendor);
    }
  }, [ViewData?.vendor]);

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
