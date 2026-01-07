// src/requests/ShiftSeatChangeRequestPopup.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import config from "../config";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import MultiSelect from "../MultiSelect";

const ShiftSeatChangeRequestPopup = ({ userId, show, onClose, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  // Fetch available shifts
  useEffect(() => {
    if (!show) return;
    axiosInstance
      .get(`/shifts`)
      .then((res) => setShifts(res.data))
      .catch(() => setShifts([]));
  }, [show]);

  // Fetch seats when shift changes
  const fetchSeats = async (shiftNumber) => {
    if (!shiftNumber) return;
    try {
      const response = await axiosInstance.get(
        `/seats/with-status?shiftNumber=${shiftNumber}`
      );
      setSeats(response.data || []);
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

  useEffect(() => {
    if (selectedShift) fetchSeats(selectedShift);
  }, [selectedShift]);

  const handleShiftSelect = (selectedList) => {
    setSelectedOptions(selectedList);
    const selectedNames = selectedList.map((item) => item.name).join(",");
    setSelectedShift(selectedNames);
  };

  const handleRemove = (selectedList) => {
    setSelectedOptions(selectedList);
    const selectedNames = selectedList.map((item) => item.name).join(",");
    setSelectedShift(selectedNames);
  };

  const handleSubmit = async () => {
    if (!selectedShift || !selectedSeat) {
      setError("Please select both shift and seat before submitting.");
      return;
    }

   // const details = `Shift change request to ${selectedShift},${selectedSeat}`;
   const details = `Shift change request to [${selectedShift}] -> seat:${selectedSeat}`;

    setLoading(true);
    try {
      await axiosInstance.post(
        `/requests/${userId}?type=SEAT_SHIFT&details=${encodeURIComponent(
          details
        )}`
      );
      alert("✅ Shift/Seat change request submitted for admin approval. Pay Rs: 50 to get it approved");
      setSelectedShift("");
      setSelectedSeat("");
      setSelectedOptions([]);
      onSubmitted && onSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
      setError("❌ Failed to send request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBModal open={show} setOpen={() => {}} staticBackdrop tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Request Shift / Seat Change</MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={onClose} />
          </MDBModalHeader>

          <MDBModalBody>
            <p>
              Please select your desired <b>Shift</b> and <b>Seat</b>. Once
              submitted, your request will go for admin approval.
            </p>

            {/* 🔹 MultiSelect for Shifts */}
            <div className="col-md-12 mb-3">
              <MultiSelect
                options={shifts}
                selectedValues={selectedOptions}
                onSelect={handleShiftSelect}
                onRemove={handleRemove}
                label="Select Shifts"
                name="shift"
              />
            </div>

            {/* 🔹 Seat Dropdown */}
            <div className="col-md-12 mb-3">
              <select
                id="seat"
                name="seat"
                className="form-select"
                value={selectedSeat}
                onChange={(e) => setSelectedSeat(e.target.value)}
                onClick={() => fetchSeats(selectedShift)}
                required
              >
                <option value="">Select a seat</option>
                {seats
                  .filter((seat) => !seat.registered)
                  .map((seat) => (
                    <option key={seat.id} value={seat.seatNo}>
                      {seat.seatName}
                    </option>
                  ))}
              </select>
            </div>

            {error && <p className="text-danger">{error}</p>}
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              Cancel
            </MDBBtn>
            <MDBBtn onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ShiftSeatChangeRequestPopup;
