import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import CustomColumnMenu from "../customgrid";
import { ApiUrl } from "../../ApiRUL";
import { getData, deleteData } from "../../methods";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import moment from "moment";

const Quote = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [QuoteData, setQuoteData] = useState([]);

  const { selectedDate } = useParams();

  console.log("selectedDate", selectedDate);

  const columns = [
    {
      field: "index",
      headerName: "#",
      renderCell: (params) => params.api.getRowIndex(params.row._id) + 1, // Index starts from 1
      width: 50, // Small fixed width for the index column
    },
    {
      field: "createdAt",
      headerName: "Q Dt-Tm",
      renderCell: ({ row }) => (
        <Typography color="inherit">
          {moment(row.createdAt).format("DD-MM-YYYY, LT")}
        </Typography>
      ),
      width: 150, // Fixed width for date and time
    },
    {
      field: "customer",
      headerName: "Name",
      width: 150, // Fixed width for customer name
    },
    {
      field: "phone",
      headerName: "Contact",
      width: 150, // Fixed width for phone number
    },
    {
      field: "pickupLocation",
      headerName: "Pickup Location",
      flex: 1, // Flexible width for longer text
      minWidth: 150, // Minimum width to maintain readability
    },
    {
      field: "dropLocation",
      headerName: "Drop Location",
      flex: 1, // Flexible width for longer text
      minWidth: 150, // Minimum width to maintain readability
    },
    {
      field: "city",
      headerName: "City",
      width: 150, // Fixed width for city name
    },
    {
      field: "serviceName",
      headerName: "Service",
      flex: 1, // Flexible width for service name
      minWidth: 150, // Minimum width to maintain readability
    },
    {
      field: "amount",
      headerName: "QAmt",
      width: 120, // Fixed width for amount
    },
    {
      field: "quoteStatus",
      headerName: "Status",
      width: 150,
    },
  ];

  const navigate = useNavigate();

  const handleQuoteDetails = (data) => {
    navigate(`/quotedetails/${data.row._id}`, {
      state: { Edata: data.row, type: "quote" },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const quoteResponse = await getData(ApiUrl.GetByDateQuote + selectedDate);

      if (quoteResponse.status === 200) {
        setQuoteData(quoteResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="QUOTE" />
      <div className="row">
        <div className="enquir-tab">
          <a href="/quoteCalendar" className="enquiry-btn p-1 me-3">
            Calendar
          </a>
        </div>
      </div>
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
          onRowClick={handleQuoteDetails}
          rows={QuoteData.map((row) => ({ ...row, id: row._id }))}
          columns={columns}
          getRowId={(row) => row._id} // Ensure unique row IDs
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
          // Apply custom class based on row data
          getRowClassName={(params) =>
            params.row.quoteStatus === "SHARED" ? "row-shared" : "row-other"
          }
        />
      </Box>
    </Box>
  );
};

export default Quote;
