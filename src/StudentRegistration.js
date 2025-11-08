// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "./config"; // Import the config file
// import { useNavigate } from "react-router-dom";
// // import imagePath from './images/SDL_pic.jpg';
// import MultiSelect from "./MultiSelect";
// import {
//   MDBBtn,
//   MDBCard,
//   MDBInput,
//   MDBTextArea,
//   MDBTooltip
// }
//   from 'mdb-react-ui-kit';
// const StudentRegistration = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     age: "",
//     mobile: "",
//     address: "",
//     purpose: "",
//     shift: [],
//     seat: "",
//     adhar: "",
//     password: "",
//     admissionDate: new Date().toISOString().split("T")[0],
//     extraHour: "",
//   });
//   const anyday = (date) => date.toISOString().split("T")[0];
//   const today = anyday(new Date()); // Get current date in YYYY-MM-DD format
//   const [shifts, setShifts] = useState([]);
//   const [seats, setSeats] = useState([]);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const [selectedShift, setSelectedShift] = useState('');
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fileName, setFileName] = useState("No Aadhar uploaded");
//   // const [updatedshift, setUpdatedshift] = useState([]);
//   const [adharFile, setAdharFile] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) {
//       // File is optional
//       setFileName("No Aadhar uploaded");
//       setErrors({ ...errors, adharFile: "" });
//       setAdharFile(null);
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
//     if (!allowedTypes.includes(file.type)) {
//       setErrors({ ...errors, adharFile: "Only JPG, PNG, or PDF files are allowed" });
//       setAdharFile(null);
//       return;
//     }

//     setFileName(file.name);
//     setErrors({ ...errors, adharFile: "" });
//     setAdharFile(file);
//   };


//   // Fetch shifts and seats
//   useEffect(() => {
//     axios
//       .get(`${config.BASE_URL}/shifts`)
//       .then((response) =>
//         setShifts(response.data))
//       .catch((error) => console.error("Error fetching shifts:", error));
//   }, []);

//   // Fetch available seats based on selected shift
//   const getSeatResponse = () => {
//     axios
//       .get(`${config.BASE_URL}/seats/with-status?shiftNumber=${selectedShift}`)
//       .then((response) =>
//         setSeats(response.data))
//       .catch((error) => console.error("Error fetching seats:", error));
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // setAdmissionDate(e.target.value)
//     setFormData({ ...formData, [name]: value });

//     if (name === "admissionDate") {
//       setFormData({ ...formData, admissionDate: new Date(value).toISOString().split("T")[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }

//     // Clear errors dynamically when user modifies input
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }

//     if (name === "shift") {
//       setSelectedShift(value);
//     }
//   };

//   const validateMobileUnique = async (mobile) => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/users/check-mobile?mobile=${encodeURIComponent(mobile)}`);
//       const data = await response.json();
//       return data.unique;
//       console.log(data.message)
//     } catch (error) {
//       console.error("Error validating mobile:", error);
//       return false;
//     }
//   };

//   const validateEmailUnique = async (email) => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`);
//       const data = await response.json();
//       return data.unique;
//     } catch (error) {
//       console.error("Error validating email:", error);
//       return false;
//     }
//   };

//   // Validate the form fields
//   const validateForm = () => {
//     let tempErrors = {};
//     let isValid = true;

//     // Name validation
//     if (!formData?.name) {
//       tempErrors.name = "Name is required";
//       isValid = false;
//     }

//     // Email validation
//     if (!formData?.email) {
//       tempErrors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
//       tempErrors.email = "Email is invalid";
//       isValid = false;
//     }

//     // Adhar validation
//     if (!formData?.adhar) {
//       tempErrors.adhar = "Aadhaar number is required";
//       isValid = false;
//     } else if (!/^[2-9]{1}[0-9]{11}$/.test(formData?.adhar)) {
//       tempErrors.adhar = "Aadhaar number is invalid or must be 12 digits";
//       isValid = false;
//     }

//     // Mobile validation
//     if (!formData?.mobile) {
//       tempErrors.mobile = "Mobile number is required";
//       isValid = false;
//     } else if (!/^\d{10}$/.test(formData?.mobile)) {
//       tempErrors.mobile = "Mobile number must be 10 digits";
//       isValid = false;
//     }

//     // Age validation
//     if (!formData?.age) {
//       tempErrors.age = "Age is required";
//       isValid = false;
//     } else if (formData?.age <= 0) {
//       tempErrors.age = "Age must be a positive number";
//       isValid = false;
//     }

//     // Address validation
//     if (!formData?.address) {
//       tempErrors.address = "Address is required";
//       isValid = false;
//     } else if (formData.address.length < 50) {
//       tempErrors.address = "Please provide complete Address (50 char)";
//       isValid = false;
//     }

