import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "./utils/axiosInstance";
import config from "./config";
import { useNavigate } from "react-router-dom";
import MultiSelect from "./MultiSelect";
import GrowLoader from "../utils/GrowLoader";
import {
  MDBBtn,
  MDBCard,
  MDBInput,
  MDBTextArea,
  MDBTooltip,
  MDBIcon
} from "mdb-react-ui-kit";
import LibraryPolicy from "./sdl/LibraryPolicy";

const StudentRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    mobile: "",
    address: "",
    purpose: "",
    shift: [],
    seat: "",
    password: "",
    admissionDate: new Date().toISOString().split("T")[0],
    extraHour: "",
  });

  const [shifts, setShifts] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("No Aadhaar uploaded");
  const [adharFile, setAdharFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Shifts
  useEffect(() => {
    axiosInstance
      .get(`/shifts`)
      .then((res) => setShifts(res.data))
      .catch((err) => console.error("Error fetching shifts:", err));
  }, []);

  // ✅ Fetch Seats by Shift
  const getSeatResponse = useCallback(() => {
    if (!selectedShift) return;
    axiosInstance
      .get(`/seats/with-status?shiftNumber=${selectedShift}`)
      .then((res) => setSeats(res.data))
      .catch((err) => console.error("Error fetching seats:", err));
  }, [selectedShift]);

  // useEffect(() => {
  //   getSeatResponse();
  // }, [selectedShift, getSeatResponse]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "admissionDate" && { admissionDate: new Date(value).toISOString().split("T")[0] }),
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "shift") setSelectedShift(value);
  };

  // ✅ Aadhaar File Upload (Beautified)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName("No Aadhaar uploaded");
      setAdharFile(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        adharFile: "Only JPG, PNG, or PDF files are allowed",
      }));
      setAdharFile(null);
      return;
    }

    setFileName(file.name);
    setAdharFile(file);
    setErrors((prev) => ({ ...prev, adharFile: "" }));
  };

  // ✅ Email Unique Validation
  const validateEmailUnique = async (email) => {
    try {
      const response = await axiosInstance.get(
        `/users/check-email?email=${encodeURIComponent(email)}`
      );
      return response.data.unique;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  };

  // ✅ Mobile Unique Validation
  const validateMobileUnique = async (mobile) => {
    try {
      const response = await axiosInstance.get(
        `/users/check-mobile?mobile=${encodeURIComponent(mobile)}`
      );
      return response.data.unique;
    } catch (error) {
      console.error("Error validating mobile:", error);
      return false;
    }
  };

  // ✅ Form Validation
  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    const requiredFields = ["name", "email", "age", "mobile", "address", "purpose", "shift", "seat", "password"];
    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        tempErrors[field] = `${field[0].toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be 10 digits";
      isValid = false;
    }

    if (formData.address.length < 50) {
      tempErrors.address = "Please provide a complete address (min 50 chars)";
      isValid = false;
    }

    if (!formData.password.trim() || formData.password.includes(" ")) {
      tempErrors.password = "Password cannot contain spaces";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // ✅ Handle MultiSelect Shift
  const handleShiftSelect = (selectedList) => {
    setFormData((prev) => ({ ...prev, shift: selectedList }));
    setSelectedShift(selectedList.map((item) => item.name).join(","));
  };

  const handleRemove = (selectedList) => {
    setFormData((prev) => ({ ...prev, shift: selectedList }));
    setSelectedShift(selectedList.map((item) => item.name).join(","));
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formDataToSend = new FormData();
    if (adharFile) formDataToSend.append("adharCard", adharFile);

    const userData = {
      name: formData.name,
      email: formData.email,
      age: formData.age,
      mobile: formData.mobile,
      address: formData.address,
      purpose: formData.purpose,
      shift: formData.shift.map((s) => s.name).join(","),
      seat: formData.seat,
      password: formData.password,
      admissionDate: formData.admissionDate,
      extraHour: formData.extraHour,
    };

    formDataToSend.append("user", new Blob([JSON.stringify(userData)], { type: "application/json" }));

    try {
      await axiosInstance.post(`/users`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("🎉 Student registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Registration failed. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  // ✅ Check form validity
  useEffect(() => {
    const hasNoErrors = Object.values(errors).every((err) => !err);
    const filled = Object.values(formData).every((val) =>
      Array.isArray(val) ? val.length > 0 : val?.toString().trim() !== ""
    );
    const isAdharValid = adharFile !== null; // required
    setIsFormValid(filled && hasNoErrors && isAdharValid);
  }, [formData, errors, adharFile]);

  const SHIFT_TIME_MAP = {
    "1": "7:00AM–12:00PM (Morning)",
    "SHIFT1": "7:00AM–12:00PM (Morning)",

    "2": "12:00PM–5:00PM (Afternoon)",
    "SHIFT2": "12:00PM–5:00PM (Afternoon)",

    "3": "5:00PM–10:00PM (Evening)",
    "SHIFT3": "5:00PM–10:00PM (Evening)",

    "4": "8:00AM–2:30PM (Flexi Seats)",
    "SHIFT4": "8:00AM–2:30PM (Flexi Seats)",

    "5": "2:00PM–8:30PM (Flexi Seats)",
    "SHIFT5": "2:00AM–8:30AM (Flexi Seats)",
  };

  const selectedShiftText = formData.shift
    .map((s) => SHIFT_TIME_MAP[s.name] || "")
    .filter(Boolean);
 if (loading) {
    return <div className="text-center mt-5"><GrowLoader /></div>;
  }

  // ✅ Render
  return (
    <div className="container">
      {loading && <GrowLoader />}

      <div className="row">
        {message && <div className="alert alert-info text-center">{message}</div>}

        <MDBCard className="col-sm-12 col-md-6 p-4 shadow-lg rounded-4 border-0">
          <h3 className="text-center gradient-text mb-4">🎓 Join Lotus @ SDL</h3>

          {/* Basic Inputs */}
          <div className="col-md-12 mb-3">
            <MDBInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              size="lg"
              required
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBInput
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={async () => {
                const isUnique = await validateEmailUnique(formData.email);
                setErrors((prev) => ({
                  ...prev,
                  email: isUnique ? "" : "Email already exists",
                }));
              }}
              size="lg"
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBInput
              type="number"
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              size="lg"
              required
            />
            {errors.age && <div className="text-danger">{errors.age}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBInput
              label="Mobile"
              name="mobile"
              maxLength={10}
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, mobile: value }));
              }}
              onBlur={async () => {
                const isUnique = await validateMobileUnique(formData.mobile);
                setErrors((prev) => ({
                  ...prev,
                  mobile: isUnique ? "" : "Mobile number already exists",
                }));
              }}
              size="lg"
              required
            />
            {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBInput
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              size="lg"
              required
            />
            {errors.purpose && <div className="text-danger">{errors.purpose}</div>}
          </div>

          {/* Aadhaar Upload Beautified */}
          <div className="col-md-12 mb-4">
            {/* <label className="form-label fw-bold">Upload Aadhaar Card (Optional)</label> */}
            <div className="input-group">
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="form-control"
              />
              <span className="input-group-text bg-light">
                <MDBIcon icon="cloud-upload-alt" style={{ color: "#715fc0" }} />
                &nbsp; Upload Aadhaar
              </span>
            </div>
            <small className="form-text text-muted">{fileName}</small>
            {errors.adharFile && <div className="text-danger">{errors.adharFile}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBTextArea
              label="Enter Complete Address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              size="lg"
              required
            />
            {errors.address && <div className="text-danger">{errors.address}</div>}
          </div>

          {/* Admission Date */}
          <div className="col-md-12 mb-3">
            <MDBInput
              
              icon="calendar-alt"
              type="date"
              label="Admission Date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="w-100"
            />
          </div>

          {/* Shift Selection */}
          <div className="col-md-12 mb-3">
            <MultiSelect
              options={shifts}
              selectedValues={formData.shift}
              onSelect={handleShiftSelect}
              onRemove={handleRemove}
              label="Select Shifts"
              name="shift"
              placeholder="Select Shift"
            />
            {errors.shift && <div className="text-danger">{errors.shift}</div>}
       
          {/* ✅ Shift Time Display */}
          {selectedShiftText.length > 0 && (
            <div className="mt-2 text-success">
              Time:&nbsp;

              {selectedShiftText.map((text, index) => (
                <a key={index}>{text}</a>
              ))}

            </div>
          )}
        </div>

        {/* Seat Selection */}
        <div className="col-md-12 mb-3">
          <select
            id="seat"
            name="seat"
            className="form-select"
            value={formData.seat}
            onChange={handleChange}
            onClick={getSeatResponse}
            required
            >
              <option value="">Select Seat</option>
              {seats
                .filter((seat) => !seat.registered)
                .map((seat, index) => (
                  <option key={seat.id || `seat-${index}`} value={seat.seatNo}>
                    {seat.seatName || `Seat ${seat.seatNo}`}
                  </option>
                ))}
            </select>
            {errors.seat && <div className="text-danger">{errors.seat}</div>}
          </div>

          <div className="col-md-12 mb-3">
            <MDBTooltip
              tag="span"
              wrapperProps={{ className: "d-block" }}
              title="Allowed range: -1 to +2 hours. ₹100/hour for extra time."
              // subTitle="(Use -1 for no extra hours)"
            >
              <MDBInput
                type="number"
                id="extraHour"
                name="extraHour"
                label="Extra Hours"
                size="lg"
                min={-1}
                max={2}
                step={1}
                value={formData.extraHour}
                onChange={(e) => {
                  const value = e.target.value;

                  // ✅ If empty → default to 0
                  if (value === "") {
                    setFormData((prev) => ({ ...prev, extraHour: 0 }));
                    return;
                  }
                  const val = Number(value);
                  // ✅ Accept only valid range
                  if (val >= -1 && val <= 2) {
                    setFormData((prev) => ({ ...prev, extraHour: val }));
                  }
                }}
              />
            </MDBTooltip>
          </div>


          {/* Password */}
          <div className="col-md-12 mb-3">
            <MDBInput
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              size="lg"
              required
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>


          {/* Submit */}
          {/* <MDBCard className="col-12 text-center p-3 border-0"> */}
            <MDBBtn className="btn btn-primary w-100 py-2" onClick={handleSubmit} disabled={!isFormValid}>
              Register
            </MDBBtn>
          </MDBCard>
        {/* </MDBCard> */}

        {/* Right Side Image */}
        <div className="col-md-6 d-none d-md-block text-center my-auto">
          <LibraryPolicy />
          {/* <img
            src=""
            alt="Library"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "95%", objectFit: "cover" }}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
