import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Header from "../../components/Header";

import StatBox from "../../components/StatBox";

import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import axios from "axios";
import { useEffect, useState } from "react";
import { ApiUrl } from "../../ApiRUL";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [EnquiryData, setEnquiryData] = useState();
  const [OrdersData, setOrdersData] = useState();
  const [VendorData, setVendorData] = useState();

  useEffect(() => {
    getEnquiryCountData();
    getOrdersCountData();
    getVendorCountData();
  }, []);

  const getEnquiryCountData = async () => {
    let res = await axios.get(ApiUrl.BASEURL + "/enquiry/getTotalNumerEnquiry");
    if ((res.status = 200)) {
      setEnquiryData(res.data);
    }
  };
  const getOrdersCountData = async () => {
    let res = await axios.get(ApiUrl.BASEURL + "/order/getTotalNumerOrders");
    if ((res.status = 200)) {
      setOrdersData(res.data);
    }
  };
  const getVendorCountData = async () => {
    let res = await axios.get(ApiUrl.BASEURL + "/TotalNumberOfvendors/");
    if ((res.status = 200)) {
      setVendorData(res.data);
    }
  };
  return (
    <Box m="20px">
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* Main Grid Section */}

      <div style={{ display: "flex" }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)" // Use a 12-column grid
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Row 1: Enquiry Box */}
          <Box
            gridColumn="span 9"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={EnquiryData}
              subtitle="Enquiry"
              // progress="0.75"
              // increase="+14%"
              icon={
                <InventoryOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* Row 2: Orders Box */}
          <Box
            gridColumn="span 9"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={OrdersData}
              subtitle="Orders"
              // progress="0.50"
              // increase="+21%"
              icon={
                <ReceiptOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* Row 3: Vendors Box */}
          <Box
            gridColumn="span 9"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={VendorData?.totalVendors}
              subtitle="Vendors"
              // progress="0.30"
              // increase="+5%"
              icon={
                <PersonAddIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* Image spanning all 3 rows */}
        </Box>
        <Box
          gridColumn="span 3" // Image spans 3 out of 12 columns on the right
          gridRow="span 3" // Image spans 3 rows vertically
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src="./assets/3725921.jpg"
            height="470"
            width="100%"
            style={{ objectFit: "contain" }} // Ensure the image fits inside the box
            alt="Dashboard Image"
          />
        </Box>
      </div>
    </Box>
  );
};

export default Dashboard;
