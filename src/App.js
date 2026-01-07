

// ----------------------
// React & Router Imports
// ----------------------
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// ----------------------
// Global Styles
// ----------------------
import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import StudentRegistrationPopup from './StudentRegistration';
// const LibraryPolicy = lazy(() => import('./sdl/LibraryPolicy'));
// const ShiftSeatChangeRequest = lazy(() => import('./dashboard/ShiftSeatChangeRequest'));

// const MyRequests = lazy(() => import('./dashboard/MyRequests'));


// ----------------------
// Direct Component Imports
// ----------------------
const ChatBox = lazy(() => import("./chat/ChatBox"));
const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const DashboardChart = lazy(() => import("./charts/DashboardChart"));
const Header = lazy(() => import("./login/Header"));
const Layout = lazy(() => import("./login/Layout"));
const Login = lazy(() => import("./login/Login"));
const AdminLogin = lazy(() => import("./login/AdminLogin"));
const MailManager = lazy(() => import("./utils/MailManager"));
const MultiSelect = lazy(() => import("./MultiSelect"));
const PaymentDashboard = lazy(() => import("./charts/PaymentDashboard"));
const Payments = lazy(() => import("./payments/Payments"));
const OverduePayments = lazy(() => import("./payments/OverduePayments"));
const PrivateRoute = lazy(() => import("./dashboard/PrivateRoute"));
const RequestsApproval = lazy(() => import("./dashboard/RequestsApproval"));
const SeatBooking = lazy(() => import("./SeatBooking"));
const SeatFullInfoPage = lazy(() => import("./dashboard/SeatFullInfoPage"));
const StudentRegistration = lazy(() => import("./StudentRegistration"));
const VideoGenerationBox = lazy(() => import("./utils/VideoGenerationBox"));
const PaymentQR = lazy(() => import('./utils/PaymentQR'));
const AppGame = lazy(() => import('./dashboard/AppGame'));
// ----------------------
// Lazy Loaded Components
// ----------------------
const AdminDashboard = lazy(() => import("./dashboard/AdminDashboard"));
const LibraryPolicy = lazy(() => import("./sdl/LibraryPolicy"));
const ShiftSeatChangeRequest = lazy(() =>
  import("./dashboard/ShiftSeatChangeRequest")
);
// const MyRequests = lazy(() => import("./dashboard/MyRequests"));
const MyRequests = lazy(() => import ('./dashboard/MyRequests'))

function App() {
  const navigate = useNavigate();
  const redHome = () => {
    navigate('/')
  }
  const checkSeatAvailablity = () => {
    navigate('/seatbooking')
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <div className="header-blue">
          {/* <nav className="navbar navbar-light navbar-expand-md navigation-clean-search"> */}
          <nav className="navbar navbar-expand-md navigation-clean-search">

            <div className="container-fluid">
              <div>
                <img
                  src="./logo.png"  // Ensure the logo file is inside the 'public/' folder
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
              </form> */}
              <span className="navbar-text"> <Header /></span>
            </div>

          </nav>
        </div>

        {/* <div className="bg-red-500 text-white p-4">
        <h1 className='color' style={{color:'#000', cursor:'pointer'}} onClick={redHome}>Shastra Digital Library</h1>
      </div> */}
        <div className=''>
          <Routes>
            <Route path="/" element={<StudentRegistration />} />
            {/* <Route path="/studentregistrationpopup" element={<StudentRegistrationPopup />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path='/seatbooking' element={<SeatBooking />} />
            {/* <Route element={<PrivateRoute />}> */}
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/payments/overduepayments" element={<OverduePayments />} />
              <Route path="/requests-approval" element={<RequestsApproval />} />
              <Route path='/PaymentDashboard' element={<PaymentDashboard />} />
            {/* </Route> */}
            {/* <Route path="admindashboard" element={<AdminDashboard />} /> */}
            <Route path="/dashboard/:userId" element={<Layout> <Dashboard />  </Layout>} />
            <Route path="multiselect" element={<MultiSelect />} />
            <Route path="/payments/:userId" element={<Payments />} />
            <Route path="/SeatFullInfoPage" element={<SeatFullInfoPage />} />
            <Route path="/chartdashboard" element={<DashboardChart />} />
            <Route path="ChatBox" element={<ChatBox />} />
            <Route path='MailManager' element={<MailManager />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path='VideoGenerationBox' element={<VideoGenerationBox />} />
            <Route path="sdl/librarypolicy" element={<LibraryPolicy />} />
            <Route path="/shift-seat-request" element={<ShiftSeatChangeRequest />} />
            <Route path="/my-requests/:userId" element={<MyRequests />} />
            <Route path="/PaymentQR" element={<Suspense fallback={<div>Loading...</div>}><PaymentQR /></Suspense>} />
            {/* <Route path="/test" element={<Suspense fallback={<div>Loading...</div>}><Test /></Suspense>} /> */}
            <Route path="/game" element={<Suspense fallback={<div>Loading...</div>}><AppGame /></Suspense>} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;