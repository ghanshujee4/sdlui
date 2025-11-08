import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config";
import MultiSelect from "./MultiSelect";
import {
  MDBContainer,
  MDBCard,
  MDBBtn,
} from 'mdb-react-ui-kit';

const SeatBooking = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]); // Multi-select shifts
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seatMessage, setSeatMessage] = useState("");

  // Fetch shifts on mount
  useEffect(() => {
    axios.get(`${config.BASE_URL}/shifts`)
      .then((response) => setShifts(response.data))
      .catch((error) => console.error("Error fetching shifts:", error));
  }, []);

  // Fetch seats for all selected shifts
  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedShifts.length === 0) {
        setSeats([]);
        setSeatMessage("Select shifts to see seats.");
        return;
      }
      setLoading(true);
      const shiftQuery = selectedShifts.map(s => s.name).join(",");
      try {
        const response = await axios.get(`${config.BASE_URL}/seats/with-status?shiftNumber=${shiftQuery}`);
        setSeats(Array.isArray(response.data) ? response.data : []);
        setSeatMessage(response.data.length === 0 ? "No seats found for selected shifts." : "");
      } catch (error) {
        setSeats([]);
        setSeatMessage("Error fetching seats.");
      }
      setLoading(false);
      setSelectedSeats([]); // Reset selected seats on shift change
    };
    fetchSeats();
  }, [selectedShifts]);

  // Multi-select handler
  const handleShiftSelect = (selectedList) => {
    setSelectedShifts(selectedList);
    setSelectedSeats([]); // Reset selected seats if shifts change
  };
  const handleRemove = (selectedList) => {
    setSelectedShifts(selectedList);
    setSelectedSeats([]); // Reset selected seats if shifts change
  };

  // Seat selection toggle
  const handleSeatClick = (seat) => {
    setSelectedSeats(prev =>
      prev.some(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  return (
    <MDBContainer>
      <MDBCard className="mb-4 p-4 shadow-lg">
        <h3 className="form-label gradient-text">Select Shifts:</h3>
        <MultiSelect
          options={shifts}
          selectedValues={selectedShifts}
          onSelect={handleShiftSelect}
          onRemove={handleRemove}
          label="Shifts"
          name="shift"
        />
        <small className="text-muted mt-1 d-block">
          (Choose one or more shifts. Seats for all will be shown together.)
        </small>
      </MDBCard>

      <MDBCard className="p-4 shadow-lg">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : seatMessage ? (
          <div className="text-center text-muted py-3">
            <h5>{seatMessage}</h5>
          </div>
        ) : (
          <>
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              {seats.map((seat) => {
                const isSelected = selectedSeats.some(s => s.id === seat.id);
                return (
                  <MDBBtn
                    key={seat.id}
                    onClick={() => !seat.registered && handleSeatClick(seat)}
                    disabled={seat.registered}
                    color={
                      seat.registered ? "danger" :
                      isSelected ? "warning" : "success"
                    }
                    outline={isSelected}
                    rounded
                    className={`seat-btn shadow-lg py-3 px-4 mb-2`}
                    style={{
                      color: seat.registered ? "#fff" : isSelected ? "#000" : "#fff",
                      fontWeight: "bold",
                      minWidth: "120px",
                      boxShadow: isSelected ? "0 0 12px 2px #ffe066" : "0 2px 8px rgba(0,0,0,0.09)",
                      opacity: seat.registered ? 0.9 : 1,
                      cursor: seat.registered ? "not-allowed" : "pointer"
                    }}
                    aria-pressed={isSelected}
                  >
                    <h5 className="mb-1">{seat.seatName}</h5>
                    <small>
                      {seat.registered
                        ? <span style={{ letterSpacing: 1 }}>Registered</span>
                        : isSelected
                          ? <strong>Selected</strong>
                          : "Available"}
                    </small>
                  </MDBBtn>
                );
              })}
            </div>
            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
              <div className="mt-4 text-center">
                <h6 className="mb-2 text-success"><b>Selected Seat(s):</b></h6>
                {selectedSeats.map(seat =>
                  <span key={seat.id} className="badge bg-warning text-dark mx-1 p-2">
                    <b>{seat.seatName}</b>
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </MDBCard>
    </MDBContainer>
  );
};

export default SeatBooking;