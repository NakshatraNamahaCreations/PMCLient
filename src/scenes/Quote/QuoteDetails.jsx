import { Box } from "@mui/material";
import Header from "../../components/Header";
import moment from "moment";
import { Card, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { ApiUrl } from "../../ApiRUL";

import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/lab/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Button } from "react-bootstrap";
import { getData } from "../../methods";

const QuoteDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let eData = location.state.Edata || null;
  let servicedate = location.state.servicedate || null;
  const [Category, setCategory] = useState([]);
  const [Enquiry, setEnquiry] = useState(eData);

  const [ItemData, setItemData] = useState([]);
  const [Item, setItem] = useState({});
  const [FilteredItemData, setFilteredItemData] = useState([]);

  const [Extra, setExtra] = useState(0);
  const [QuoteData, setQuoteData] = useState({});

  const [PayloadData, setPayloadData] = useState({
    adjustment: QuoteData?.adjustment || 0,
    category: QuoteData?.serviceName,
    qty: 1,
    note: "",
    item: "",
    region: "",
    serviceName: QuoteData?.serviceName || "",
    packingLayer: QuoteData.packingLayer || "",
    unpacking: QuoteData.unpacking || false,
    dismantling: QuoteData.dismantling | false,
  });
  const [Rate, setRate] = useState(0);

  useEffect(() => {
    // Update PayloadData when QuoteData changes
    setPayloadData({
      adjustment: QuoteData?.adjustment || 0,
      category: QuoteData?.serviceName || "",
      qty: 1,
      note: "",
      item: "",
      region: "",
      packingLayer: QuoteData?.packingLayer || "",
      unpacking: QuoteData?.unpacking || false,
      dismantling: QuoteData?.dismantling || false,
    });

    // Also update the adjustment state whenever QuoteData changes
    setadjustment(QuoteData?.adjustment || 0);
  }, [QuoteData]);

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
  const [adjustment, setadjustment] = useState(QuoteData?.adjustment || 0); // Initialize with QuoteData's adjustment

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

  const [selectedData, setSelectedData] = useState(QuoteData?.Items || []);

  // Create a filter for Autocomplete
  // const filterOptions = createFilterOptions({
  //   matchFrom: "start",
  //   stringify: (option) =>
  //     `${option.category} - ${option.subcategory} - ${option.itemname}`,
  // });

  const filterOptions = createFilterOptions({
    matchFrom: "any", // Search can match from any part of the text
    stringify: (option) => option.itemname.toLowerCase(), // Only consider the itemname in lowercase
  });

  // Handle item selection from Autocomplete
  const handleSelect = (event, value) => {
    if (value) {
      const existingItem = selectedData.find((item) => item.id === value._id);
      if (!existingItem) {
        setSelectedData([
          ...selectedData,
          {
            id: value._id,
            category: value.category,
            subcategory: value.subcategory,
            itemname: value.itemname,
            qty: 1,
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

  useEffect(() => {
    if (QuoteData?.Items) {
      setSelectedData(QuoteData.Items);
    }
  }, [QuoteData]);

  // Calculate total weight and volume
  const total = selectedData?.reduce(
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

  console.log("selectedData", selectedData);

  const suitableVehicle = VehicleData?.find(
    (vehicle) =>
      vehicle.weightCapacity >= Number(total.totalWeight) &&
      vehicle.volumeCapacity >= Number(total.totalVolume)
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

  // Calculate Grand Total dynamically based on the adjustment
  const GT = adjustment
    ? Number(cityObject?.price) - Number(adjustment) + Number(adTotal)
    : Number(cityObject?.price) + Number(adTotal);

  // Update GrandTotal when adjustment or other values change
  useEffect(() => {
    setgrandTotal(GT);
  }, [adjustment, adTotal, cityObject?.price]);

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
          servicedate: servicedate,
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

  const UpdateQuote = async (e) => {
    e.preventDefault();

    try {
      const config = {
        url: `/quote/Updatequote/${QuoteData?._id}`,
        method: "put",
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
          servicedate: servicedate,
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

  const [whatsappdata, setwhatsappdata] = useState([]);

  useEffect(() => {
    getwhatsapptemplate();
  }, []);

  const getwhatsapptemplate = async () => {
    try {
      let res = await axios.get(
        "https://vijayhomeservicebangalore.in/api/getwhatsapptemplate"
      );
      if (res.status === 200) {
        let getTemplateDatails = res.data?.whatsapptemplate?.filter(
          (item) => item.templatename === "PM Quote"
        );
        setwhatsappdata(getTemplateDatails);
      }
    } catch (error) {
      console.error("err", error);
    }
  };
  const GoToInvoice = () => {
    if (whatsappdata.length > 0) {
      const selectedResponse = whatsappdata[0];

      makeApiCall(selectedResponse, QuoteData?.phone);
    } else {
      console.error("whatsappdata is empty. Cannot proceed.");
      alert("Not Added");
    }
    // Navigate(`/dsrquote/${data}`);
  };

  const makeApiCall = async (selectedResponse, contactNumber) => {
    const contentTemplate = selectedResponse?.template || "";

    if (!contentTemplate) {
      console.error("Content template is empty. Cannot proceed.");
      return;
    }

    const content = contentTemplate.replace(
      /\{Customer_name\}/g,
      QuoteData[0]?.name
    );

    const serviceName = content.replace(
      /\{Service_name\}/g,
      QuoteData.category
    );

    const invoiceUrl = `https://pmadmin.vijayhomeservice.in/quoteView/${QuoteData?._id}`;

    const invoiceLink = serviceName.replace(
      /\{Quote_link\}/g,
      `Click to view quotation  ${invoiceUrl}`
    );

    // Replace <p> with line breaks and remove HTML tags
    const convertedText = invoiceLink
      .replace(/<p>/g, "\n")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, "")
      .replace(/<strong>(.*?)<\/strong>/g, "<b>$1</b>")
      .replace(/<[^>]*>/g, "");

    try {
      const response = await axios.post(
        "https://api.vijayhomeservicebengaluru.in/send-message",
        {
          mobile: contactNumber,
          msg: convertedText,
        }
      );

      if (response.status === 200) {
        whatsappQuoteStatusChange();
        alert("Whats app message sent successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const whatsappQuoteStatusChange = async () => {
    try {
      const response = await axios.put(
        ApiUrl.BASEURL + `/quote/ChangeTheQuoteStatus/${QuoteData?._id}`
      );

      if (response.status === 200) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [SlotData, setSlotData] = useState([]);

  // Handle modal open/close
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle form submission
  const handleSubmit = () => {
    console.log("Selected Date:", serviceDate);
    console.log("Selected Slot:", selectedSlot);
    // Add your logic here for submitting the selected date and slot
    handleCloseModal(); // Close modal after submission
  };

  useEffect(() => {
    getSlots();
  }, []);

  const getSlots = async () => {
    try {
      const response = await getData(ApiUrl.GETSLOTS);

      if (response.status === 200) {
        const rowsWithId = response.data;

        setSlotData(rowsWithId);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const CovertToOrder = async (e) => {
    e.preventDefault();

    try {
      const config = {
        url: "/order/addorder",
        method: "post",
        baseURL: ApiUrl.BASEURL,
        // data: formdata,
        headers: { "content-type": "application/json" },
        data: {
          customer: QuoteData?.customer,
          email: QuoteData?.email,
          phone: QuoteData?.phone,
          Items: selectedData,
          userId: QuoteData?._id,
          pickupLocation: QuoteData?.pickupLocation,
          dropLocation: QuoteData?.dropLocation,
          serviceName: QuoteData?.serviceName,
          amount: grandTotal,
          baseAmount: cityObject?.price,
          bookingDate: moment().format("LLL"),
          serviceDate: serviceDate
            ? moment(serviceDate).format("DD/MM/YYYY")
            : moment().format("DD/MM/YYYY"),
          slot: selectedSlot,
          city: QuoteData?.city,
          category: "Packers & Movers",
          packingLayer: QuoteData?.packingLayer,
          unpacking: QuoteData?.unpacking,
          dismantling: QuoteData?.dismantling,
          distance: QuoteData?.distance,
          paymentStatus: "",
          pickupFloor: QuoteData?.pickupFloor,
          dropFloor: QuoteData?.dropFloor,
          vehicleName: suitableVehicle?.vehicalName,
          vehiclePrice: cityObject?.price,
          quoteId: QuoteData?._id,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Succesfuly converted to order");
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

  const handleEdit = (id) => {
    navigate("/enquiryadd", { state: id });
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
                <span className="sub_h">
                  {QuoteData?.enquiryData?.contact1}
                </span>
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
          <div className="row">
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">City:</span>
                <span className="sub_h">{Enquiry?.city}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">Pickup Floor:</span>
                <span className="sub_h">{Enquiry?.pickupFloor}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="m-auto">
                <span className="main_h me-2">Drop Floor:</span>
                <span className="sub_h">{Enquiry?.dropFloor}</span>
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
            <button
              className="col-md-2 p-1 save mt-2 mb-2"
              onClick={() => handleEdit(Enquiry?.enquiryId)}
            >
              Edit details
            </button>
          </div>
          <h3 style={{ color: "darkred" }}>Service Details</h3>
          <hr />

          {Object.keys(QuoteData).length === 0 ? (
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
                      filterOptions={(options, state) =>
                        filterOptions(options, {
                          ...state,
                          inputValue: state.inputValue.toLowerCase(),
                        })
                      } // Make inputValue lowercase to perform case-insensitive search
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
                            {item.category} - {item.subcategory} -{" "}
                            {item.itemname}
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
                    // onChange={(e) => setgrandTotal(e.target.value)}
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
                    onChange={(e) => setgrandTotal(e.target.value)}
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
          ) : (
            <div className="row">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Service DB <span className="red">*</span>
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
                      filterOptions={(options, state) =>
                        filterOptions(options, {
                          ...state,
                          inputValue: state.inputValue.toLowerCase(),
                        })
                      } // Make inputValue lowercase to perform case-insensitive search
                      options={itemsData}
                      getOptionLabel={(option) =>
                        `${option.category} - ${option.subcategory} - ${option.itemname}`
                      }
                      onChange={handleSelect}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      } // Ensure comparison is based on unique IDs
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
                            {item.category} - {item.subcategory} -{" "}
                            {item.itemname}
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
                  Vehicle: <span>{suitableVehicle?.vehicalName}</span>
                </Form.Label>
                <Form.Label>
                  Vehicle Price: <span>{suitableVehicle?.basePrice}</span>
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
                    checked={PayloadData?.unpacking} // Bound to PayloadData unpacking state
                  />
                </div>

                <div className="d-flex">
                  <Form.Check
                    type="checkbox"
                    label="Dismantling and reassembly of basic"
                    name="dismantling"
                    onChange={handleChange}
                    checked={PayloadData?.dismantling} // Bound to PayloadData dismantling state
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                    // onChange={(e) => setgrandTotal(e.target.value)}
                    value={cityObject?.price}
                    type="number"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>Adjustment</Form.Label>
                  <Form.Control
                    onChange={(e) => setadjustment(e.target.value)}
                    value={adjustment}
                    type="number"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>Grand total</Form.Label>
                  <Form.Control
                    onChange={(e) => setgrandTotal(e.target.value)}
                    value={grandTotal}
                    type="number"
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-3 p-1">
                  <button
                    className="w-100 btn save "
                    onClick={UpdateQuote}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                    }}
                  >
                    Update Quote
                  </button>
                </div>
                <div className="col-md-3 p-1">
                  <button
                    className="w-100 btn"
                    onClick={() => navigate(`/quoteView/${QuoteData?._id}`)}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                    }}
                  >
                    View Quote
                  </button>
                </div>
                <div className="col-md-3 p-1">
                  <button
                    className="w-100 btn"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                    }}
                    onClick={GoToInvoice}
                  >
                    Send Quote
                  </button>
                </div>
                <div className="col-md-3 p-1">
                  <button
                    className="w-100 btn"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                    }}
                    onClick={handleShowModal}
                  >
                    Convert to order
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select Service Date and Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Service Date Picker */}
              <Form.Group className="mb-3">
                <Form.Label>Service Date</Form.Label>
                <Form.Control
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </Form.Group>

              {/* Slot Selection */}
              <Form.Group className="mb-3">
                <Form.Label>Select Slot</Form.Label>
                <Form.Select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option>Select Slot</option>
                  {SlotData?.map((i) => (
                    <option value={i.startTime}>{i.startTime}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={CovertToOrder}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Box>
  );
};

export default QuoteDetails;
