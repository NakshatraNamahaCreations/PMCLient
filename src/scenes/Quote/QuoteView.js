import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl } from "../../ApiRUL";
import { ArrowDownward, CalendarMonth } from "@mui/icons-material";
import InventoryIcon from "@mui/icons-material/Inventory"; // Icon for packing layer
import BuildIcon from "@mui/icons-material/Build"; // Icon for dismantling and reassembly
import UnarchiveIcon from "@mui/icons-material/Unarchive"; // Icon for unpacking
import StraightenIcon from "@mui/icons-material/Straighten"; // Icon for distance
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarRateIcon from "@mui/icons-material/StarRate";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const QuoteView = () => {
  const { quoteID } = useParams();
  const [quoteData, setQuoteData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("quoteData-", quoteData);

  useEffect(() => {
    const getQuoteParticularData = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl.BASEURL}/quote/findbyQuoteId/${quoteID}`
        );
        if (res.status === 200) {
          setQuoteData(res.data);
        } else {
          throw new Error("Failed to fetch quote data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (quoteID) {
      getQuoteParticularData();
    }
  }, [quoteID]);

  const formatCurrency = (amount) => `₹${amount}`;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  console.log("quoteData", quoteData);

  return (
    <Box p={3}>
      <img
        src="https://vijayahomeservices.b-cdn.net/P%26M.jpg"
        style={{ width: "100%" }}
        alt="Vijay Home Service Logo"
      />
      {/* <div
        className="row align-items-center py-3"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <div className="col-md-3 col-12 d-flex align-items-center mb-3 mb-md-0 justify-content-start">
          <img
            src="https://vijayahomeservices.b-cdn.net/Vijay%20Home%20Service%20Logo.jpeg"
            style={{ width: "60px", marginRight: "10px" }}
            alt="Vijay Home Service Logo"
          />
          <div className="text-center text-md-start">
            <h5
              className="mb-1"
              style={{
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Vijay Home Service
            </h5>
            <h5
              style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}
            >
              Packers and Movers
            </h5>
          </div>
        </div>

        <div className="col-md-6 col-12 text-center mb-3 mb-md-0">
          <div
            style={{
              backgroundColor: "#03A9F4",
              color: "white",
              padding: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            THE AWARD-WINNING COMPANY
          </div>
        </div>

        <div className="col-md-3 col-12 text-center text-md-end mt-md-0 mt-2">
          <div
            style={{
              fontSize: "16px",
              color: "black",
              fontWeight: "700",
            }}
          >
            50+ Shifting Daily
          </div>
        </div>
      </div> */}

      <Grid
        container
        spacing={3}
        sx={{
          marginTop: "20px",
        }}
      >
        {/* First Column */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Customer Name :{quoteData?.enquiryData?.customer}
          </Typography>

          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Phone : {quoteData?.enquiryData?.contact1}
          </Typography>

          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Email : {quoteData?.enquiryData?.email}
          </Typography>
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Service Name : {quoteData?.enquiryData?.service}
          </Typography>

          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Drop Floor : {quoteData?.enquiryData?.dropFloor || "N/A"}
          </Typography>

          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Pickup Floor : {quoteData?.enquiryData?.pickupFloor || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        sx={{ marginTop: 4, fontWeight: "bold", color: "#1976d2" }}
      >
        Relocation Detail
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          marginTop: "5px",
          // padding: "20px",
          // backgroundColor: "#ffffff",
          // borderRadius: "8px",
          // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Pickup Location */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ color: "#333", fontWeight: "bold", marginBottom: "10px" }}
          >
            Pickup Location
          </Typography>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ marginRight: 1, color: "red" }} />
            <Typography variant="h5">
              {quoteData?.enquiryData?.pickupLocation}
            </Typography>
          </Box>
        </Grid>

        {/* Arrow between Pickup and Drop locations */}
        {/* <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
          <ArrowDownward sx={{ color: "gray" }} />
        </Grid> */}

        {/* Drop Location */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ color: "#333", fontWeight: "bold", marginBottom: "10px" }}
          >
            Drop Location
          </Typography>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ marginRight: 1, color: "green" }} />
            <Typography variant="h5">
              {quoteData?.enquiryData?.dropLocation}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={6}>
          {/* Lowest Price Guarantee */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <PriceCheckIcon sx={{ marginRight: "8px", color: "#1976d2" }} />
            <Box>
              <Typography variant="h5">
                <strong>Lowest Price Guarantee</strong>
              </Typography>
              <Typography variant="subtitle2">
                Moving at the price you can afford - We will match any other
                competitors' quoted price.
              </Typography>
            </Box>
          </Box>

          {/* Free Reschedule */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <ScheduleIcon sx={{ marginRight: "8px", color: "#1976d2" }} />
            <Box>
              <Typography variant="h5">
                <strong>Free Reschedule</strong>
              </Typography>
              <Typography variant="subtitle2">
                Reschedule your shifting date anytime by visiting My Bookings.
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* 5-Star Rated Partners */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <StarRateIcon sx={{ marginRight: "8px", color: "#FFD700" }} />
            <Box>
              <Typography variant="h5">
                <strong>5-Star Rated Partners</strong>
              </Typography>
              <Typography variant="subtitle2">
                Get exceptional service by 5-star rated packers and movers,
                renowned for their professionalism.
              </Typography>
            </Box>
          </Box>

          {/* Customer Support */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <SupportAgentIcon sx={{ marginRight: "8px", color: "#1976d2" }} />
            <Box>
              <Typography variant="h5">
                <strong>Customer Support</strong>
              </Typography>
              <Typography variant="subtitle2">
                Assists your movement to make sure it is hassle-free.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        style={{
          background: "#fdcc39d1",
          width: "50%",
          padding: "5px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Box display="flex" alignItems="center" style={{}}>
          <CalendarMonth style={{ marginRight: "8px", color: "black" }} />
          <Typography variant="h5">
            Shifting Date - {quoteData?.servicedate}
          </Typography>
        </Box>
      </Grid>
      {/* Items Table */}
      {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}> */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        <strong>Items Details</strong>
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <TableContainer>
        <Table
          sx={{
            width: "50%",
            backgroundColor: "#fdcc39d1",
            borderCollapse: "collapse", // Ensures no border spacing between cells
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: "10%",
                  color: "black",
                  backgroundColor: "#fdcc39d1",
                  borderBottom: "none", // Hide bottom border
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  width: "40%",
                  color: "black",
                  backgroundColor: "#fdcc39d1",
                  borderBottom: "none", // Hide bottom border
                }}
              >
                Item Name
              </TableCell>
              <TableCell
                sx={{
                  width: "10%",
                  color: "black",
                  backgroundColor: "#fdcc39d1",
                  borderBottom: "none", // Hide bottom border
                }}
              >
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteData.Items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: "black",
                    backgroundColor: "white",
                    borderBottom: "none", // Hide bottom border
                  }}
                >
                  {item.category}
                </TableCell>
                <TableCell
                  sx={{
                    color: "black",
                    backgroundColor: "white",
                    borderBottom: "none", // Hide bottom border
                  }}
                >
                  {item.itemname}
                </TableCell>
                <TableCell
                  sx={{
                    color: "black",
                    backgroundColor: "white",
                    borderBottom: "none", // Hide bottom border
                  }}
                >
                  {item.qty}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* </Paper> */}
      {/* Charges Breakdown */}
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Packing Layer */}
          <Box display="flex" alignItems="center" mb={2}>
            <InventoryIcon style={{ marginRight: "8px", color: "#1976d2" }} />
            <Typography variant="h5">
              <strong>Packing Layer:</strong> {quoteData.packingLayer}
            </Typography>
          </Box>

          {/* Dismantling and reassembly */}
          <Box display="flex" alignItems="center" mb={2}>
            <BuildIcon style={{ marginRight: "8px", color: "#f57c00" }} />
            <Typography variant="h5">
              <strong>Dismantling and reassembly of basic:</strong>{" "}
              {quoteData.dismantling ? "Yes" : "No"}
            </Typography>
          </Box>

          {/* Unpacking */}
          <Box display="flex" alignItems="center" mb={2}>
            <UnarchiveIcon style={{ marginRight: "8px", color: "#4caf50" }} />
            <Typography variant="h5">
              <strong>Unpacking all the packed items:</strong>{" "}
              {quoteData.unpacking ? "Yes" : "No"}
            </Typography>
          </Box>

          {/* Unpacking */}
          <Box display="flex" alignItems="center" mb={2}>
            <DirectionsCarIcon
              style={{ marginRight: "8px", color: "#4caf50" }}
            />
            <Typography variant="h5">
              <strong>Vehicle </strong> {quoteData.vehicleName}
            </Typography>
          </Box>

          {/* Distance */}
          <Box display="flex" alignItems="center">
            <StraightenIcon style={{ marginRight: "8px", color: "#9c27b0" }} />
            <Typography variant="h5">
              <strong>Distance:</strong> {quoteData?.enquiryData?.distance} km
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* Final Quotation */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* Other content here if any */}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end" // Aligns the content to the right
            justifyContent="center"
            sx={{ paddingRight: "20px", textAlign: "right" }} // Adjust padding
          >
            <Typography variant="h5" sx={{ marginBottom: "8px" }}>
              <strong>Amount:</strong> {formatCurrency(quoteData.bookingAmount)}
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: "8px" }}>
              <strong>Adjustment:</strong>{" "}
              {formatCurrency(quoteData.adjustment)}
            </Typography>

            <Typography variant="h5">
              <strong>Total Amount:</strong> {formatCurrency(quoteData.amount)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Typography
        variant="h3"
        gutterBottom
        style={{
          background: "#03A9F4",
          color: "white",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <strong> General Terms and Conditions </strong>
      </Typography>

      <Typography variant="h5">
        1.GSTIN details should be shared in advance; no changes will be made to
        the final invoice once it is generated from the system
      </Typography>
      <Divider sx={{}} />
      <Typography variant="h5">
        2.The quotation provided will be valid if approved within Fifteen (15)
        days of submission and the move occurs within Thirty (30) days
      </Typography>
      <Typography variant="h5">
        3.Written confirmation of this quotation is required along with the
        payment of Gross Freight and GST (if applicable) prior to the
        commencement of packing, Settlement of balance payment will be prior to
        the dispatch of consignment from origin
      </Typography>
      <Divider sx={{}} />
      <Typography variant="h5">
        4.We will charge for the actual volume involved and therefore, if the
        volume is more than our estimates, we will increase our charges
        proportionately
      </Typography>
      <Typography variant="h5">
        5.If packing is being done by the client it must be in road-worthy
        condition and each item should be valued properly in the Inventory List
      </Typography>
      <Divider sx={{}} />
      <Typography variant="h5">
        6.Cloth Sheet, LED/LCD Box, Perfect Box and other materials are the
        property of Vijay Home Services. It should be returned back to VHS after
        unloading on the same day. Any detention for whatever reasons will be an
        unauthorized act inviting appropriate actions.
      </Typography>
      <Typography variant="h5">
        7.The Locking/Unlocking of machines/appliances and any other electronic
        gadget which requires the technical assistance of the manufacturer or
        their authorized dealer, to make them suitable for safe transport must
        be arranged by the Client the transporter at least 24 hours before the
        packing starts. The Client is most essential as these appliances are
        covered either by warranty or service contract.
      </Typography>
      <Divider sx={{}} />

      <Typography variant="h5">
        8.All Electronic items/computers are packed on an as is where is basis.
        As such company does not accept any liability whatsoever for any defect
      </Typography>

      <img
        src="https://vijayahomeservices.b-cdn.net/pm-Footer.jpg"
        style={{ width: "100%", height: "100%", marginTop: "10px" }}
      />
    </Box>
  );
};

export default QuoteView;
