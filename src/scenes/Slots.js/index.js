import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { ApiUrl } from "../../ApiRUL";
import { deleteData, getData, postData, putData } from "../../methods";
import CustomColumnMenu from "../customgrid";

const Slots = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [AddSlots, setAddSlots] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);

  let InitialData = {
    startTime: "",
    endTime: "",
    startUnit: "",
    endUnit: "",
  };
  const [PayloadData, setPayloadData] = useState(InitialData);

  const columns = [
    { field: "index", headerName: "SI No.", width: 100 },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => <div>{params.row.startTime}</div>,
    },
    // {
    //   field: "endTime",
    //   headerName: "End Time",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    //   renderCell: (params) => (
    //     <div>
    //       {params.row.endTime} {params.row.endUnit}
    //     </div>
    //   ),
    // },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
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
  useEffect(() => {
    getSlots();
  }, []);

  const handleAddData = async () => {
    try {
      const response = await postData(ApiUrl.ADDSLOTS, {
        startTime: PayloadData.startTime,
        endTime: PayloadData.endTime,
        endUnit: PayloadData.endUnit,
        startUnit: PayloadData.startUnit,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddSlots(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await putData(ApiUrl.UPDATESLOTS + editRowId, {
        startTime: PayloadData.startTime,
        endTime: PayloadData.endTime,
        endUnit: PayloadData.endUnit,
        startUnit: PayloadData.startUnit,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setPayloadData(InitialData);
        setAddSlots(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const getSlots = async () => {
    try {
      const response = await getData(ApiUrl.GETSLOTS);

      if (response.status === 200) {
        const rowsWithId = response.data.map((item, index) => ({
          ...item,
          id: item._id,
          index: index + 1,
        }));
        setRows(rowsWithId);
        setAddSlots(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slots?")) {
      const response = await deleteData(ApiUrl.DELETESLOTS + id);
      if (response.status === 200) {
        alert(response.data.message);
        getSlots();
      }
    }
  };

  const handleEdit = (data) => {
    setAddSlots(true);
    setIsEditMode(true);
    setEditRowId(data._id);

    setPayloadData({
      startTime: data.startTime,
      endTime: data.endTime,
      endUnit: data.endUnit,
      startUnit: data.startUnit,
    });
  };

  return (
    <Box m="20px">
      {!AddSlots ? (
        <>
          {" "}
          <Button onClick={() => setAddSlots(true)}>Add Slots</Button>
          <Header title="Slots" />
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
          <Button onClick={() => setAddSlots(false)}>View Slots</Button>

          <div className="row m-auto">
            <Header
              subtitle={isEditMode ? "Edit the Slots" : "Create a New Slots"}
            />
            <div>
              <div className="row border">
                <div className="col-md-10 m-auto p-4">
                  <div className="row">
                    <div className="col-md-4 m-auto mb-3">
                      <Form.Label>Slots</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        value={PayloadData.startTime}
                        type="text"
                        name="startTime"
                        placeholder="10AM - 11AM"
                      />
                    </div>{" "}
                    {/* <div className="col-md-2 mb-3 m-auto">
                      <Form.Select
                        name="endUnit"
                        onChange={handleChange}
                        value={PayloadData.endUnit}
                      >
                        <option aria-readonly>Select </option>
                        <option value="PM">PM</option>
                        <option value="AM">AM</option>
                      </Form.Select>
                    </div>
                    <div className="col-md-4 m-auto mb-3">
                      <Form.Control
                        name="endTime"
                        onChange={handleChange}
                        value={PayloadData.endTime}
                        type="text"
                        placeholder="End Time"
                      />
                    </div>{" "}
                    <div className="col-md-2 mb-3 m-auto">
                      <Form.Select
                        name="startUnit"
                        onChange={handleChange}
                        value={PayloadData.startUnit}
                      >
                        <option aria-readonly>Select </option>
                        <option value="PM">PM</option>
                        <option value="AM">AM</option>
                      </Form.Select>
                    </div> */}
                    <div className="row mt-4 text-center">
                      <Button
                        onClick={() => setAddSlots(false)}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Slots;
