import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import axios from "axios";
import DataTable from "react-data-table-component";
import Multiselect from "multiselect-react-dropdown";

import * as XLSX from "xlsx";
import moment from "moment";
import { ApiUrl } from "../../ApiRUL";

const active = {
  backgroundColor: "#3da58a",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
};
const inactive = { color: "black", backgroundColor: "white" };

function Vendor() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const admin = JSON.parse(sessionStorage.getItem("admin"));

  const [isVisible, setIsVisible] = useState(true);
  const [city, setcity] = useState("");
  const [category, setcategory] = useState("");
  const [vhsname, setvhsname] = useState("");
  const [smsname, setsmsname] = useState("");
  const [number, setnumber] = useState("");
  const [password, setpassword] = useState("");
  const [experiance, setexperiance] = useState("");
  const [language, setlanguagesknow] = useState("");
  const [Type, setType] = useState("");
  const [data, setdata] = useState({});

  const [city1, setcity1] = useState(data.city);
  const [category1, setcategory1] = useState(data.category);
  const [vh, setvh] = useState(data.vhsname);
  const [smsname1, setsmsname1] = useState(data.smsname);
  const [number1, setnumber1] = useState(data.number);
  const [password1, setpassword1] = useState(data.password);
  const [experiance1, setexperiance1] = useState(data.experiance);
  const [language1, setlanguagesknow1] = useState(data.language);
  const [Type1, setType1] = useState(data.Type);
  const [selectedCatagory, setSelectedCatagory] = useState(
    data?.category || []
  );
  const [selectedCatagory1, setSelectedCatagory1] = useState(
    data?.category || []
  );
  const [Radius1, setRadius1] = useState(data.Radius);
  const [Area1, setArea1] = useState(data.Area);
  const [Pincode1, setPincode1] = useState(data.Pincode);
  const [techniciandata, settechniciandata] = useState([]);
  const [citydata, setcitydata] = useState([]);
  const [categorydata, setcategorydata] = useState([]);
  const [search, setsearch] = useState("");
  const [filterdata, setfilterdata] = useState([]);
  const [Area, setArea] = useState("");
  const [Pincode, setPincode] = useState("");

  const [Radius, setRadius] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (divNum) => () => {
    setSelected(divNum);
  };

  const addtechnician = async (e) => {
    e.preventDefault();

    if (
      !city ||
      !vhsname ||
      !number ||
      !password ||
      !experiance ||
      !language ||
      !Radius
    ) {
      alert("Please fill all fields");
    } else {
      try {
        const config = {
          url: "/addtechnician",
          method: "post",
          baseURL: ApiUrl.BASEURL,
          // data: formdata,
          headers: { "content-type": "application/json" },
          data: {
            Type: "outVendor",
            // category: selectedCatagory,
            vhsname: vhsname,
            smsname: smsname,
            number: number,
            password: password,
            experiance: experiance,
            languagesknow: language,
            city: city,
            Radius: Radius,
            Area: Area,
            Pincode: Pincode,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            console.log("success");
            alert(" Added");
            window.location.assign("/vendor");
          }
        });
      } catch (error) {
        console.error(error); // Log the error to the browser console
        alert("An error occurred: " + error.message);
      }
    }
  };

  useEffect(() => {
    gettechnician();
    getcity();
  }, []);

  const gettechnician = async () => {
    let res = await axios.get(ApiUrl.BASEURL + ApiUrl.GETVENDOR);
    if ((res.status = 200)) {
      settechniciandata(
        res.data?.technician.filter((i) => i.Type === "outVendor")
      );
      setfilterdata(res.data?.technician.filter((i) => i.Type === "outVendor"));
    }
  };

  const getcity = async () => {
    let res = await axios.get(
      "https://api.vijayhomesuperadmin.in/api/master/getcity"
    );
    if ((res.status = 200)) {
      setcitydata(res.data?.mastercity);
    }
  };

  let i = 0;
  const deletetechnician = async (id) => {
    axios({
      method: "post",
      url: ApiUrl.BASEURL + ApiUrl.DELETEVENDOR + id,
    })
      .then(function (response) {
        //handle success
        console.log(response);
        alert("Deleted successfully");
        window.location.reload();
      })
      .catch(function (error) {
        //handle error
        console.log(error.response.data);
      });
  };

  const columns = [
    {
      name: "Sl  No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Date",
      cell: (row) => (
        <div>
          {moment(row.createdAt).format("DD-MM-YYYY")} <br></br>
          {moment(row.createdAt).format("LT")}
        </div>
      ),
    },
    {
      name: "VHS Name",
      selector: (row) => row.vhsname,
    },
    {
      name: "SMS Name",
      selector: (row) => row.smsname,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "Mobile no",
      selector: (row) => row.number,
    },
    // {
    //   name: "category",
    //   cell: (row) => (
    //     <div>
    //       {row.category.map((i) => (
    //         <div> {i.name},</div>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      name: "Address",
      selector: (row) => row.Area,
    },
    {
      name: "Pincode",
      selector: (row) => row.Pincode,
    },
    {
      name: "Languages",
      selector: (row) => row.languagesknow,
    },
    {
      name: "W.B",
      selector: (row) => Number(row.vendorAmt).toFixed(2),
    },

    {
      name: "Action",
      cell: (row) => (
        <div>
          <a className="hyperlink" onClick={() => edit(row)}>
            Edit |
          </a>

          <a
            onClick={() => deletetechnician(row._id)}
            className="hyperlink mx-1"
          >
            Delete
          </a>
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          {row?.block ? (
            <div>
              <p
                onClick={() => unblockvendor(row._id)}
                style={{
                  color: "white",
                  background: "red",
                  padding: 5,
                }}
              >
                Blocked
              </p>
              <p style={{}}>{row?.reason}</p>
            </div>
          ) : (
            <a onClick={() => blockvendor(row._id)} className="hyperlink mx-1">
              Block
            </a>
          )}
        </div>
      ),
    },
  ];
  const edit = (data) => {
    setdata(data);
    setSelectedCatagory1(data.category);
    handleShow(true);
  };
  useEffect(() => {
    const result = techniciandata.filter((item) => {
      return item.vhsname.toLowerCase().match(search.toLowerCase());
    });
    setfilterdata(result);
  }, [search]);

  const edittechnician = async (e) => {
    e.preventDefault();
    try {
      const config = {
        url: `/edittechnician/${data._id}`,
        method: "post",
        baseURL: ApiUrl.BASEURL,
        headers: { "content-type": "application/json" },
        data: {
          Type: Type1,
          //   category: selectedCatagory1,
          vhsname: vh,
          smsname: smsname1,
          number: number1,
          password: password1,
          experiance: experiance1,
          languagesknow: language1,
          city: city1,
          Area: Area1,
          Pincode: Pincode1,
          Radius: Radius1,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Successfully Added");
          window.location.reload("");
        }
      });
    } catch (error) {
      console.error(error);
      alert("category  Not Added");
    }
  };

  const blockvendor = async (data) => {
    // Prompt the user with a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to block this user?"
    );

    if (confirmed) {
      // Ask the user for a reason
      const reason = window.prompt(
        "Please enter the reason for blocking this user:"
      );

      if (reason) {
        try {
          const config = {
            url: `/vendorstatusupdate/${data}`,
            method: "put",
            baseURL: ApiUrl.BASEURL,
            headers: { "content-type": "application/json" },
            data: {
              block: true,
              reason: reason,
            },
          };
          await axios(config).then(function (response) {
            if (response.status === 200) {
              alert("Successfully Blocked");
              window.location.reload();
            }
          });
        } catch (error) {
          console.error(error);
          alert("Error blocking vendor");
        }
      } else {
        alert("Blocking cancelled. Reason is required.");
      }
    } else {
      // Do nothing if the user cancels the confirmation
    }
  };

  const unblockvendor = async (data) => {
    // Prompt the user with a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to unblock this user?"
    );

    if (confirmed) {
      try {
        const config = {
          url: `/vendorstatusupdate/${data}`,
          method: "put",
          baseURL: ApiUrl.BASEURL,
          headers: { "content-type": "application/json" },
          data: {
            block: false,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            alert("Successfully Added");
            window.location.reload("");
          }
        });
      } catch (error) {
        console.error(error);
        alert("Not Added");
      }
    } else {
      // Do nothing if the user cancels the confirmation
    }
  };

  const handleRowClick = (row) => {
    const queryString = new URLSearchParams({
      rowData: JSON.stringify(row),
    }).toString();
    const newTab = window.open(`/vendordetails/${row._id}?${queryString}`);
  };

  const exportData = () => {
    const fileName = "Vendors.xlsx";
    // Assuming each object in searchResults has properties like 'category' and 'img'
    const filteredData1 = filterdata?.map((item) => ({
      Date: moment(item.createdAt).format("DD-MM-YYYY"),
      VHSName: item.vhsname,
      SMSName: item?.smsname,
      city: item?.city,
      number: item?.number,
      category: item?.category[0]?.name,
      Pincode: item?.Pincode,
      WalletBalance: item.vendorAmt,
      Radius: item.Radius,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData1);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, " Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div div className="row">
      <div className="d-flex float-end mt-3 mb-3">
        <button
          className="btn-primary-button mx-2"
          style={selected == 1 ? active : inactive}
          onClick={handleClick(1)}
        >
          Vendor Add
        </button>

        <button
          style={selected == 0 ? active : inactive}
          onClick={handleClick(0)}
          className="btn-primary-button"
        >
          All Vendors
        </button>
      </div>

      <div className="row w-100">
        {selected == 0 ? (
          <>
            {" "}
            <div className="mt-5 p-3">
              <input
                type="text"
                placeholder="Search here.."
                className="w-25 form-control"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
            </div>
            <div className="mt-1 border">
              <button
                className="ps-3 pt-2 pb-2 pe-3 ms-2"
                style={{
                  border: 0,
                  color: "white",
                  backgroundColor: "#3da58a",
                  borderRadius: "5px",
                  width: "150px",
                  float: "right",
                }}
                onClick={exportData}
              >
                <i
                  class="fa-solid fa-download"
                  title="Download"
                  // style={{ color: "white", fontSize: "27px" }}
                ></i>
                Export
              </button>
              <DataTable
                columns={columns}
                data={filterdata}
                pagination
                fixedHeader
                selectableRowsHighlight
                subHeaderAlign="left"
                highlightOnHover
                onRowClicked={handleRowClick}
              />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="row m-auto">
              <div className="col-md-12">
                <div className="row justify-content-end pt-3">
                  <div className="col-md-1 p-0">
                    {/* <button className="btn-primary-technician-button1">
                Technician
              </button> */}
                  </div>
                </div>
                <div className="card" style={{ marginTop: "30px" }}>
                  <div className="card-body p-3">
                    <form>
                      <div className="row pt-2">
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            City <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <select
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setcity(e.target.value)}
                            >
                              <option>--select--</option>
                              {citydata.map((item) => (
                                <option value={item.city}>{item.city}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            VHS Name <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setvhsname(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vhs-input-label">SMS Name</div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setsmsname(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row pt-3">
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            Mobile Number{" "}
                            <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              maxLength="10"
                              className="col-md-12 vhs-input-value"
                              pattern="[0-9]{10}" // Pattern to accept only 10-digit numbers
                              onChange={(e) => setnumber(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            Password <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              onChange={(e) => setpassword(e.target.value)}
                              type="text"
                              className="col-md-12 vhs-input-value"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            Experiance <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setexperiance(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row pt-3">
                        <div className="col-md-4">
                          <div className="vhs-input-label">
                            Languages Known{" "}
                            <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setlanguagesknow(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-4">
                          <div className="vhs-input-label">
                            Category<span className="text-danger"> *</span>
                          </div>
                          <Multiselect
                            className="mt-3"
                            options={categorydata.map((category) => ({
                              name: category.category,
                              // id: category._id,
                            }))}
                            placeholder="Select Catagory"
                            selectedValues={selectedCatagory}
                            onSelect={onSelectCatagory}
                            onRemove={onRemoveCatagory}
                            displayValue="name"
                            // disablePreSelectedValues={true}
                            showCheckbox={true}
                          />
                        </div> */}

                        {/* <div className="col-md-4">
                          <div className="vhs-input-label">
                            Radius <span className="text-danger"> *</span>
                          </div>
                          <div className="group pt-1">
                            <input
                              type="number"
                              placeholder="10km"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setRadius(e.target.value)}
                            />
                          </div>
                        </div> */}
                        <div className="col-md-4">
                          <div className="vhs-input-label">Pincode</div>
                          <div className="group pt-1">
                            <input
                              type="number"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setPincode(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vhs-input-label">Address</div>
                          <div className="group pt-1">
                            <input
                              type="text"
                              className="col-md-12 vhs-input-value"
                              onChange={(e) => setArea(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row pt-2">
                        <div className="vhs-sub-heading">
                          Note: One Mobile Number Will Register Only Once For
                          Vendor
                        </div>
                      </div>

                      <div className="row pt-3">
                        <div className="col-md-2">
                          <button
                            className="vhs-button"
                            onClick={addtechnician}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Technician</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card" style={{ marginTop: "30px" }}>
            <div className="card-body p-3">
              <form>
                <div className="row pt-2">
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Type <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setType1(e.target.value)}
                        defaultValue={data?.Type}
                      >
                        <option value="Vendor">Vendor</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      City <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <select
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setcity1(e.target.value)}
                      >
                        <option value={data.city}>{data.city}</option>
                        {citydata.map((item) => (
                          <option value={item.city}>{item.city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* <div className="col-md-4">
                    <Multiselect
                      className="mt-3"
                      options={categorydata.map((category) => ({
                        name: category.category,
                        // id: category._id,
                      }))}
                      selectedValues={selectedCatagory1}
                      onSelect={onEditCatagory}
                      onRemove={onRemoveCatagory}
                      displayValue="name"
                      showCheckbox={true}
                    />
                  </div> */}
                </div>

                <div className="row pt-3">
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      VHS Name <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setvh(e.target.value)}
                        defaultValue={data.vhsname}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      SMS Name <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setsmsname1(e.target.value)}
                        defaultValue={data.smsname}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Mobile Number <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setnumber1(e.target.value)}
                        defaultValue={data.number}
                      />
                    </div>
                  </div>
                </div>

                <div className="row pt-3">
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Password <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setpassword1(e.target.value)}
                        defaultValue={data.password}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Experiance <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        defaultValue={data.experiance}
                        onChange={(e) => setexperiance1(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="vhs-input-label">
                      Languages Known <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        className="col-md-12 vhs-input-value"
                        defaultValue={data.languagesknow}
                        onChange={(e) => setlanguagesknow1(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4"></div>
                </div>

                <div className="row pt-3 mt-3">
                  <div className="col-md-4 ">
                    <div className="vhs-input-label">
                      Radius <span className="text-danger"> *</span>
                    </div>
                    <div className="group pt-1">
                      <input
                        type="number"
                        defaultValue={data?.Radius}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setRadius1(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">Area</div>
                    <div className="group pt-1">
                      <input
                        type="text"
                        defaultValue={data?.Area}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setArea1(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vhs-input-label">Pincode</div>
                    <div className="group pt-1">
                      <input
                        type="number"
                        defaultValue={data?.Pincode}
                        className="col-md-12 vhs-input-value"
                        onChange={(e) => setPincode1(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="row pt-2">
                  <div className="vhs-sub-heading">
                    Note: One Mobile Number Will Register Only Once For
                    Technician
                  </div>
                </div> */}

                <div className="row pt-3">
                  <div className="col-md-2">
                    <button className="vhs-button" onClick={edittechnician}>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default Vendor;
