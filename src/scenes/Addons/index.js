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
import { deleteData, getData, postData, putData } from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";

const Addons = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [AddBanner, setAddBanner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [Category, setCategory] = useState([]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [offerprice, setofferPrice] = useState("");
  const [price, setprice] = useState("");
  const [imgUrl, setimgUrl] = useState(null);
  console.log(rows, "rows");
  useEffect(() => {
    getCategory();
    getBanner();
  }, []);

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
  const getBanner = async () => {
    try {
      const response = await getData(ApiUrl.GETADDONS);

      if (response.status === 200) {
        const rowsWithId = response.data.map((Banner, index) => ({
          ...Banner,
          id: Banner._id,
          index: index + 1,
        }));
        setRows(rowsWithId);

        setAddBanner(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const columns = [
    { field: "index", headerName: "SI No.", width: 100 },
    {
      field: "imgUrl",
      headerName: "Image",
      flex: 1,
      renderCell: ({ row }) => (
        <div>
          <img src={row.imgUrl} width={100} height={100} />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "desc",
      headerName: "desc",
      flex: 1,
    },
    {
      field: "offerPrice",
      headerName: "Offer Price",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
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

  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.CREATEADDONS, {
        name: name,
        price: price,
        desc: desc,
        offerPrice: offerprice,
        imgUrl: imgUrl,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setName("");
        setDesc("");
        setofferPrice("");
        setprice("");
        setimgUrl("");
        setAddBanner(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATEADDONS + editRowId, {
        name: name,
        price: price,
        desc: desc,
        offerPrice: offerprice,
        imgUrl: imgUrl,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setName("");
        setDesc("");
        setofferPrice("");
        setprice("");
        setAddBanner(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await deleteData(ApiUrl.DELETEADDONS + id);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
        getCategory();
      }
    }
  };

  const handleEdit = (data) => {
    setAddBanner(true);
    setIsEditMode(true);
    setEditRowId(data._id);
    setName(data.name);
    setDesc(data.desc);
    setofferPrice(data.offerprice);
    setprice(data.price);
  };

  return (
    <Box m="20px">
      {!AddBanner ? (
        <>
          <Button onClick={() => setAddBanner(true)}>AddOns</Button>
          <Header title="AddOns" />
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
          <Button onClick={() => setAddBanner(false)}>View AddOns</Button>

          <div className="row m-auto">
            <Header
              subtitle={isEditMode ? "Edit the AddOns" : "Create a New AddOns"}
            />
            <div>
              <div className="row border">
                <div className="col-md-10 m-auto p-4">
                  <div className="row">
                    {/* <div className="col-md-6 mb-3 m-auto">
                      <Form.Select
                        className="mb-3"
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
                    </div> */}

                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Name"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setofferPrice(e.target.value)}
                        value={offerprice}
                        type="number"
                        placeholder="offerprice"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setprice(e.target.value)}
                        value={price}
                        type="number"
                        placeholder="Price"
                      />
                    </div>
                    <div className="col-md-6 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setimgUrl(e.target.value)}
                        value={imgUrl}
                        placeholder="imgUrl"
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

export default Addons;
