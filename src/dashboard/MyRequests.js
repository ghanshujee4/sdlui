import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Fetch user requests
  const fetchRequests = async () => {
    if (!userId) {
      setMessage("⚠️ Please login first.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${config.BASE_URL}/requests/${userId}`);
      setRequests(res.data);
      setMessage("");
    } catch (err) {
      console.error("Error fetching requests:", err);
      setMessage("❌ Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Helper to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      case "PENDING":
      default:
        return "warning";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading your requests...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <MDBCard className="shadow-2">
        <MDBCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📋 My Requests</h4>
          <MDBBtn color="light" size="sm" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </MDBBtn>
        </MDBCardHeader>

        <MDBCardBody>
          {message && <div className="alert alert-info">{message}</div>}

          {requests.length === 0 ? (
            <p className="text-center text-muted my-4">
              You haven’t submitted any requests yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Request Type</th>
                    <th>Details</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={req.id}>
                      <td>{index + 1}</td>
                      <td>
                        {req.type === "SEAT_SHIFT" ? "Seat/Shift Change" : "Deactivation"}
                      </td>
                      <td>{req.details}</td>
                      <td>{formatDate(req.createdAt)}</td>
                      <td>
                        <MDBBadge color={getStatusColor(req.status)} pill className="px-3 py-2">
                          {req.status}
                        </MDBBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default MyRequests;
