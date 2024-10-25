import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataService } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { deleteData, getData, postData, putData } from "../../methods";
import { ApiUrl } from "../../ApiRUL";
import CustomColumnMenu from "../customgrid";

const Banner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [AddBanner, setAddBanner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [Category, setCategory] = useState([]);

  const [videoLink, setvideoLink] = useState("");
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
      const response = await getData(ApiUrl.GETVIDEOBANNER);

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
  console.log(rows);
  const columns = [
    { field: "index", headerName: "SI No.", width: 100 },
    {
      field: "videoLink",
      headerName: "Video",
      flex: 1,
      width: 100,
      height: 100,
      renderCell: (params) => (
        <>
          {console.log(params.row.videoLink, "params.row.videoLink")}
          {params.row.videoLink && (
            <ReactHlsPlayer
              src={params.row.videoLink}
              autoPlay={false}
              controls={true}
              width="200px"
              height="100px"
            />
          )}
        </>
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

  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDVIDEOBANNER, {
        videoLink: videoLink,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setvideoLink("");
        setAddBanner(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATVIDEBANNER + editRowId, {
        videoLink: videoLink,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setvideoLink("");
        setAddBanner(false);
        window.location.reload("");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const response = await deleteData(ApiUrl.DELETEVIDEOBANNER + id);
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
    setvideoLink(data.videoLink);
  };
  return (
    <Box m="20px">
      {!AddBanner ? (
        <>
          <Button onClick={() => setAddBanner(true)}>Add Video</Button>
          <Header title="Banner video" />
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
          <Button onClick={() => setAddBanner(false)}>View Videos</Button>

          <div className="row m-auto">
            <Header
              subtitle={isEditMode ? "Edit the Banner" : "Create a New video"}
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

                    <div className="col-md-12 mb-3 m-auto">
                      <Form.Control
                        onChange={(e) => setvideoLink(e.target.value)}
                        value={videoLink}
                        placeholder="Video link here!"
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

export default Banner;