//     // Shift validation
//     if (!formData?.shift) {
//       tempErrors.shift = "Shift is required";
//       isValid = false;
//     }

//     // Seat validation
//     if (!formData?.seat) {
//       tempErrors.seat = "Seat is required";
//       isValid = false;
//     }
//     if (!formData.password.trim() || formData.password.includes(" ")) tempErrors.password = "Password cannot contain spaces";

//     setErrors(tempErrors);
//     return isValid;
//   };


//   const handleShiftSelect = (selectedList) => {
//     setFormData({ ...formData, shift: selectedList });
//     const selectedNames = selectedList.map(item => item.name).join(", "); // Join selected shift names
//     setSelectedShift(selectedNames); // Update selectedShift state
//   };

//   const handleRemove = (selectedList) => {
//     setFormData({ ...formData, shift: selectedList });
//     const selectedNames = selectedList.map(item => item.name).join(", ");
//     setSelectedShift(selectedNames);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form fields
//     if (!validateForm()) return;

//     const formDataToSend = new FormData();

//     // Append Aadhar card file
//     if (adharFile) {
//       formDataToSend.append("adharCard", adharFile);
//     }

//     // Append user data as a JSON string
//     const userData = {
//       name: formData?.name,
//       email: formData?.email,
//       age: formData?.age,
//       mobile: formData?.mobile,
//       adhar: formData?.adhar,
//       address: formData?.address,
//       purpose: formData?.purpose,
//       shift: formData?.shift.map(s => s.name).join(","), // Convert shift array to "1,2"
//       seat: formData?.seat,
//       password: formData?.password,
//       admissionDate: formData?.admissionDate,
//       extraHour: formData?.extraHour,
//     };

//     formDataToSend.append("user", new Blob([JSON.stringify(userData)], { type: "application/json" }));
//     console.log("Sending Data:", Object.fromEntries(formDataToSend.entries()));

