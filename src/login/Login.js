import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config"; // Replace with your actual config file
import './Login.css';

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBTypography,
} from 'mdb-react-ui-kit';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${config.BASE_URL}/users/login`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then((response) => {
      const { token, userId } = response.data;

      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        window.dispatchEvent(new Event("storage"));
        setMessage("✅ Login successful!");
        setTimeout(() => navigate(`/dashboard/${userId}`), 1000);
      } else {
        setMessage("❌ Login failed. Please check your credentials.");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      setMessage("❌ Login failed. Please try again.");
    });
  };

  const goToRegister = () => {
    navigate("/");
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <MDBCard style={{ maxWidth: '450px', width: '100%', padding: '20px' }}>
        <MDBCardBody>
          <div className="text-center mb-4">
            <MDBTypography tag="h4" className="fw-bold mb-2">Login into your account</MDBTypography>
            <p className="text-muted">Students Login</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mb-4"
              required
            />

            <MDBInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mb-3"
              required
            />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <MDBCheckbox name="remember" label="Save credentials" />
              <a href="#!" className="text-primary" style={{ fontSize: "0.9rem" }}>Forgot password? Reset</a>
            </div>

            <MDBBtn className="w-100 mb-3" type="submit">Login</MDBBtn>

            <div className="text-center">
              <p className="mb-0">Don’t have an account? <a href="#!" className="text-primary" onClick={goToRegister}>Signup</a></p>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
