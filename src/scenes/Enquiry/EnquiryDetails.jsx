import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import EnquiryTab from "./EnquiryTab";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiUrl } from "../../ApiRUL";
import { deleteData, getData, postData } from "../../methods";
import axios from "axios";

const EnquiryDetails = () => {
  const location = useLocation();
  const ViewData = location.state || null;

  let InitialData = {
    desc: "",
    amount: "",
    response: "",
    servicedate: moment().format("DD/MM/YYYY"),
  };
  const [PayloadData, setPayloadData] = useState(InitialData);
  const [Fallowup, setFallowup] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log("PayloadData", PayloadData);
  const handleChange = (e) => {
    let { name, value } = e.target;
    setPayloadData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getFallowup();
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDFALLOWUP, {
        enquiryId: ViewData?.enquiryId,
        enquiryDate: currentDate,
        desc: PayloadData.desc,
        amount: PayloadData.amount,
        response: PayloadData.response,
        servicedate: PayloadData.servicedate,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const getFallowup = async () => {
    try {
      const response = await axios.get(
        ApiUrl.BASEURL + "/fallowup/findwithenquiryId/" + ViewData?.enquiryId
      );

      if (response.status === 200) {
        // let filterData = response.data.filter(
        //   (ele) => ele.enquiryId === ViewData._id
        // );
        setFallowup(response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const navigate = useNavigate();
  const handleCreatequote = (date) => {
    navigate(`/quotedetails/${ViewData._id}`, {
      state: { Edata: ViewData, type: "enquiry", servicedate: date },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fallowup item?")) {
      const response = await deleteData(ApiUrl.DELETEFALLOWUP + id);
      if (response.status === 200) {
        alert(response.data.message);
        getFallowup();
      }
    }
  };

  const handleEdit = (id) => {
    navigate("/enquiryadd", { state: id });
  };
  return (
    <Box m="20px">
      <EnquiryTab />
      <div className="row">
        <div className="col-md-5">
          <Header subtitle="ENQUIRY DETAILS" />

          <div className="row">
            <table className="col-md-11">
              <thead className="text-center">
                <th className="p-2 main_h" colSpan={2}>
                  Enquiry Details |{" "}
                  <a onClick={() => handleEdit(ViewData.enquiryId)}>Modify</a>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Enquiry ID</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.enquiryId || 0} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Category</strong>
                  </td>{" "}
                  <td className="p-2">Movers </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Customer</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.customer} </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Contact1</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.contact1} </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Contact2</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.contact2} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Email</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.email} </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>City</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.city} </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Pickup Location</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.pickupLocation} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Drop Location</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.dropLocation} </td>
                </tr>

                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Pickup Floor</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.pickupFloor} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Drop Floor</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.dropFloor} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Executive </strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.excutive} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Enquiry Date</strong>
                  </td>{" "}
                  <td className="p-2">
                    {" "}
                    {moment(ViewData?.enquiryDate).format("DD MMM YY")}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Service </strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.service} </td>
                </tr>
                <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Reference</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.type} </td>
                </tr>
                {/* <tr>
                  <td className="p-2">
                    {" "}
                    <strong>Status</strong>
                  </td>{" "}
                  <td className="p-2"> {ViewData?.Status} </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-7">
          {/* <div className="row">
            <div className="col-md-8">
              <Header subtitle="Follow-Up Detail" />
            </div>
            {Fallowup?.length > 0 && Fallowup[0]?.response === "Quote" && (
              <div className="col-md-4">
                <button
                  className="btn-primary-button mx-2"
                  onClick={handleCreatequote}
                >
                  Create Quote
                </button>
              </div>
            )}
          </div> */}
          <Card className="row p-2">
            <div className="row">
              {/* <div className="col-md-4 m-auto">
                <Form.Label>Staff name</Form.Label>
                <Form.Control
                  value={ViewData.excutive}
                  placeholder="Excutive name"
                  className="row m-auto mb-3"
                />
              </div>{" "} */}
              <div className="col-md-4 ">
                <Form.Label>Foll date</Form.Label>
                <Form.Control
                  value={currentDate?.toLocaleDateString()}
                  className="row m-auto mb-3"
                />
              </div>
              <div className="col-md-4 ">
                <Form.Label>Response</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  value={PayloadData.response}
                  name="response"
                  className="row m-auto mb-3"
                >
                  <option>Select Response</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Quote">Quote</option>
                </Form.Select>
              </div>
              <div className="col-md-4 ">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  value={PayloadData.desc}
                  name="desc"
                  className="row m-auto mb-3"
                />
              </div>
              {PayloadData.response === "Quote" && (
                <div className="col-md-4 ">
                  <Form.Label>Service Date</Form.Label>
                  <Form.Control
                    type="date" // Use type "date" for date selection
                    onChange={handleChange}
                    name="servicedate" // Update name to match state property
                    value={PayloadData.servicedate}
                    className="row m-auto mb-3"
                  />
                </div>
              )}
            </div>
            <div className="row m-auto">
              <button className="save p-2 col-md-2" onClick={handleAddData}>
                Save
              </button>
            </div>
          </Card>
          <div className="row mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th className="th_t p-2 text-center">SI No.</th>
                  <th className="th_t p-2 text-center">Date</th>
                  <th className="th_t p-2 text-center">Response</th>
                  <th className="th_t p-2 text-center">Description</th>
                  <th className="th_t p-2 text-center">Service Date</th>
                  <th className="th_t p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {Fallowup?.map((ele, index) => {
                  const formattedDate = moment(ele.enquiryDate).format(
                    "ddd, MMM D, YYYY h:mm A"
                  );
                  return (
                    <tr
                      key={index} // Add a key prop for better performance
                      style={{
                        background:
                          ele?.response === "Not Interested"
                            ? "#f44336b5"
                            : "orange",
                      }}
                    >
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{formattedDate}</td>
                      <td className="p-2">{ele.response}</td>
                      <td className="p-2">{ele.desc}</td>
                      <td className="p-2">{ele.servicedate}</td>
                      <td className="p-2 cursor">
                        <button
                          className="btn-primary-button mx-2"
                          onClick={() => handleCreatequote(ele.servicedate)} // Use arrow function to prevent immediate execution
                        >
                          Create Quote
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default EnquiryDetails;
