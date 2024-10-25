import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataService } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { SlotsData } from "../../data/mockData";
import { Form } from "react-bootstrap";
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

const Items = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const [AddItem, setAddItem] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [view, setView] = useState(0);
  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [FilteredSubcate, setFilteredSubcate] = useState([]);
  const [image, setImage] = useState(null);

  let InitialData = {
    category: "",
    subcategory: "",
    itemname: "",
    offerPrice: "",
    realPrice: "",
    volume: "",
    weight: "",
    packingPrice: "",
  };
  const [PayloadData, setPayloadData] = useState(InitialData);

  useEffect(() => {
    getCategory();
    getsubCategory();
    getItems();
  }, []);
  useEffect(() => {
    let cate = PayloadData.category.toLowerCase();
    let data = SubCategory?.filter(
      (ele) => ele.category?.toLowerCase() == cate
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
  const getItems = async () => {
    try {
      const response = await getData(ApiUrl.GETITEMS);

      if (response.status === 200) {
        const rowsWithId = response.data.map((item, index) => ({
          ...item,
          id: item._id,
          index: index + 1,
        }));
        setRows(rowsWithId);
        console.log(response.data, "response.data");
        setAddItem(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
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
      field: "category",
      headerName: "Category",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "itemname",
      headerName: "Item name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "volume",
      headerName: "Volume",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "weight",
      headerName: "Weight",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "offerPrice",
      headerName: " Price",
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

  //  volume: "",
  //   weight: ""
  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDITEMS, {
        category: PayloadData.category,
        subcategory: PayloadData.subcategory,
        itemname: PayloadData.itemname,
        offerPrice: PayloadData.offerPrice,
        realPrice: PayloadData.realPrice,
        weight: PayloadData.weight,
        volume: PayloadData.volume,
        packingPrice: PayloadData.packingPrice,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddItem(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATEITEMS + editRowId, {
        category: PayloadData.category,
        subcategory: PayloadData.subcategory,
        itemname: PayloadData.itemname,
        offerPrice: PayloadData.offerPrice,
        realPrice: PayloadData.realPrice,
        weight: PayloadData.weight,
        volume: PayloadData.volume,
        packingPrice: PayloadData.packingPrice,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddItem(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await deleteData(ApiUrl.DELETEITEMS + id);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
        getCategory();
      }
    }
  };

  const handleEdit = (data) => {
    setAddItem(true);
    setIsEditMode(true);
    setEditRowId(data._id);
    setImage(data.subcateimg);
    setPayloadData({
      category: data.category,
      subcategory: data.subcategory,
      subcateimg: data.subcateimage,
      itemname: data.itemname,
      offerPrice: data.offerPrice,
      realPrice: data.realPrice,
      weight: PayloadData.weight,
      volume: PayloadData.volume,
      packingPrice: PayloadData.packingPrice,
    });
  };
  return (
    <Box m="20px">
      {!AddItem ? (
        <>
          <Button onClick={() => setAddItem(true)}>Add Item</Button>
          <Header title="Items" />
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
          <Button onClick={() => setAddItem(false)}>View Item</Button>

          <div className="row m-auto">
            <Header
              subtitle={isEditMode ? "Edit the Item" : "Create a New Item"}
            />
            <div>
              <div className="row border">
                <div className="col-md-10 m-auto p-4">
                  <div className="row">
                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        onChange={handleChange}
                        value={PayloadData.category}
                        name="category"
                      >
                        <option aria-readonly>Select Category</option>
                        {Category.map((ele) => (
                          <option key={ele.category} value={ele.category}>
                            {ele.category}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Subcategory</Form.Label>
                      <Form.Select
                        onChange={handleChange}
                        value={PayloadData.subcategory}
                        name="subcategory"
                      >
                        <option aria-readonly>Select Subcategory</option>
                        {FilteredSubcate.map((ele) => (
                          <option key={ele.subcategory} value={ele.subcategory}>
                            {ele.subcategory}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Item name</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.itemname}
                        placeholder="Item name"
                        name="itemname"
                      />
                    </div>

                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Item volume</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.volume}
                        placeholder="Item volume"
                        name="volume"
                        type="number"
                      />
                    </div>

                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Item weight</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.weight}
                        placeholder="Item weight"
                        name="weight"
                        type="number"
                      />
                    </div>

                    <div className="col-md-4 mb-3 m-auto">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.offerPrice}
                        type="number"
                        name="offerPrice"
                        placeholder=" Price"
                      />
                    </div>
                    <div className="col-md-6 m-auto mb-3">
                      <Form.Label>Packing price</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.packingPrice}
                        placeholder="Packing Price"
                        name="packingPrice"
                        type="number"
                      />
                    </div>

                    {/* <div className="row m-auto cate-img text-center p-3">
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
                    </div> */}
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

export default Items;
