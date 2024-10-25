import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Category from "./scenes/category";
import SubCategory from "./scenes/subcategory";
import Items from "./scenes/Item/index.js";
import Slots from "./scenes/Slots.js";
import Order from "./scenes/order/index.jsx";
import Services from "./scenes/Appservice.js/index.js";
import Enquiry from "./scenes/Enquiry/index.jsx";
import EnquiryAdd from "./scenes/Enquiry/EnquiryAdd.js";
import EnquirySearch from "./scenes/Enquiry/EnquirySearch.js";
import EnquiryToday from "./scenes/Enquiry/Etoday.jsx";
import Quote from "./scenes/Quote/index.jsx";
import Confirmed from "./scenes/Quote/Confirmed.jsx";
import QuoteDetails from "./scenes/Quote/QuoteDetails.jsx";
import EnquiryDetails from "./scenes/Enquiry/EnquiryDetails.jsx";
import Banner from "./scenes/Banner/index.js";
import Vendor from "./scenes/Vendor/vendor.jsx";
import Vendordetails from "./scenes/Vendor/vendorDetails.js";
import Voucher from "./scenes/voucher/voucher.jsx";
import OrderDetials from "./scenes/order/orderDetials.jsx";
import ViewOrder from "./scenes/order/ViewOrder.jsx";
import ModifyOrder from "./scenes/order/Modifyorder.jsx";
import VehicalAdd from "./scenes/VehicalAdd/index.js";
import QuoteView from "./scenes/Quote/QuoteView.js";
import QuoteCalendar from "./scenes/Quote/QuoteCalendar.js";
import Addons from "./scenes/Addons/index.js";
import Login from "./scenes/Login"; // Import your Login component
import EnquiryFollow from "./scenes/Enquiry/EnquiryFollow.js";

function App() {
  const [theme, colorMode] = useMode();
  const admin = localStorage.getItem("PMadmin1");
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebarAndTopbar = location.pathname
    .toLowerCase()
    .startsWith("/quoteview");

  console.log("hideSidebarAndTopbar", hideSidebarAndTopbar);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          <Route path="/quoteView/:quoteID" element={<QuoteView />} />
          <Route path="/" element={<Login />} />
        </Routes>

        {admin ? (
          <div className="app">
            {!hideSidebarAndTopbar && location.pathname !== "/" && (
              <Sidebar isSidebar={isSidebar} />
            )}
            <main className="content">
              {!hideSidebarAndTopbar && admin && location.pathname !== "/" && (
                <Topbar setIsSidebar={setIsSidebar} />
              )}
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/items" element={<Items />} />
                <Route path="/slots" element={<Slots />} />
                <Route path="/category" element={<Category />} />
                <Route path="/subcategory" element={<SubCategory />} />
                <Route path="/service" element={<Services />} />
                <Route path="/enquiry" element={<Enquiry />} />
                <Route path="/EnquiryFollow" element={<EnquiryFollow />} />
                <Route path="/enquiryadd" element={<EnquiryAdd />} />
                <Route path="/enquerysearch" element={<EnquirySearch />} />
                <Route path="/etoday" element={<EnquiryToday />} />
                <Route path="/quotelist/:selectedDate" element={<Quote />} />
                <Route path="/confirmed" element={<Confirmed />} />
                <Route path="/quotedetails/:id" element={<QuoteDetails />} />
                <Route path="/enuirydetails" element={<EnquiryDetails />} />
                <Route path="/banner" element={<Banner />} />
                <Route path="/vendor" element={<Vendor />} />
                <Route path="/vendordetails/:id" element={<Vendordetails />} />
                <Route path="/voucher" element={<Voucher />} />
                <Route path="/order" element={<Order />} />
                <Route
                  path="/orderdetails/:selectedDate"
                  element={<OrderDetials />}
                />
                <Route path="/vieworder/:data" element={<ViewOrder />} />
                <Route path="/modifyorder/:data" element={<ModifyOrder />} />
                <Route path="/vehical" element={<VehicalAdd />} />
                <Route path="/addons" element={<Addons />} />
                <Route path="/quoteCalendar" element={<QuoteCalendar />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            {/* <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />{" "} */}
            {/* Redirects all other routes to login */}
          </Routes>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
