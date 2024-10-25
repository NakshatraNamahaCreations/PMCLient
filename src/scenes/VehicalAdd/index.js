import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataService } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { SlotsData } from "../../data/mockData";

import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import {
  deleteData,
  getData,
  postData,
  postFormData,
  putData,
  putFormData,
} from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";
import axios from "axios";
import { Form, Row, Col } from "react-bootstrap";

const VehicalAdd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const [AddVehical, setAddVehical] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [view, setView] = useState(0);
  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [FilteredSubcate, setFilteredSubcate] = useState([]);
  const [image, setImage] = useState(null);

  let InitialData = {
    vehicalName: "",
    volumeCapacity: "",
    weightCapacity: "",
    basePrice: "",
    baseDistance: "",
    distanceRate: "",
    packingPrice: "",
    cities: [],
  };
  const [PayloadData, setPayloadData] = useState(InitialData);

  console.log("PayloadData---", PayloadData);

  useEffect(() => {
    getCategory();
    getsubCategory();
    getVehicals();
    getcity();
  }, []);
  useEffect(() => {
    let cate = PayloadData.vehicalName?.toLowerCase();
    let data = SubCategory?.filter(
      (ele) => ele.vehicalName?.toLowerCase() == cate
    );
    setFilteredSubcate(data);
  }, [PayloadData]);

  const getCategory = async () => {
    try {
      const response = await getData(ApiUrl.GETCATEGORY);

      if (response.status === 200) {
        setCategory(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const getVehicals = async () => {
    try {
      const response = await getData(ApiUrl.GETVEHICAL);

      if (response.status === 200) {
        const rowsWithId = response.data.map((Vehical, index) => ({
          ...Vehical,
          id: Vehical._id,
          index: index + 1,
        }));
        setRows(rowsWithId);
        console.log(response.data, "response.data");
        setAddVehical(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const [citydata, setcitydata] = useState([]);
  const getcity = async () => {
    let res = await axios.get(
      "https://api.vijayhomesuperadmin.in/api/master/getcity"
    );
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };

  const getsubCategory = async () => {
    try {
      const response = await getData(ApiUrl.GETSUBCATE);

      if (response.status === 200) {
        setSubCategory(response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const columns = [
    { field: "index", headerName: "SI No.", width: 100 },
    {
      field: "vehicalName",
      headerName: "Vehical Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "volumeCapacity",
      headerName: "Volume Capacity (in cubic feet)",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "weightCapacity",
      headerName: "Weight Capacity (in kg)",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "basePrice",
      headerName: "Base Price ",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "baseDistance",
      headerName: "Base Distance ( km included in base fare)",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "distanceRate",
      headerName: "Distance Rate ( per km beyond base distance)",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "packingPrice",
      headerName: "Packing Price",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <div color={colors.grey[100]} sx={{ ml: "5px" }}>
          <CiEdit
            className="cursor edit me-2 fs-6"
            onClick={() => handleEdit(row)}
          />
          |{" "}
          <MdDeleteForever
            className="cursor delete fs-6"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
    let { name, value } = e.target;

    setPayloadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDVEHICAL, {
        vehicalName: PayloadData.vehicalName,
        volumeCapacity: PayloadData.volumeCapacity,
        weightCapacity: PayloadData.weightCapacity,
        basePrice: PayloadData.basePrice,
        baseDistance: PayloadData.baseDistance,
        distanceRate: PayloadData.distanceRate,
        packingPrice: PayloadData.packingPrice,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddVehical(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATVEHICAL + editRowId, {
        vehicalName: PayloadData.vehicalName,
        volumeCapacity: PayloadData.volumeCapacity,
        weightCapacity: PayloadData.weightCapacity,
        basePrice: PayloadData.basePrice,
        baseDistance: PayloadData.baseDistance,
        distanceRate: PayloadData.distanceRate,
        packingPrice: PayloadData.packingPrice,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddVehical(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await deleteData(ApiUrl.DELETEVEHICAL + id);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
        getCategory();
      }
    }
  };

  const handleEdit = (data) => {
    setAddVehical(true);
    setIsEditMode(true);
    setEditRowId(data._id);

    setPayloadData({
      vehicalName: data.vehicalName,
      volumeCapacity: data.volumeCapacity,
      weightCapacity: data.weightCapacity,
      basePrice: data.basePrice,
      baseDistance: data.baseDistance,
      distanceRate: data.distanceRate,
      packingPrice: data.packingPrice,
      cities: data.cities,
    });
  };

  ///manage ciies data
  const [arrayData, setArrayData] = useState([
    { id: Date.now(), city: "", price: "" },
  ]);

  const generateUniqueId = () =>
    Date.now() + Math.random().toString(36).substr(2, 9);

  const handleAddMore = () => {
    setArrayData([
      ...arrayData,
      { id: generateUniqueId(), city: "", price: "" },
    ]);
  };

  const handleCityChange = (index, event) => {
    const updatedArray = [...arrayData];
    updatedArray[index].city = event.target.value;
    setArrayData(updatedArray);
  };

  const handlePriceChange = (index, event) => {
    const updatedArray = [...arrayData];
    updatedArray[index].price = event.target.value;
    setArrayData(updatedArray);
  };

  const handleUpdateCityPrice = async (index) => {
    const { city, price } = arrayData[index];
    if (city && price) {
      try {
        const config = {
          url: `/updateCityPrice/${editRowId}`,
          method: "post",
          baseURL: ApiUrl.BASEURL,
          headers: { "content-type": "application/json" },
          data: { cityName: city, newPrice: price },
        };
        const response = await axios(config);
        if (response.status === 200) {
          alert("City price updated successfully");
          window.location.reload();
          setIsEditMode(true);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to update city price");
      }
    } else {
      alert("Please provide both city and price");
    }
  };

  const handleDeleteCity = async (cityName) => {
    try {
      const config = {
        url: `/deleteCity/${editRowId}`,
        method: "post",
        baseURL: ApiUrl.BASEURL,
        headers: { "content-type": "application/json" },
        data: { cityName },
      };
      const response = await axios(config);
      if (response.status === 200) {
        alert("City deleted successfully");
        window.location.reload();
        setIsEditMode(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete city");
    }
  };

  const updateCitywisePrice = async (e) => {
    e.preventDefault();
    try {
      const config = {
        url: `/updateCitiesWisePrice/${editRowId}`,
        method: "post",
        baseURL: ApiUrl.BASEURL,
        headers: { "content-type": "application/json" },
        data: { cities: arrayData },
      };
      const response = await axios(config);
      if (response.status === 200) {
        alert("Successfully Added");
        window.location.reload();
        setIsEditMode(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add cities");
    }
  };

  return (
    <Box m="20px">
      {!AddVehical ? (
        <>
          <Button onClick={() => setAddVehical(true)}>Add Vehical</Button>
          <Header title="Vehicals" />
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
              checkboxSelection
              rows={rows}
              columns={columns}
              components={{
                ColumnMenu: CustomColumnMenu,
              }}
            />
          </Box>
        </>
      ) : (
        <div>
          <Button onClick={() => setAddVehical(false)}>View Vehical</Button>

          <div className="row m-auto">
            <Header
              subtitle={
                isEditMode ? "Edit the Vehical" : "Create a New Vehical"
              }
            />
            <div>
              <div className="row border">
                <div className="col-md-10 m-auto p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Vehical Name</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.vehicalName}
                        placeholder="Vehical name"
                        name="vehicalName"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Volume Capacity</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        value={PayloadData.volumeCapacity}
                        placeholder="Volume Capacity"
                        name="volumeCapacity"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Weight capacity</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.weightCapacity}
                        placeholder="Weight capacity"
                        name="weightCapacity"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Base price</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.basePrice}
                        placeholder="Base price"
                        name="basePrice"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Base distance</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.baseDistance}
                        placeholder="Base distance"
                        name="baseDistance"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Label>Distance rate</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.distanceRate}
                        placeholder="Distance rate"
                        name="distanceRate"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6 mb-3 ">
                      <Form.Label>Packing price</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.packingPrice}
                        placeholder="Packing price"
                        name="packingPrice"
                        type="number"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      {isEditMode ? (
                        <Button
                          type="submit"
                          color="secondary"
                          className="row"
                          variant="contained"
                          onClick={handleUpdateData}
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          color="secondary"
                          className="row"
                          variant="contained"
                          onClick={handleAddData}
                        >
                          Save
                        </Button>
                      )}
                    </div>

                    <div>
                      <h3>Manage City Prices</h3>
                      <form onSubmit={updateCitywisePrice}>
                        <div>
                          {PayloadData?.cities.map((item, index) => (
                            <Row
                              key={index}
                              className="mb-3 align-items-center"
                            >
                              <Col xs={12} md={3}>
                                <Form.Group controlId={`citySelect-${index}`}>
                                  <Form.Control
                                    as="select"
                                    value={item.city}
                                    onChange={(e) => handleCityChange(index, e)}
                                  >
                                    <option value="">Select City</option>
                                    {citydata.map((city, i) => (
                                      <option key={i} value={city.city}>
                                        {city.city}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={3}>
                                <Form.Group controlId={`priceInput-${index}`}>
                                  <Form.Control
                                    type="number"
                                    value={item.price || ""}
                                    onChange={(e) =>
                                      handlePriceChange(index, e)
                                    }
                                    placeholder="Enter price"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={1}>
                                {/* <Button
                                  variant="warning"
                                  onClick={() => handleUpdateCityPrice(index)}
                                >
                                  Update
                                </Button> */}
                              </Col>
                              <Col xs={12} md={1}>
                                <Button
                                  variant="danger"
                                  onClick={() => handleDeleteCity(item.city)}
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          ))}
                        </div>
                        <div>
                          {arrayData.map((item, index) => (
                            <Row
                              key={index}
                              className="mb-3 align-items-center"
                            >
                              <Col xs={12} md={3}>
                                <Form.Group controlId={`citySelect-${index}`}>
                                  <Form.Label>Select City</Form.Label>
                                  <Form.Control
                                    as="select"
                                    value={item.city}
                                    onChange={(e) => handleCityChange(index, e)}
                                  >
                                    <option value="">Select City</option>
                                    {citydata.map((city, i) => (
                                      <option key={i} value={city.city}>
                                        {city.city}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={3}>
                                <Form.Group controlId={`priceInput-${index}`}>
                                  <Form.Label>Price</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={item.price || ""}
                                    onChange={(e) =>
                                      handlePriceChange(index, e)
                                    }
                                    placeholder="Enter price"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          ))}
                          <p
                            onClick={handleAddMore}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            Add more
                          </p>
                        </div>
                        <Button
                          type="submit"
                          color="secondary"
                          className="row"
                          variant="contained"
                        >
                          Update Cities Price
                        </Button>
                      </form>
                    </div>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default VehicalAdd;
