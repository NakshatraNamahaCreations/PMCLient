import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AppsOutageOutlinedIcon from "@mui/icons-material/AppsOutageOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";
import QuizIcon from "@mui/icons-material/Quiz";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PhotoIcon from "@mui/icons-material/Photo";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const logout = () => {
    localStorage.removeItem("pmadmin");
    window.location.assign("/");
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#478CCF !important",
        },
        "& .pro-menu-item.active": {
          color: "#478CCF !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <img
                    width="20px"
                    height="20px"
                    src="./../assets/vhsLogo.jpeg"
                  />
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src="./../assets/user.png"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Packers & Movers
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu title="Item Management" icon={<GridViewIcon />}>
              <Item
                title="Category"
                to="/category"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Subcategory"
                to="/subcategory"
                icon={<AppsOutageOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Item"
                to="/items"
                icon={<InventoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <Item
              title="Vendor"
              to="/vendor"
              icon={<CategoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              title="Service Management"
              icon={<CreditCardOutlinedIcon />}
            >
              <Item
                title="Slots"
                to="/slots"
                icon={<EventNoteIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Service"
                to="/service"
                icon={<ManageAccountsIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Vehical"
                to="/vehical"
                icon={<LocalShippingIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Add Ons"
                to="/addons"
                icon={<LocalShippingIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <Item
              title="Banner"
              to="/banner"
              icon={<PhotoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Voucher"
              to="/voucher"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              title="Enquiry Management"
              icon={<InventoryOutlinedIcon />}
            >
              <Item
                title="Enquiry"
                to="/enquiry"
                icon={<QuizIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Enquiry Follow"
                to="/EnquiryFollow"
                icon={<QuizIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Quote"
                to="/quoteCalendar"
                icon={<ReceiptLongIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <SubMenu title="Report Management" icon={<SignalCellularAltIcon />}>
              <Item
                title="Order"
                to="/order"
                icon={<LocalMallOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: "-10px",
              width: "100%", // Ensures it spans the full width of the sidebar
              textAlign: "center", // Center aligns the button
              marginTop: "25px",
            }}
          >
            <button
              onClick={logout}
              style={{
                background: "#ff000047",
                border: "none",
                color: "black",
                padding: "5px",
                cursor: "pointer",
                width: "60%",
                margin: "auto",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