//     try {
//       await axios.post(`${config.BASE_URL}/users`, formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("Student registered successfully!");
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       if (error.response) {
//         // The request was made, and the server responded with an error status code
//         console.error("Server Error:", error.response.data);
//         setMessage(error.response.data?.message || "Error registering student.");
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error("No response received:", error.request);
//         setMessage("No response from server. Please try again.");
//       } else {
//         // Other unexpected errors
//         console.error("Unexpected Error:", error.message);
//         setMessage("Something went wrong. Please try again.");
//       }
//     }
//   };

//   // Validate form fields and update `isFormValid`
//   useEffect(() => {
//     const isNameValid = formData?.name.trim() !== "";
//     const isEmailValid = formData?.email.trim() !== "" && !errors.email;
//     const isAgeValid = formData?.age.trim() !== "";
//     const isMobileValid = formData?.mobile.trim() !== "" && !errors.mobile;
//     const isAddressValid = formData?.address.trim().length >= 50;
//     const isPurposeValid = formData?.purpose.trim() !== "";
//     const isAadharValid = formData?.adhar.trim() !== "" && !errors.adhar;
//     const isPasswordValid = formData?.password.trim() !== "" && !formData?.password.includes(" ");
//     const isShiftValid = formData?.shift.length > 0;
//     const isSeatValid = formData?.seat.trim() !== "";

//     // All fields must be valid
//     setIsFormValid(
//       isNameValid &&
//       isEmailValid &&
//       isAgeValid &&
//       isMobileValid &&
//       isAddressValid &&
//       isPurposeValid &&
//       // isAadharValid &&
//       isPasswordValid &&
//       isShiftValid &&
//       isSeatValid
//     );
//   }, [formData, errors]);

//   useEffect(() => {
//     if (selectedShift) {
//       getSeatResponse();
//     }
//   }, [selectedShift]);


//   useEffect(() => {
//     setFormData((prevData) => ({ ...prevData, admissionDate: today }));
//   }, []);

//   useEffect(() => {
//     const isFormFilled = Object.values(formData).every(value => {
//       if (Array.isArray(value)) return value.length > 0; // Ensure arrays are not empty
//       return value && value.toString().trim() !== ""; // Ensure non-array fields are not empty
//     });

//     const hasNoErrors = Object.values(errors).every(error => !error || error.trim() === "");

//     setIsFormValid(isFormFilled && hasNoErrors);
//   }, [formData, errors]);


//   return (
//     <div className="container bgimages">
//       <div className="row">
//         {message && <div className="alert alert-info">{message}</div>}

//         <MDBCard className=" col-sm-12 col-md-6">
//           <h3 className="text-center gradient-text">Join Lotus @ SDL</h3>
//           <div className="col-md-12 mb-3">
//             <MDBInput
//               label="Name"
//               type="text"
//               id="name"
//               name="name"
//               value={formData?.name}
//               onChange={handleChange}
//               required
//               size="lg"
//             />
//             {errors.name && <div className="text-danger">{errors.name}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="email"
//               label="Email"
//               id="email"
//               name="email"
//               value={formData?.email}
//               onChange={handleChange}
//               onBlur={async () => {
//                 const isUnique = await validateEmailUnique(formData?.email);
//                 setErrors({ ...errors, email: isUnique ? " " : "Email already exists" });
//               }}
//               // onBlur={handleEmailFocus}
//               required
//               size="lg"
//             />
//             {errors.email && <div className="text-danger">{errors.email}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="number"
//               id="age"
//               name="age"
//               value={formData?.age}
//               onChange={handleChange}
//               required
//               size="lg"
//               label="Age"
//             />
//             {errors.age && <div className="text-danger">{errors.age}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="text"
//               id="mobile"
//               name="mobile"
//               maxLength={10}
//               value={formData?.mobile}
//               onChange={(e) => {
//                 let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
//                 if (value.length > 10) {
//                   value = value.slice(0, 10); // Enforce max length
//                 }
//                 // setFormData({ ...formData, mobile: value }); // Update state
//                 handleChange(e)
//               }}
//               onBlur={async () => {
//                 const isUnique = await validateMobileUnique(formData?.mobile);
//                 setErrors({ ...errors, mobile: isUnique ? " " : "Mobile number already exists" });
//               }}
//               required
//               size="lg"
//               label="Mobile"
//             />
//             {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="text"
//               id="purpose"
//               name="purpose"
//               value={formData?.purpose}
//               onChange={handleChange}
//               required
//               size="lg"
//               label="Purpose"
//             />
//             {errors.purpose && <div className="text-danger">{errors.purpose}</div>}
//           </div>

//           {/* <div className="col-md-12 mb-3">
//             <MDBInput
//               type="text"
//               id="adhar"
//               name="adhar"
//               value={formData?.adhar}
//               onChange={(e) => {
//                 let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
//                 if (value.length > 12) {
//                   value = value.slice(0, 12); // Enforce max length
//                 }
//                 setFormData({ ...formData, adhar: value });
//               }}

//               onBlur={!formData?.adhar ? null : async () => {
//                 if (formData?.adhar.length !== 12) {
//                   setErrors({ ...errors, adhar: "Aadhaar number must be 12 digits" });
//                   return;
//                 }
//                 setErrors({ ...errors, adhar: "" });
//               }
//               }
//               required
//               size="lg"
//               label="Aadhaar Number"
//             />
//             {errors.adhar && <div className="text-danger">{errors.adhar}</div>}
//           </div> */}
//           <label htmlFor="adharUpload" className="form-label">Upload Aadhar Card</label>
//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="file"
//               id="adharUpload"
//               name="adharUpload"
//               accept="image/jpeg,image/png,application/pdf"
//               onChange={handleFileChange}
//               className="form-control"
//             />
//             <small className="form-text text-muted">{fileName}</small>
//             {errors.adharFile && <div className="text-danger">{errors.adharFile}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="text"
//               id="password"
//               name="password"
//               value={formData?.password}
//               onChange={handleChange}
//               required
//               size="lg"
//               label="Password"
//             />
//             {errors.password && <div className="text-danger">{errors.password}</div>}
//           </div>

//           <div className="col-md-12 mb-3">
//             <MDBTextArea
//               id="address"
//               name="address"
//               rows="3"
//               value={formData?.address}
//               onChange={handleChange}
//               required
//               label="Enter Complete Address"
//               size="lg"
//             />
//             {errors.address && <div className="text-danger">{errors.address}</div>}
//           </div>
//           <div className="col-md-12 mb-3">
//             <MDBInput
//               type="date"
//               label="Select Admission Date"
//               value={formData?.admissionDate}
//               onChange={handleChange}
//               className="w-100"
//               name="admissionDate"
//             />
//           </div>
//           {/* <div className="col-md-12 mb-3">
//             <MDBInput
//               type="date"
//               label="Inquiry Date"
//               value={today}
//               onChange={handleChange}
//               className="w-100"
//               disabled
//             />
//           </div> */}
//           <div className="col-md-12 md-3">
//             <MultiSelect
//               options={shifts}
//               selectedValues={formData.shift}
//               onSelect={handleShiftSelect} // Updated handler
//               onRemove={handleRemove} // Updated handler
//               error={errors.shift}
//               label="Select Shifts:"
//               name="shift"
//               key={formData.shift}
//             />

//             <div>
//               <p>Selected Shifts: {formData?.selectedShift}</p>
//             </div>
//             {errors.shift && <div className="text-danger">{errors.shift}</div>}
//           </div>
//           <div className="col-md-12 mb-3">
//             <select
//               id="seat"
//               name="seat"
//               className="form-select"
//               key={seats.id}
//               value={formData?.seat}
//               onChange={handleChange}
//               onClick={getSeatResponse}
//               required
//             >
//               <option value="">Select a seat</option>
//               {seats
//                 .filter((seat) => !seat.registered)
//                 .map((seat, index) => (
//                   <option key={seat.id || `seat-${index}`} value={seat.seatNo}>
//                     {seat.seatName || `Seat ${seat.seatNo}`}
//                   </option>
//                 ))}
//             </select>
//             {errors.seat && <div className="text-danger">{errors.seat}</div>}
//           </div>
//           <div className="col-md-12 mb-3">
//             <MDBTooltip tag="span" wrapperProps={{ className: 'd-block' }} title="Enter the number of extra hours apart from regular shift. ₹100/hour">
//               <MDBInput
//                 type="number"
//                 id="extraHour"
//                 name="extraHour"
//                 value={formData?.extraHour}
//                 onChange={handleChange}
//                 size="lg"
//                 label="Enter Extra Hour"
//               />
//             </MDBTooltip>
//           </div>


//           <MDBCard className="col-12 text-center md-3">
//             <MDBBtn type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={!isFormValid}>
//               Register
//             </MDBBtn>
//           </MDBCard>
//         </MDBCard>
//         <div className="col-6" style={{ backgroundImage: `url(${''})`, overflow: "auto", height: "100%" }}>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentRegistration;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "./config";
import { useNavigate } from "react-router-dom";
import MultiSelect from "./MultiSelect";
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

  // ✅ Fetch Shifts
  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/shifts`)
      .then((res) => setShifts(res.data))
      .catch((err) => console.error("Error fetching shifts:", err));
  }, []);

  // ✅ Fetch Seats by Shift
  const getSeatResponse = useCallback(() => {
    if (!selectedShift) return;
    axios
      .get(`${config.BASE_URL}/seats/with-status?shiftNumber=${selectedShift}`)
      .then((res) => setSeats(res.data))
      .catch((err) => console.error("Error fetching seats:", err));
  }, [selectedShift]);

  useEffect(() => {
    getSeatResponse();
  }, [selectedShift, getSeatResponse]);

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
      const response = await fetch(
        `${config.BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      return data.unique;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  };

  // ✅ Mobile Unique Validation
  const validateMobileUnique = async (mobile) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/users/check-mobile?mobile=${encodeURIComponent(mobile)}`
      );
      const data = await response.json();
      return data.unique;
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
      await axios.post(`${config.BASE_URL}/users`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("🎉 Student registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Registration failed. Please try again.");
    }
  };

  // ✅ Check form validity
  useEffect(() => {
    const hasNoErrors = Object.values(errors).every((err) => !err);
    const filled = Object.values(formData).every((val) =>
      Array.isArray(val) ? val.length > 0 : val?.toString().trim() !== ""
    );
    setIsFormValid(filled && hasNoErrors);
  }, [formData, errors]);

  // ✅ Render
  return (
    <div className="container">
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
                <MDBIcon fas icon="cloud-upload-alt" style={{ color: "#715fc0" }} />
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
            fas
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
            />
            {errors.shift && <div className="text-danger">{errors.shift}</div>}
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
              <option value="">Select a seat</option>
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

          {/* Extra Hour */}
          {/* <div className="col-md-12 mb-3">
            <MDBTooltip tag="span" wrapperProps={{ className: "d-block" }} title="₹100/hour for extra time">
              <MDBInput
                type="number"
                id="extraHour"
                name="extraHour"
                max-Length={2}
                value={formData.extraHour}
                onChange={handleChange}
                size="lg"
                label="Enter Extra Hour"
              />
            </MDBTooltip>
          </div> */}

          <div className="col-md-12 mb-3">
  <MDBTooltip
    tag="span"
    wrapperProps={{ className: "d-block" }}
    title="Allowed range: -1 to +2 hours. ₹100/hour for extra time."
    subTitle="(Use -1 for no extra hours)"
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
      value={formData.extraHour ?? 0} // default to 0
      onChange={(e) => {
        const val = Number(e.target.value);
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
          <MDBCard className="col-12 text-center p-3 border-0">
            <MDBBtn className="btn btn-primary w-100 py-2" onClick={handleSubmit} disabled={!isFormValid}>
              Register
            </MDBBtn>
          </MDBCard>
        </MDBCard>

        {/* Right Side Image */}
        <div className="col-md-6 d-none d-md-block text-center my-auto">
          <LibraryPolicy/>
          <img
            src=""
            alt="Library"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "95%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
