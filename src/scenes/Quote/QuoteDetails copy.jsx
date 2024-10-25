import { Box } from "@mui/material";
import Header from "../../components/Header";
import moment from "moment";
import { Card, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiUrl } from "../../ApiRUL";

import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/lab/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Button } from "react-bootstrap";

const QuoteDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let eData = location.state.Edata || null;
  let EType = location.state.type || null;
  const [Category, setCategory] = useState([]);
  const [Enquiry, setEnquiry] = useState(eData);

  const [ItemData, setItemData] = useState([]);
  const [Item, setItem] = useState({});
  const [FilteredItemData, setFilteredItemData] = useState([]);

  const [QuoteData, setQuoteData] = useState([]);
  const [PayloadData, setPayloadData] = useState({
    adjustmentAmt: 0,
    category: QuoteData?.serviceName,
    qty: 1,
    note: "",
    item: "",
    region: "",
    packingLayer: QuoteData.packingLayer,
    unpacking: false,
    dismantling: false,
  });
  const [Rate, setRate] = useState(0);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    const newValue = type === "checkbox" ? checked : value; // Handle checkbox state correctly

    setPayloadData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Handle category and item logic here, but these won't affect the checkboxes
    if (name === "category") {
      const filteredItems = ItemData?.filter(
        (ele) => ele?.category?.toLowerCase() === value?.toLowerCase()
      );
      setFilteredItemData(filteredItems);
      setItem({});
      setPayloadData((prev) => ({ ...prev, item: "", rate: 0 }));
    }

    if (name === "item") {
      const selectedItem = FilteredItemData?.find((ele) => ele._id === value);
      setItem(selectedItem);
      setRate(selectedItem?.offerPrice || 0);
    }
  };

  useEffect(() => {
    getservices();
    getAllItems();
    getAllVehicle();

    getQuoteParticularData();
  }, []);

  const [serviceData, setserviceData] = useState([]);
  const [itemsData, setitemsData] = useState([]);
  const [VehicleData, setVehicleData] = useState([]);
  const [grandTotal, setgrandTotal] = useState();
  const [adjustment, setadjustment] = useState();

  console.log("QuoteData in quote details", QuoteData);

  const getservices = async () => {
    let res = await axios.get(ApiUrl.BASEURL + "/service/getServiceNames");
    if ((res.status = 200)) {
      setserviceData(res.data);
    }
  };

  const getAllItems = async () => {
    let res = await axios.get(ApiUrl.BASEURL + ApiUrl.GETITEMS);
    if ((res.status = 200)) {
      setitemsData(res.data);
    }
  };
  const getAllVehicle = async () => {
    let res = await axios.get(ApiUrl.BASEURL + ApiUrl.GETVEHICAL);
    if ((res.status = 200)) {
      setVehicleData(res.data);
    }
  };

  const getQuoteParticularData = async () => {
    let res = await axios.get(
      ApiUrl.BASEURL + "/quote/QuotefindWithEnquiryID/" + eData?.enquiryId
    );
    if ((res.status = 200)) {
      setQuoteData(res.data);
    }
  };

  const [selectedData, setSelectedData] = useState([]);

  // Create a filter for Autocomplete
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) =>
      `${option.category} - ${option.subcategory} - ${option.itemname}`,
  });

  // Handle item selection from Autocomplete
  const handleSelect = (event, value) => {
    if (value) {
      const existingItem = selectedData.find((item) => item.id === value._id);
      if (!existingItem) {
        // Add new item with default quantity 1
        setSelectedData([
          ...selectedData,
          {
            id: value._id,
            category: value.category,
            subcategory: value.subcategory,
            itemname: value.itemname,
            qty: 1, // default qty
            weight: value.weight || 1,
            volume: value.volume || 1,
            packingPrice: value.packingPrice || 20,
          },
        ]);
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (id, change) => {
    setSelectedData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
      )
    );
  };

  // Remove item from selected list
  const handleRemove = (id) => {
    setSelectedData((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total weight and volume
  const total = selectedData.reduce(
    (acc, item) => {
      acc.totalWeight += parseFloat(item.weight) * item.qty;
      acc.totalVolume += parseFloat(item.volume) * item.qty;
      return acc;
    },
    { totalWeight: 0, totalVolume: 0 } // Initial accumulator values
  );
  const Layertotal = selectedData?.reduce(
    (acc, item) => {
      acc.packingAmount += parseFloat(item?.packingPrice) * item.qty;

      return acc;
    },
    { packingAmount: 0 } // Initial accumulator values
  );

  const suitableVehicle = VehicleData.find(
    (vehicle) =>
      vehicle.weightCapacity >= total.totalWeight &&
      vehicle.volumeCapacity >= total.totalVolume
  );
  const cityObject = suitableVehicle?.cities.find(
    (city) => city.city === Enquiry?.city
  );

  const layerTotal =
    PayloadData?.packingLayer === "Single"
      ? Layertotal.packingAmount
      : PayloadData?.packingLayer === "Multi"
      ? Layertotal.packingAmount * 2
      : 0;
  const layerTotal1 = PayloadData?.unpacking ? Layertotal.packingAmount : 0;
  const layerTotal2 = PayloadData?.dismantling ? Layertotal.packingAmount : 0;
  const adTotal = layerTotal + layerTotal1 + layerTotal2;

  const GT = adjustment
    ? Number(cityObject?.price) - Number(adjustment) + Number(adTotal)
    : Number(cityObject?.price) + Number(adTotal);

  const CreateQuote = async (e) => {
    e.preventDefault();

    try {
      const config = {
        url: "/quote/addquote",
        method: "post",
        baseURL: ApiUrl.BASEURL,
        // data: formdata,
        headers: { "content-type": "application/json" },
        data: {
          customer: Enquiry.customer,
          enquiryId: Enquiry.enquiryId,
          email: Enquiry.email,
          phone: Enquiry?.contact1,

          pickupLocation: Enquiry?.pickupLocation,
          dropLocation: Enquiry?.dropLocation,

          serviceName: PayloadData.category,

          pickupFloor: Enquiry?.pickupFloor,
          dropFloor: Enquiry?.dropFloor,

          amount: GT,
          bookingAmount: GT,
          adjustment: adjustment,
          city: Enquiry?.city,
          userId: Enquiry?.userId,
          Items: selectedData,
          distance: Enquiry?.distance,
          packingLayer: PayloadData?.packingLayer,
          unpacking: PayloadData?.unpacking,
          dismantling: PayloadData?.dismantling,
          baseAmount: GT,
          paymentStatus: "",
          vehicleName: suitableVehicle?.vehicalName,
          vehiclePrice: suitableVehicle?.basePrice,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Succesfuly created");
          window.location.reload("");
        }
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.error); // Display error message from the API response
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="QUOTE" />
      <div className="row">
        <div className="enquir-tab">
          <a href="/quotelist" className="enquiry-btn p-1 me-3">
            Quotelist
          </a>

          <a href="/confirmed" className="enquiry-btn p-1 me-3">
            Confirmed
          </a>
        </div>
      </div>
      <div className="row mt-5 m-auto">
        <Card className="p-4">
          <h4>Billing Details</h4>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">Enquiry Id :</span>
                <span className="sub_h">{Enquiry?.enquiryId}</span>
              </p>
              <p className="m-auto">
                <span className="main_h me-2">Email :</span>
                <span className="sub_h">{Enquiry?.email}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">Mobile No :</span>
                <span className="sub_h">{Enquiry?.contact1}</span>
              </p>
              <p className="m-auto">
                <span className="main_h me-2">Pickup location :</span>
                <span className="sub_h">{Enquiry?.pickupLocation}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">Customer Name :</span>
                <span className="sub_h">{Enquiry?.customer}</span>
              </p>
              <p className="m-auto">
                <span className="main_h me-2">Drop location :</span>
                <span className="sub_h">{Enquiry?.dropLocation}</span>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <p className="m-auto">
              <span className="main_h me-2">Distance:</span>
              <span className="sub_h">{Enquiry?.distance}</span>
            </p>
          </div>
          <div className="row">
            <button className="col-md-2 p-1 save mt-2 mb-2">
              Edit details
            </button>
          </div>
          <h3 style={{ color: "darkred" }}>Service Details</h3>
          <hr />
          <div className="row">
            <div className="row">
              <div className="col-md-4 mb-3">
                <Form.Label>
                  Service <span className="red">*</span>
                </Form.Label>
                <Form.Select
                  className="mb-3"
                  onChange={handleChange}
                  value={PayloadData?.category}
                  name="category"
                >
                  <option>Select Service</option>
                  {serviceData?.map((ele) => (
                    <option key={ele.servicename} value={ele.servicename}>
                      {ele.servicename}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="row" style={{ marginTop: "10px" }}>
                <h5>Select Items</h5>
                <div className="col-md-6 mb-3">
                  {/* Autocomplete search input */}
                  <Autocomplete
                    style={{ width: 500 }}
                    filterOptions={filterOptions}
                    options={itemsData}
                    getOptionLabel={(option) =>
                      `${option.category} - ${option.subcategory} - ${option.itemname}`
                    }
                    onChange={handleSelect}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    } // Ensures comparison is based on unique IDs
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Search Items"
                        placeholder="Type to search..."
                      />
                    )}
                  />
                </div>

                {/* Display selected items */}
                <div className="col-md-12 mt-3">
                  {selectedData.map((item) => (
                    <div key={item.id} className="selected-item row mb-2">
                      <div className="col-md-6">
                        <strong>
                          {item.category} - {item.subcategory} - {item.itemname}
                        </strong>
                      </div>
                      <div className="col-md-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.qty}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="col-md-3">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label
                  style={{ fontSize: "20px", textDecoration: "underline" }}
                >
                  Vehicle details
                </Form.Label>
              </div>
              <Form.Label>
                Vehicle :<span>{suitableVehicle?.vehicalName}</span>
              </Form.Label>
              <Form.Label>
                VehiclePrice :<span>{cityObject?.price}</span>
              </Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Single layer packing"
                  name="packingLayer"
                  value="Single"
                  onChange={handleChange}
                  checked={PayloadData?.packingLayer === "Single"} // Only checked if value is "Single"
                />
                <p>-{Layertotal?.packingAmount}</p>
              </div>

              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Multi layer packing"
                  name="packingLayer"
                  value="Multi"
                  onChange={handleChange}
                  checked={PayloadData?.packingLayer === "Multi"} // Only checked if value is "Multi"
                />
                <p>-{Layertotal?.packingAmount * 2}</p>
              </div>

              <div className=" d-flex">
                <Form.Check
                  type="checkbox"
                  label="Unpacking all the packed items"
                  name="unpacking"
                  onChange={handleChange}
                  checked={PayloadData?.unpacking} // Bound to PayloadData unpacking state
                />
                <p>-{Layertotal?.packingAmount}</p>
              </div>

              <div className="d-flex">
                <Form.Check
                  type="checkbox"
                  label="Dismantling and reassembly of basic"
                  name="dismantling"
                  onChange={handleChange}
                  checked={PayloadData?.dismantling} // Bound to PayloadData dismantling state
                />
                <p>-{Layertotal?.packingAmount}</p>
              </div>

              <div className="col-md-4 mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  onChange={(e) => setgrandTotal(e.target.value)}
                  value={cityObject?.price}
                  type="number"
                />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Adjustment</Form.Label>
                <Form.Control
                  onChange={(e) => setadjustment(e.target.value)}
                  value={cityObject?.adjustment}
                  type="number"
                />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Grand total</Form.Label>
                <Form.Control
                  onChange={(e) => setadjustment(e.target.value)}
                  value={GT}
                  type="number"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="row m-auto">
                <button
                  className="col-md-3 m-auto p-1 save me-2"
                  onClick={CreateQuote}
                >
                  Save Quote
                </button>
                <button
                  className="col-md-3 m-auto p-1 save"
                  onClick={() => navigate("quoteView")}
                >
                  View Quote
                </button>

                <button className="col-md-3 m-auto p-1 save">Cancel</button>
              </div>
            </div>
          </div>

          <h2>Already added data</h2>

          <div className="row">
            <div className="row">
              <div className="col-md-4 mb-3">
                <Form.Label>
                  Service <span className="red">*</span>
                </Form.Label>
                <Form.Select
                  className="mb-3"
                  onChange={handleChange}
                  value={QuoteData?.serviceName}
                  name="category"
                >
                  <option>Select Service</option>
                  {serviceData?.map((ele) => (
                    <option key={ele.servicename} value={ele.servicename}>
                      {ele.servicename}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="row" style={{ marginTop: "10px" }}>
                <h5>Select Items</h5>
                <div className="col-md-6 mb-3">
                  {/* Autocomplete search input */}
                  <Autocomplete
                    style={{ width: 500 }}
                    filterOptions={filterOptions}
                    options={itemsData}
                    getOptionLabel={(option) =>
                      `${option.category} - ${option.subcategory} - ${option.itemname}`
                    }
                    onChange={handleSelect}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    } // Ensures comparison is based on unique IDs
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Search Items"
                        placeholder="Type to search..."
                      />
                    )}
                  />
                </div>

                {/* Display selected items */}
                <div className="col-md-12 mt-3">
                  {QuoteData?.Items.map((item) => (
                    <div key={item.id} className="selected-item row mb-2">
                      <div className="col-md-6">
                        <strong>
                          {item.category} - {item.subcategory} - {item.itemname}
                        </strong>
                      </div>
                      <div className="col-md-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.qty}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="col-md-3">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label
                  style={{ fontSize: "20px", textDecoration: "underline" }}
                >
                  Vehicle details
                </Form.Label>
              </div>
              <Form.Label>
                Vehicle :<span>{QuoteData?.vehicleName}</span>
              </Form.Label>
              <Form.Label>
                VehiclePrice :<span>{QuoteData?.vehiclePrice}</span>
              </Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Single layer packing"
                  name="packingLayer"
                  value="Single"
                  onChange={handleChange}
                  checked={QuoteData?.packingLayer === "Single"} // Only checked if value is "Single"
                />
              </div>

              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Multi layer packing"
                  name="packingLayer"
                  value="Multi"
                  onChange={handleChange}
                  checked={PayloadData?.packingLayer === "Multi"} // Only checked if value is "Multi"
                />
              </div>

              <div className=" d-flex">
                <Form.Check
                  type="checkbox"
                  label="Unpacking all the packed items"
                  name="unpacking"
                  onChange={handleChange}
                  checked={QuoteData?.unpacking} // Bound to PayloadData unpacking state
                />
              </div>

              <div className="d-flex">
                <Form.Check
                  type="checkbox"
                  label="Dismantling and reassembly of basic"
                  name="dismantling"
                  onChange={handleChange}
                  checked={QuoteData?.dismantling} // Bound to PayloadData dismantling state
                />
              </div>

              <div className="col-md-4 mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  onChange={(e) => setgrandTotal(e.target.value)}
                  value={QuoteData?.bookingAmount}
                  type="number"
                />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Adjustment</Form.Label>
                <Form.Control
                  onChange={(e) => setadjustment(e.target.value)}
                  value={QuoteData?.adjustment}
                  type="number"
                />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Grand total</Form.Label>
                <Form.Control
                  onChange={(e) => setadjustment(e.target.value)}
                  value={QuoteData?.amount}
                  type="number"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="row m-auto">
                <button
                  className="col-md-3 m-auto p-1 save me-2"
                  onClick={CreateQuote}
                >
                  Save Quote
                </button>
                <button
                  className="col-md-3 m-auto p-1 save"
                  onClick={() => navigate("quoteView")}
                >
                  View Quote
                </button>

                <button className="col-md-3 m-auto p-1 save">Cancel</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Box>
  );
};

export default QuoteDetails;
