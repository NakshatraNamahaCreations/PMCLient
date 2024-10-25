import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ApiUrl } from "../../ApiRUL";
import { getData } from "../../methods";

const localizer = momentLocalizer(moment);

// Corrected transformEvents function to use createdAt instead of serviceDate
const transformEvents = (data) => {
  const eventMap = data.reduce((acc, item) => {
    const date = moment(item.createdAt).startOf("day").toDate(); // Parse and normalize date

    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }
    acc[date].count += 1;
    return acc;
  }, {});

  // Convert aggregated event counts to calendar event format
  return Object.values(eventMap).map((event) => ({
    title: `${event.count} orders`,
    start: event.date,
    end: event.date,
    allDay: true,
  }));
};

const Order = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [OrderData, setOrderData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    try {
      const response = await getData(ApiUrl.GETCALendarDte);
      if (response.status === 200) {
        setOrderData(response.data);
      } else {
        setError("Failed to load order data");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders");
    }
  };

  const handleSelect = (event) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD"); // Standardize date format
    window.open(`/quotelist/${selectedDate}`, "_blank"); // Open in new tab/window
  };

  return (
    <Box m="20px">
      <Header title="ORDER" subtitle="List of Orders" />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Calendar
            localizer={localizer}
            events={transformEvents(OrderData)}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelect}
          />
        )}
      </Box>
    </Box>
  );
};

export default Order;
