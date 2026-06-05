import { useNavigate } from "react-router-dom";
import logo from "assets/logo.png";
import { ROUTES } from "constants/routes";

const AppShell = ({ headerSlot, children }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header-blue">
        <nav className="navbar navbar-expand-md navigation-clean-search">
          <div className="container-fluid">
            <div>
              <img
                src={logo}
                alt="Library Logo"
                className="logo"
                style={{ height: "60px" }}
              />
            </div>
            <a
              className="gradient-text gradient-text-logo"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTES.home);
              }}
            >
              Shastra Digital Library
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navcol-1"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navcol-1">
              <ul className="nav navbar-nav">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    href="https://shastradigitallibrary.com/contact-shastra-digital-library"
                  >
                    Contact
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="dropdown-toggle nav-link"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    href="https://shastradigitallibrary.com/facilities-in-digital-library"
                  >
                    Services
                  </a>
                  <div className="dropdown-menu" role="menu">
                    <a className="dropdown-item" role="presentation" href="#">
                      Logo design
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Banner design
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      content writing
                    </a>
                  </div>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(ROUTES.seatBooking);
                    }}
                  >
                    Check Seat Avaialblity
                  </a>
                </li>
              </ul>
            </div>
            <span className="navbar-text">{headerSlot}</span>
          </div>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default AppShell;
