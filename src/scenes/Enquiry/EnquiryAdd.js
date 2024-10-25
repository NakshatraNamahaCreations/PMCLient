import { Box, useTheme, Button } from "@mui/material";

import { tokens } from "../../theme";

import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { ApiUrl } from "../../ApiRUL";
import { deleteData, getData, postData, putData } from "../../methods";
import EnquiryTab from "./EnquiryTab";
import { useLocation } from "react-router-dom";
import axios from "axios";

const EnquiryAdd = () => {
  const theme = useTheme();
  const location = useLocation();
  let data = location.state || null;

  console.log("data---", data);
  const [AddEnquiry, setAddEnquiry] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  let InitialData = {
    excutive: "",
    customer: "",
    email: "",
    cont1: "",
    cont2: "",
    pickupLocation: "",
    dropLocation: "",
    city: "",
    category: "",
    reference: "",
    service: "",
    distance: "",
    dropFloor: "",
    pickupFloor: "",
  };
  const [PayloadData, setPayloadData] = useState(InitialData);
  const [ServiceData, setServiceData] = useState([]);
  const [Enquiry, setEnquiry] = useState([]);
  const [Category, setCategory] = useState([]);
  const handleChange = (e) => {
    let { name, value } = e.target;

    setPayloadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log("PayloadData", PayloadData);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [EnquiryId, setEnquiryId] = useState(`VHS${Enquiry?.length + 1}`);

  useEffect(() => {
    // let Enquiry = Enquiry?.find((ele) => ele._id === data);

    setPayloadData({
      excutive: Enquiry?.excutive,
      customer: Enquiry?.customer,
      email: Enquiry?.email,
      cont1: Enquiry?.contact1,
      cont2: Enquiry?.contact2,
      pickupLocation: Enquiry?.pickupLocation,
      dropLocation: Enquiry?.dropLocation,
      address: Enquiry?.address,
      city: Enquiry?.city,
      category: Enquiry?.category,
      service: Enquiry?.service,
      type: Enquiry?.reference,
      distance: Enquiry?.distance,
      dropFloor: Enquiry?.dropFloor,
      pickupFloor: Enquiry?.pickupFloor,
    });

    if (Enquiry?.enquiryDate) {
      setCurrentDate(new Date(Enquiry?.enquiryDate));
    }

    if (Enquiry) {
      setEnquiryId(Enquiry?.enquiryId);
    } else {
      setEnquiryId(`VHS${Enquiry?.length + 1}`);
    }
  }, [data, Enquiry]);

  useEffect(() => {
    getService();
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getEnquirybyID();
  }, [data]);

  const getEnquirybyID = async () => {
    let res = await axios.get(
      ApiUrl.BASEURL + "/enquiry/findbyEnquiryID/" + data
    );
    if ((res.status = 200)) {
      setEnquiry(res.data);
    }
  };

  const getService = async () => {
    try {
      const response = await getData(ApiUrl.GETSERVICE);
      // const res = await getData(ApiUrl.GETENQUIRY);
      const category = await getData(ApiUrl.GETCATEGORY);
      if (category.status === 200) {
        setCategory(category.data);
      }
      // if (res.status === 200) {
      //   setEnquiry(res.data);
      // }
      if (response.status === 200) {
        setServiceData(response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDENQUIRY, {
        enquiryId: EnquiryId,
        enquiryDate: currentDate,
        excutive: PayloadData.excutive,
        customer: PayloadData.customer,
        email: PayloadData.email,
        contact1: PayloadData.cont1,
        contact2: PayloadData.cont2,
        pickupLocation: PayloadData?.pickupLocation,
        dropLocation: PayloadData?.dropLocation,
        city: PayloadData.city,
        category: PayloadData.category,
        type: PayloadData.reference,
        service: PayloadData.service,
        distance: PayloadData.distance,
        dropFloor: PayloadData.dropFloor,
        pickupFloor: PayloadData.pickupFloor,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddEnquiry(false);
        window.location.assign("/enquiry");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATENQUIRY + data, {
        enquiryId: EnquiryId,
        enquiryDate: currentDate,
        excutive: PayloadData.excutive,
        customer: PayloadData.customer,
        email: PayloadData.email,
        contact1: PayloadData.cont1,
        contact2: PayloadData.cont2,
        pickupLocation: PayloadData?.pickupLocation,
        dropLocation: PayloadData?.dropLocation,
        city: PayloadData.city,
        category: PayloadData.category,
        type: PayloadData.reference,
        service: PayloadData.service,
        distance: PayloadData.distance,
        dropFloor: PayloadData.dropFloor,
        pickupFloor: PayloadData.pickupFloor,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddEnquiry(false);
        window.location.assign("/enquiry");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    getcity();
    getservices();
  }, []);

  const [citydata, setcitydata] = useState([]);
  const getcity = async () => {
    let res = await axios.get(
      "https://api.vijayhomesuperadmin.in/api/master/getcity"
    );
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };

  const [serviceData, setserviceData] = useState([]);
  const getservices = async () => {
    let res = await axios.get(ApiUrl.BASEURL + "/service/getServiceNames");
    if ((res.status = 200)) {
      setserviceData(res.data);
    }
  };

  return (
    <Box m="20px">
      <EnquiryTab />
      <div>
        <div className="row m-auto">
          <Header
            subtitle={isEditMode ? "Edit the Enquiry" : "Create a New Enquiry"}
          />

          <div className="row m-auto border">
            <div className="col-md-10 m-auto p-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <Form.Label>Enquiry ID</Form.Label>
                  <Form.Control
                    value={EnquiryId}
                    type="text"
                    readOnly
                    name="enquiryId"
                  />
                </div>{" "}
                <div className="col-md-4 mb-3">
                  <Form.Label>Enquiry Date</Form.Label>
                  <Form.Control
                    value={currentDate?.toLocaleDateString()}
                    type="text"
                    name="enquiryDate"
                    readOnly
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Name <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.customer}
                    type="text"
                    name="customer"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Email Id <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.email}
                    type="text"
                    name="email"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Contact 1 <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.cont1}
                    type="text"
                    name="cont1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>Contact 2</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.cont2}
                    type="text"
                    name="cont2"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Pickup location <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.pickupLocation}
                    type="text"
                    name="pickupLocation"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    Drop location <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.dropLocation}
                    type="text"
                    name="dropLocation"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    City <span className="red">*</span>
                  </Form.Label>
                  {/* <Form.Control
                    onChange={handleChange}
                    value={PayloadData.city}
                    type="text"
                    name="city"
                  /> */}
                  <Form.Select
                    onChange={handleChange}
                    value={PayloadData.city}
                    type="text"
                    name="city"
                  >
                    <option>Select City</option>
                    {citydata?.map((ele) => (
                      <option value={ele.city}>{ele.city}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    {" "}
                    Reference <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.reference}
                    type="text"
                    name="reference"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    {" "}
                    Service <span className="red">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleChange}
                    value={PayloadData.service}
                    type="text"
                    name="service"
                  >
                    <option>Select Service</option>
                    {serviceData?.map((ele) => (
                      <option value={ele.servicename}>{ele.servicename}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>
                    {" "}
                    Distance <span className="red">*</span>
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.distance}
                    placeholder="10"
                    type="text"
                    name="distance"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label> PickupFloor</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.pickupFloor}
                    placeholder="10"
                    type="text"
                    name="pickupFloor"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label> Drop Floor</Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    value={PayloadData.dropFloor}
                    placeholder="10"
                    type="text"
                    name="dropFloor"
                  />
                </div>
              </div>{" "}
              <div className="row mt-3">
                <div className="col-md-5 m-auto">
                  <div className="row m-auto">
                    {!data ? (
                      <button
                        className="col-md-4 m-auto p-1 save me-2"
                        onClick={handleAddData}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="col-md-4 m-auto p-1 save me-2"
                        onClick={handleUpdateData}
                      >
                        update
                      </button>
                    )}{" "}
                    <button className="col-md-4 m-auto p-1 save ">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default EnquiryAdd;
