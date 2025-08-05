//  import logo from './logo.svg';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import StudentRegistration from './StudentRegistration';
// import React from "react";
import Login from './login/Login';
import SeatBooking from './SeatBooking';
import Dashboard from './dashboard/Dashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import Layout from './login/Layout';
import { useNavigate } from "react-router-dom";
import './index.css'; // Or './App.css' depending on your setup
import MultiSelect from './MultiSelect';
import Header from './login/Header';
import StudentRegistrationPopup from './StudentRegistration';
import AdminLogin from './login/AdminLogin';
import Payments from './payments/Payments';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Includes Popper.js
// import AdminProtectedRoute from './dashboard/AdminProtectedRoute';
import PrivateRoute from './dashboard/PrivateRoute';
import OverduePayments from './payments/OverduePayments';
import SeatFullInfoPage from './dashboard/SeatFullInfoPage';
import ChartDashboard from './dashboard/ChartDashboard';
import DashboardChart from './dashboard/DashboardChart';


function App() {
  const navigate = useNavigate();
  const redHome = () => {
    navigate('/')
  }
  const checkSeatAvailablity = () => {
    navigate('/seatbooking')
  }
  return (
    <div>
      <div className="header-blue">
        {/* <nav className="navbar navbar-light navbar-expand-md navigation-clean-search"> */}
        <nav className="navbar navbar-expand-md navigation-clean-search">
          
          <div className="container-fluid">
          <div>
    <img
      src="/logo.png"  // Ensure the logo file is inside the 'public/' folder
      alt="Library Logo"
      className="logo"
      style={{ height: "60px" }} // Adjust size & spacing
    />
  </div>
  <a className="gradient-text gradient-text-logo" href="#" onClick={redHome}>Shastra Digital Library</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navcol-1">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse"
              id="navcol-1">
              <ul className="nav navbar-nav">
                <li className="nav-item" role="presentation"><a className="nav-link" href="https://shastradigitallibrary.com/contact-shastra-digital-library">Contact</a></li>
                <li className="nav-item dropdown"><a className="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="false" href="https://shastradigitallibrary.com/facilities-in-digital-library">Services</a>
                  <div className="dropdown-menu" role="menu"><a className="dropdown-item" role="presentation" href="#">Logo design</a><a className="dropdown-item" role="presentation" href="#">Banner design</a><a className="dropdown-item" role="presentation" href="#">content writing</a></div>
                </li>
                <li className="nav-item" role="presentation"><a className="nav-link" onClick={checkSeatAvailablity}>Check Seat Avaialblity</a></li>
              </ul>
            </div>
            {/* <form className="form-inline mr-auto" target="_self">
              <div className="form-group"><label htmlFor="search-field"><i className="fa fa-search text-white"></i></label><input className="form-control search-field" type="search" id="search-field" name="search" /></div>
            </form>*/}
            <span className="navbar-text"> <Header /></span>
          </div>

        </nav>
      </div>

      {/* <div className="bg-red-500 text-white p-4">
      <h1 className='color' style={{color:'#000', cursor:'pointer'}} onClick={redHome}>Shastra Digital Library</h1>
    </div> */}
      <Routes>
        <Route path="/" element={<StudentRegistration />} />
        <Route path="/studentregistrationpopup" element={<StudentRegistrationPopup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path='/seatbooking' element={<SeatBooking />} />
        {/* <Route path="/dashboard" element={
      <AdminProtectedRoute>
        <Layout> <AdminDashboard /> </Layout>
      </AdminProtectedRoute>}/> */}
        <Route element={<PrivateRoute />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
       
        <Route path="/payments/overduepayments" element={<OverduePayments/>} />
        </Route>
        {/* <Route path="admindashboard" element={<AdminDashboard />} /> */}
        <Route path="/dashboard/:userId" element={<Layout> <Dashboard />  </Layout>} />
        <Route path="multiselect" element={<MultiSelect />} />
        <Route path="/payments/:userId" element={<Payments />} />
        <Route path="/SeatFullInfoPage" element={<SeatFullInfoPage />} />
        <Route path="/chartdashboard" element={<DashboardChart />} />
      </Routes>
    </div>

  );
}

export default App;