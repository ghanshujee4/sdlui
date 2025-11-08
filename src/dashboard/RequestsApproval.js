import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import GrowLoader from "../utils/Growloader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RequestsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Verify admin login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") navigate("/");
  }, [navigate]);

  // 🔹 Fetch all requests
  const fetchRequests = () => {
    setLoading(true);
    axios
      .get(`${config.BASE_URL}/requests`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        toast.error("Failed to fetch requests");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 Approve or Reject Request
  const handleAction = (id, action) => {
    setLoading(true);
    axios
      .put(`${config.BASE_URL}/requests/${action}/${id}`)
      .then(() => {
        toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
        fetchRequests();
      })
      .catch(() => toast.error("Failed to update request"))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <GrowLoader />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Requests Approval</h2>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admindashboard")}
      >
        ← Back to Dashboard
      </button>

      {requests.length === 0 ? (
        <div className="alert alert-info text-center">
          No requests found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Request Type</th>
                <th>Details</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>
                      {req.user ? (
                        <>
                          <b>{req.user.name}</b>
                          <br />
                          <small>{req.user.email}</small>
                        </>
                      ) : (
                        "Unknown User"
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          req.type === "DEACTIVATION"
                            ? "bg-danger"
                            : "bg-info"
                        }`}
                      >
                        {req.type}
                      </span>
                    </td>
                    <td>{req.details || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          req.status === "PENDING"
                            ? "bg-warning text-dark"
                            : req.status === "APPROVED"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td>{req.createdAt ? req.createdAt.split("T")[0] : "N/A"}</td>
                    <td>
                      {req.status === "PENDING" ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleAction(req.id, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(req.id, "reject")}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestsApproval;
