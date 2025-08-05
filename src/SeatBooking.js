import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard
} from 'mdb-react-ui-kit';
import axios from "axios";
import config from "./config";

const SeatBooking = () => {
  const [seats, setSeats] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [shifts, setShifts] = useState([]);

  // Fetch shifts on component mount
  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/shifts`)
      .then((response) => setShifts(response.data))
      .catch((error) => console.error("Error fetching shifts:", error));
  }, []);

  // Handle shift selection and fetch seats
  const handleChange = (e) => {
    const shiftValue = e.target.value;
    setSelectedShift(shiftValue); // Update the selected shift state
    console.log("Selected Shift:", shiftValue); // Log the selected shift

    // Fetch seats for the selected shift
    axios
      .get(`${config.BASE_URL}/seats/with-status?shiftNumber=${shiftValue}`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.error("Error fetching seats:", error));
  };

  const formatShiftName = (shiftName) => {
    if (!shiftName) return "Ask SDL"; // Handle undefined shift names
    if (shiftName === "1") return "1st Shift";
    if (shiftName === "2") return "2nd Shift";
    if (shiftName === "3") return "3rd Shift";
    return `${shiftName}th Shift`; // Default for other numbers
  };
  

  return (
    <MDBContainer fluid>
      {/* Shift Selection */}
      <MDBCard className="col-md-12 mb-4 p-3">
        <h3  className="form-label gradient-text">Select Required Shift:</h3>
        <select
          id="shift"
          name="shift"
          className="form-select"
          value={selectedShift}
          onChange={handleChange}
        >
          <option value="">Select a shift</option>
          {shifts.map((shift) => (
           <option key={shift.id} value={shift.name}>
           {formatShiftName(shift.name)}
         </option>
          ))}
        </select>
      </MDBCard>

      {/* Seat Buttons */}
      <MDBCard className="col-12">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {seats.map((seat) => (
            <button
              key={seat.seatName}
              className={`btn ${
                seat.registered ? 'btn-danger' : 'btn-success'
              } rounded-pill shadow`}
              style={{
                // width: '120px',
                // height: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              }}
            >
              <h4>{seat.seatName} </h4>
              {seat.registered ? 'Registered' : 'Available'}
            </button>
          ))}
        </div>
      </MDBCard>
    </MDBContainer>
  );
};

export default SeatBooking;