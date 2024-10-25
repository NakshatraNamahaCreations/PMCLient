import { Box, Typography, useTheme, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { postData, getData, putData, deleteData } from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [image, setImage] = useState(null);
  const [addCategory, setAddCategory] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [Category, setCategory] = useState("");

  const columns = [
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "accessLevel",
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
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getCategory();
  }, []);

  const handleAddcategory = async () => {
    try {
      const response = await postData(ApiUrl.ADDCATEGORY, {
        category: Category,
      });

      if (response.status === 200) {
        alert(response.data.message);
        // setAddCategory(false);
        window.location.reload("");
        setCategory("");
        getCategory();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdatecategory = async () => {
    try {
      const response = await putData(ApiUrl.UPDATECATEGORY + editRowId, {
        category: Category,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setCategory("");
        setAddCategory(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const getCategory = async () => {
    try {
      const response = await getData(ApiUrl.GETCATEGORY);

      if (response.status === 200) {
        // Map rows to include an `id` property
        const rowsWithId = response.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setRows(rowsWithId);
        setAddCategory(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const response = await deleteData(ApiUrl.DELETECATEGORY + id);
      if (response.status === 200) {
        alert(response.data.message);
        getCategory();
      }
    }
  };

  
  const handleEdit = (data) => {
    setAddCategory(true);
    setIsEditMode(true);
    setEditRowId(data.id);
    setImage(data.cateimage);
    setCategory(data.category);
  };

  return (
    <div className="row m-auto">
      {!addCategory ? (
        <div className="row m-auto">
          <div className="row m-auto">
            <Button className="col-md-2" onClick={() => setAddCategory(true)}>
              Add Category
            </Button>
          </div>
          <Header title="Category" subtitle="Managing the category" />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
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
              getRowId={(row) => row.id}
              components={{
                ColumnMenu: CustomColumnMenu,
              }}
            />
          </Box>
        </div>
      ) : (
        <div className="row m-auto">
          <div className="row m-auto">
            <Button className="col-md-2" onClick={() => setAddCategory(false)}>
              View Category
            </Button>
          </div>
          <Header
            subtitle={
              isEditMode ? "Edit the category" : "Create a New category"
            }
          />
          <div>
            <div className="row">
              <div className="col-md-8 m-auto p-4">
                <div className="row m-auto">
                  <Form.Control
                    className="row m-auto mb-3"
                    placeholder="Category"
                    value={Category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                {isEditMode ? (
                  <Button
                    type="submit"
                    color="secondary"
                    className="row"
                    variant="contained"
                    onClick={handleUpdatecategory}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="secondary"
                    className="row"
                    variant="contained"
                    onClick={handleAddcategory}
                  >
                    Save
                  </Button>
                )}
                <div className="mt-4 text-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
