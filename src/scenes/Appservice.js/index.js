import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataService } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { SlotsData, planData } from "../../data/mockData";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import DataTable from "react-data-table-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  deleteData,
  getData,
  postFormData,
  putData,
  putFormData,
} from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";

const Services = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [image, setImage] = useState(null);
  const [AddService, setAddService] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [view, setView] = useState(0);
  const [excludes, setExcludes] = useState("");
  const [includes, setIncludes] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  let InitialData = {
    servicename: "",
    offerPrice: "",
    realPrice: "",
    subtitle: "",
    description: "",
    locationType: "",
  };
  const [PayloadData, setPayloadData] = useState(InitialData);

  const [SelectedSlot, setSelectedSlot] = useState([]);
  const [SlotsData, setSlotsData] = useState([]);
  const [ItemsData, setItemsData] = useState([]);
  const columns = [
    { field: "index", headerName: "SI No.", width: 100 },
    {
      field: "servicename",
      headerName: "Service name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    // {
    //   field: "realPrice",
    //   headerName: "Real Price",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    // {
    //   field: "offerPrice",
    //   headerName: "Offer Price",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    // {
    //   field: "locationType",
    //   headerName: "Location Type",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    {
      field: "Serviceimg",
      headerName: "Service Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={`${ApiUrl.IMAGEURL}/ServiceImage/${params.row.Serviceimg}`}
          alt="Serviceimg"
          style={{ width: 40, height: 40, borderRadius: "none" }}
        />
      ),
      headerAlign: "left",
      align: "left",
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

  const handleSlotChange = (id) => {
    setSelectedSlot((prevSelectedSlot) =>
      prevSelectedSlot.includes(id)
        ? prevSelectedSlot.filter((slotId) => slotId !== id)
        : [...prevSelectedSlot, id]
    );
  };

  const plancolumns = [
    {
      name: "Service name",
      selector: (row) => row.planName,
    },
    {
      name: "Real Price",
      selector: (row) => row.realPRice,
    },
    {
      name: "Offer Price",
      selector: (row) => row.offerPrice,
    },
    {
      name: "Plan Image",
      selector: (row) => <img src={row.planImage} />,
    },
  ];

  useEffect(() => {
    getService();
    getSlots();
  }, []);

  useEffect(() => {
    let data = ItemsData.length > 0 ? ItemsData : [];
    if (data) {
      const selectedSlotIds = data?.map((slot) => slot?._id);
      setSelectedSlot(selectedSlotIds);
    }
  }, [editRowId]);
  const getService = async () => {
    try {
      const response = await getData(ApiUrl.GETSERVICE);

      if (response.status === 200) {
        const rowsWithId = response.data.map((item, index) => ({
          ...item,
          id: item._id,
          index: index + 1,
          Serviceimg: item.Serviceimg,
        }));
        setRows(rowsWithId);

        setAddService(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const getSlots = async () => {
    try {
      const response = await getData(ApiUrl.GETSLOTS);

      if (response.status === 200) {
        setSlotsData(response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;

    setPayloadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImage = (e) => {
    let { name, value } = e.target;

    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    value = file;
  };

  const handleAddData = async () => {
    try {
      let filterData = SelectedSlot.map((slotId) => {
        let matchedSlot = SlotsData.find((ele) => ele._id === slotId);
        return {
          _id: matchedSlot._id,
          startTime: matchedSlot.startTime,
          startUnit: matchedSlot.startUnit,
          endTime: matchedSlot.endTime,
          endUnit: matchedSlot.endUnit,
        };
      });
      const formData = new FormData();
      formData.append("subtitle", PayloadData.subtitle);
      formData.append("includes", includes);
      formData.append("exludes", excludes);
      formData.append("desc", PayloadData.description);
      formData.append("servicename", PayloadData.servicename);
      formData.append("offerPrice", PayloadData.offerPrice);
      formData.append("realPrice", PayloadData.realPrice);
      formData.append("locationType", PayloadData.locationType);
      formData.append("Slot", JSON.stringify(filterData));
      formData.append("Serviceimg", image);

      const response = await postFormData(ApiUrl.ADDSERVICE, formData);

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddService(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      let filterData = SelectedSlot?.map((slotId) => {
        let matchedSlot = SlotsData?.find((ele) => ele._id === slotId);
        return {
          _id: matchedSlot?._id,
          startTime: matchedSlot.startTime,
          startUnit: matchedSlot.startUnit,
          endTime: matchedSlot.endTime,
          endUnit: matchedSlot.endUnit,
        };
      });
      const formData = new FormData();
      formData.append("subtitle", PayloadData.subtitle);
      formData.append("includes", includes);
      formData.append("exludes", excludes);
      formData.append("desc", PayloadData.description);
      formData.append("servicename", PayloadData.servicename);
      formData.append("offerPrice", PayloadData.offerPrice);
      formData.append("realPrice", PayloadData.realPrice);
      formData.append("locationType", PayloadData.locationType);
      formData.append("Serviceimg", image);
      formData.append("Slot", JSON.stringify(filterData));
      const response = await putFormData(
        ApiUrl.UPDATESERVICE + editRowId,
        formData
      );

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddService(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const handleUpdateSlots = async () => {
    try {
      let filterData = SelectedSlot.map((slotId) => {
        let matchedSlot = SlotsData.find((ele) => ele._id === slotId);
        return {
          _id: matchedSlot._id,
          startTime: matchedSlot.startTime,
        };
      });

      const response = await putData(
        `${ApiUrl.UPDATESERVICESLOTS}${editRowId}`,
        {
          Slot: filterData,
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        setSelectedSlot([]);
        setPayloadData(InitialData);
        getService();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await deleteData(ApiUrl.DELETESERVICE + id);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
        getService();
      }
    }
  };
  const handleView = (index) => {
    setView(index);
  };
  const handleEdit = (data) => {
    setAddService(true);
    setIsEditMode(true);
    setEditRowId(data._id);
    let image = `${ApiUrl.IMAGEURL}/ServiceImage/${data.Serviceimg}`;
    let finddata = rows.find((ele) => ele._id === data._id);
    setImage(finddata?.Serviceimg);
    setImagePreview(image);
    setPayloadData({
      servicename: finddata?.servicename,
      offerPrice: finddata?.offerPrice,
      realPrice: finddata?.realPrice,
      subtitle: finddata?.subtitle,
      description: finddata?.desc,
      locationType: finddata?.locationType,
    });
    setItemsData(finddata.Slot);
    setImage(finddata?.Serviceimg);
    setExcludes(finddata.exludes?.join(""));
    setIncludes(finddata.includes?.join(""));
  };

  const handleCskEditoChange = (setter) => (event, editor) => {
    const data = editor.getData();
    setter(data);
  };
  return (
    <Box m="20px">
      {!AddService ? (
        <>
          <Button onClick={() => setAddService(true)}>Add Service</Button>
          <Header title="Service" />
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
          <Button onClick={() => setAddService(false)}>View Service</Button>

          <div className="row m-auto">
            <Header
              subtitle={
                isEditMode ? "Edit the Service" : "Create a New Service"
              }
            />
            <div>
              <div className="row border">
                <div className="row p-2">
                  <span
                    className={`${
                      view === 0
                        ? "col-md-1 m-auto activelink"
                        : "col-md-1 m-auto"
                    }`}
                    onClick={() => handleView(0)}
                  >
                    General
                  </span>
                  <span
                    className={`${
                      view === 1
                        ? "col-md-1 m-auto activelink"
                        : "col-md-1 m-auto"
                    }`}
                    onClick={() => handleView(1)}
                  >
                    Slots
                  </span>
                  {/* <span
                    className={`${
                      view === 2
                        ? "col-md-1 m-auto activelink"
                        : "col-md-1 m-auto"
                    }`}
                    onClick={() => handleView(2)}
                  >
                    Plans
                  </span>{" "} */}
                  <span className="col-md-8"></span>
                </div>
                {view === 0 && (
                  <div className="col-md-10 m-auto p-4">
                    <div className="row">
                      <div className="col-md-6 mb-3 m-auto">
                        <Form.Control
                          onChange={handleChange}
                          name="servicename"
                          value={PayloadData.servicename}
                          placeholder="Service name"
                        />
                      </div>
                      <div className="col-md-6 mb-3 m-auto ">
                        <Form.Control
                          onChange={handleChange}
                          name="subtitle"
                          value={PayloadData.subtitle}
                          placeholder="Subtitle"
                        />
                      </div>
                      <div className="col-md-4 mb-3 m-auto">
                        <Form.Control
                          onChange={handleChange}
                          name="realPrice"
                          value={PayloadData.realPrice}
                          placeholder="Real Price"
                        />
                      </div>
                      <div className="col-md-4 mb-3 m-auto">
                        <Form.Control
                          onChange={handleChange}
                          name="offerPrice"
                          value={PayloadData.offerPrice}
                          placeholder="Offer Price"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <Form.Select
                          onChange={handleChange}
                          name="locationType"
                          value={PayloadData.locationType}
                        >
                          <option aria-readonly>Select Type</option>
                          <option value={"Within city"}>Within city</option>
                          <option value={"Between cities"}>
                            Between cities
                          </option>
                        </Form.Select>
                      </div>
                      <div className="row m-auto mb-3">
                        <Form.Control
                          onChange={handleChange}
                          name="description"
                          value={PayloadData.description}
                          as="textarea"
                          placeholder="Description"
                        />
                      </div>

                      <div className="col-md-6 m-auto mb-3">
                        {/* <Form.Control
                          onChange={handleChange}
                          name="includes"
                          value={PayloadData.includes}
                          as="textarea"
                          placeholder="Includes"
                        /> */}
                        <Form.Label>Includes</Form.Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={includes}
                          onChange={handleCskEditoChange(setIncludes)}
                        />
                      </div>

                      <div className="col-md-6 m-auto mb-3">
                        {/* <Form.Control
                          onChange={handleChange}
                          name="excludes"
                          value={PayloadData.excludes}
                          as="textarea"
                          placeholder="Excludes"
                        /> */}
                        <Form.Label>Excludes</Form.Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={excludes}
                          onChange={handleCskEditoChange(setExcludes)}
                        />
                      </div>

                      <div className="row m-auto cate-img text-center p-3">
                        <Form.Control
                          accept="image/*"
                          style={{ display: "none" }}
                          id="cateimage"
                          type="file"
                          className="row m-auto"
                          onChange={handleImage}
                        />
                        <label htmlFor="cateimage" className="row m-auto">
                          <IoCloudUploadOutline className="fs-2" />
                          <p> Upload Image</p>
                        </label>
                        {imagePreview && (
                          <div className="mt-3">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{ width: "100px", height: "100px" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="row mt-4 text-center">
                        <Button
                          onClick={() => setAddService(false)}
                          className="col-md-3 me-auto"
                          variant="contained"
                        >
                          Cancel
                        </Button>
                        {isEditMode ? (
                          <Button
                            type="submit"
                            color="secondary"
                            className="col-md-3"
                            variant="contained"
                            onClick={handleUpdateData}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            color="secondary"
                            className="col-md-3"
                            variant="contained"
                            onClick={handleAddData}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    </div>{" "}
                  </div>
                )}

                {view === 1 && (
                  <>
                    <div className="row p-4">
                      <Header subtitle="Slots" />
                      <div className="row">
                        {SlotsData.map((slot) => (
                          <div key={slot._id} className="col-md-2 ">
                            <button
                              onClick={() => handleSlotChange(slot._id)}
                              className={`checkbox-input col-md-12 mt-4 p-2 ${
                                SelectedSlot.includes(slot._id)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          </div>
                        ))}
                      </div>
                      {isEditMode && (
                        <Button
                          type="submit"
                          color="secondary"
                          className="col-md-3 mt-5 p-2"
                          variant="contained"
                          onClick={handleUpdateSlots}
                        >
                          update
                        </Button>
                      )}
                    </div>

                    {/* <DataTable
                      data={SlotsData}
                      columns={SlotsColumns}
                      selectableRows
                      pagination
                    /> */}
                  </>
                )}

                {view === 2 && (
                  <>
                    <div className="col-md-6  p-4">
                      <div className="row">
                        <Header
                          subtitle={
                            isEditMode ? "Edit the Plan" : "Add a New Plan"
                          }
                        />
                        <div className="row m-auto mb-3">
                          <Form.Control type="text" placeholder="Service" />
                        </div>
                        <div className="row m-auto mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Original Price"
                          />
                        </div>
                        <div className="row m-auto mb-3">
                          <Form.Control type="text" placeholder="Offer Price" />
                        </div>
                        <div className="row m-auto mb-3">
                          <Form.Control
                            as="textarea"
                            placeholder="Description"
                          />
                        </div>
                        <div className="row m-auto mb-3">
                          <Form.Control type="file" />
                        </div>

                        <div className="row mt-4 text-center">
                          <Button
                            onClick={() => setAddService(false)}
                            className="col-md-3 me-auto"
                            variant="contained"
                          >
                            Cancel
                          </Button>
                          {isEditMode ? (
                            <Button
                              type="submit"
                              color="secondary"
                              className="col-md-3"
                              variant="contained"
                            >
                              Update
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              color="secondary"
                              className="col-md-3"
                              variant="contained"
                            >
                              Save
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <DataTable
                      data={planData}
                      columns={plancolumns}
                      pagination
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Services;
