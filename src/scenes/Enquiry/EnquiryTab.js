import React from "react";
import { useLocation } from "react-router-dom";

export default function EnquiryTab({ props }) {
  let location = useLocation();
  return (
    <div className="row">
      <div className="enquir-tab">
        <a
          href="/enquiryadd"
          className={`enquiry-btn p-1 me-3 ${
            location.pathname === "/enquiryadd" ? "enquiry-btn1" : ""
          }`}
        >
          Enquiry Add
        </a>

        <a
          href="/enquiry"
          className={`enquiry-btn p-1 me-3 ${
            location.pathname === "/enquiry" ? "enquiry-btn1" : ""
          }`}
        >
          Enquiry New
        </a>

        <a
          href="/etoday"
          className={`enquiry-btn p-1 me-3 ${
            location.pathname === "/etoday" ? "enquiry-btn1" : ""
          }`}
        >
          Today
        </a>
        <a
          href="/enquerysearch"
          className={`enquiry-btn p-1 me-3 ${
            location.pathname === "/enquerysearch" ? "enquiry-btn1" : ""
          }`}
        >
          Enquiry Search
        </a>
      </div>
    </div>
  );
}
