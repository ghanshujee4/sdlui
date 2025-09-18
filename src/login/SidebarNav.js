// src/components/SidebarNav.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import SeatBooking from "../SeatBooking";
import { useNavigate } from "react-router-dom";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  const toggleScrollDiv = () => setIsOpen(!isOpen);

  return (
    <nav className="pcoded-navbar menupos-fixed menu-light brand-blue">
      <div className="navbar-warpper">
        <div className="navbar-wrapper">
          <div className="navbar-brand header-logo">
            <img src="../assets/images/logo.svg" alt="" className="logo images" />
            <img src="../assets/images/logo-icon.svg" alt="" className="logo-thumb images" />
            <a
              className="mobile-menu"
              id="mobile-collapse"
              href="#!"
              onClick={toggleScrollDiv}
            >
              <span></span>
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="navbar-content scroll-div"
          >
            <ul className="nav pcoded-inner-navbar">
              <li className="nav-item pcoded-menu-caption">
                <label>Navigation</label>
              </li>
              <li className="nav-item">
                {/* <a onClick={navigate("../SeatBooking")} className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-home"></i>
                  </span>
                  <span className="pcoded-mtext">Dashboard</span>
                </a> */}
              </li>
              <li className="nav-item">
                <a href="form_elements.html" className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-file-text"></i>
                  </span>
                  <span className="pcoded-mtext">Enrolment ID</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="tbl_bootstrap.html" className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-align-justify"></i>
                  </span>
                  <span className="pcoded-mtext">Refer and get-100</span>
                </a>
              </li>

              <li className="nav-item pcoded-menu-caption">
                <label>Pay Due</label>
              </li>
              <li className="nav-item">
                {/* <a onClick={navigate('../charts/dashboardchart')} className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-pie-chart"></i>
                  </span>
                  <span className="pcoded-mtext">Chart</span>
                </a> */}
              </li>
              <li className="nav-item">
                <a href="map-google.html" className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-map"></i>
                  </span>
                  <span className="pcoded-mtext">Maps</span>
                </a>
              </li>

              <li className="nav-item pcoded-menu-caption">
                <label>Pages</label>
              </li>
              <li className="nav-item pcoded-hasmenu">
                <a href="#!" className="nav-link">
                  <span className="pcoded-micon">
                    <i className="feather icon-lock"></i>
                  </span>
                  <span className="pcoded-mtext">Authentication</span>
                </a>
                <ul className="pcoded-submenu">
                  <li>
                    <a href="auth-signup.html" target="_blank">Register</a>
                  </li>
                  <li>
                    <a href="auth-signin.html" target="_blank">Sign in</a>
                  </li>
                </ul>
              </li>
            </ul>

            <div className="card text-center">
              <div className="card-block">
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-hidden="true"
                >
                  ×
                </button>
                <i className="feather icon-sunset f-40"></i>
                <h6 className="mt-3">Shastra Digital Library</h6>
                <p>Rate and review Your SDL</p>
                <a
                  href="https://g.co/kgs/TmnPniy"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gradient-primary btn-sm text-white m-0"
                >
                  Rate Us Here
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNav;
