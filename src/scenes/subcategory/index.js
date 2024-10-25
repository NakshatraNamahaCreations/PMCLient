import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { deleteData, getData, postFormData, putFormData } from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";

const SubCategory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [addsubCategory, setAddsubCategory] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [Category, setCategory] = useState([]);
  const [editRowId, setEditRowId] = useState(null);

  let InitialData = {
    category: "",
    subcategory: "",
  };
  const [subcateFormData, setsubcateFormData] = useState(InitialData);
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
      field: "subcateimg",
      headerName: "Subcategory Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={`${ApiUrl.IMAGEURL}/SubcateImage/${params.row.subcateimg}`}
          alt="subcateimage"
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
        <div>
          <div style={{ color: colors.grey[100], marginLeft: "5px" }}>
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
        </div>
      ),
    },
  ];

  const getsubCategory = async () => {
    try {
      const response = await getData(ApiUrl.GETSUBCATE);

      if (response.status === 200) {
        const rowsWithId = response.data.map((item, index) => ({
          ...item,
          id: item._id,
          index: index + 1,
          subcateimg: item.subcateimg,
        }));
        setRows(rowsWithId);
        setAddsubCategory(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    setsubcateFormData((prev) => ({
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

  const handleEdit = (data) => {
    setAddsubCategory(true);
    setIsEditMode(true);
    setEditRowId(data._id);
    let image = `${ApiUrl.IMAGEURL}/SubcateImage/${data.subcateimg}`;
    setImage(data.subcateimg);
    setImagePreview(image);
    setsubcateFormData({
      category: data.category,
      subcategory: data.subcategory,
      subcateimg: data.subcateimage,
    });
  };

  useEffect(() => {
    getCategory();
    getsubCategory();
  }, []);

  const handleAddData = async () => {
    try {
      const formData = new FormData();
      formData.append("category", subcateFormData.category);
      formData.append("subcategory", subcateFormData.subcategory);
      formData.append("subcateimg", image);

      const response = await postFormData(ApiUrl.ADDSUBCATE, formData);

      if (response.status === 200) {
        alert(response.data.message);
        setsubcateFormData(InitialData);
        setAddsubCategory(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const formData = new FormData();
      formData.append("category", subcateFormData.category);
      formData.append("subcategory", subcateFormData.subcategory);
      formData.append("subcateimg", image);

      const response = await putFormData(
        ApiUrl.UPDATESUBCATE + editRowId,
        formData
      );

      if (response.status === 200) {
        alert(response.data.message);
        setsubcateFormData(InitialData);
        setAddsubCategory(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      const response = await deleteData(ApiUrl.DELETESUBCATE + id);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
        getCategory();
      }
    }
  };

  return (
    <Box m="20px">
      {!addsubCategory ? (
        <>
          <Button onClick={() => setAddsubCategory(true)}>
            Add Subcategory
          </Button>
          <Header title="Subcategory" />
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
        <div m="20px">
          <Button onClick={() => setAddsubCategory(false)}>
            View Subcategory
          </Button>
          <div className="row m-auto">
            <Header
              subtitle={
                isEditMode ? "Edit the Subcategory" : "Create a New Subcategory"
              }
            />
            <div>
              <div className="row">
                <div className="col-md-8 m-auto p-4">
                  <Form.Select
                    className="mb-3"
                    onChange={handleChange}
                    value={subcateFormData.category}
                    name="category"
                  >
                    <option aria-readonly>Select Category</option>
                    {Category.map((ele) => (
                      <option key={ele.category} value={ele.category}>
                        {ele.category}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="row m-auto">
                    <Form.Control
                      onChange={handleChange}
                      value={subcateFormData.subcategory}
                      name="subcategory"
                      className="row m-auto mb-3"
                      placeholder="Subcategory"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default SubCategory;
