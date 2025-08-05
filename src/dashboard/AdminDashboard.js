import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { handleStatus } from './Dashboard'
import MultiSelect from "./../MultiSelect";
import "../assets/css/style.css"
import { useNavigate } from "react-router-dom";
import GrowLoader from "../utils/Growloader"; // Import loader
import { Card } from "react-bootstrap";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // List of all users
  const [search, setSearch] = useState(""); // Search term
  const [editingUser, setEditingUser] = useState(null); // Current user being edited
  const [editFormData, setEditFormData] = useState({}); // Data for edit form
  const [message, setMessage] = useState("");
  const [shifts, setShifts] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState('');
  const [paymentDueDates, setPaymentDueDates] = useState({}); // Store due dates for each user
  const [showRegisteredOnly, setShowRegisteredOnly] = useState(false);
  const [filterMode, setFilterMode] = useState("all"); 
  // Possible values: "all","registered","unregistered"
  
  useEffect(() => {
    // Fetch all users
    if (localStorage.getItem("role") === "admin") {
      axios
        .get(`${config.BASE_URL}/users`)
        .then((response) => {
          setUsers(response.data)
          setLoading(false)
          setCount(response.data.length)
          console.log(count)
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/shifts`)
      .then((response) => setShifts(response.data))
      .catch((error) => console.error("Error fetching shifts:", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // assuming the role is stored in localStorage
    if (!token || role !== "admin") {
      navigate("/"); // Redirect to home or login if not admin
    }
  }, [navigate]);

  // Fetch the payment due date for each user (assuming you have an endpoint)
  useEffect(() => {
    users.forEach((user) => {
      axios
        .get(`${config.BASE_URL}/payments/${user.id}`)
        .then((response) => {
          setPaymentDueDates((prev) => ({
            ...prev,
            [user.id]: response.data.duedate,
          }));
        })
        .catch((error) => console.error("Error fetching payment due date:", error));
    });
  }, [users]);



  const getSeatResponse = () => {
    axios
      .get(`${config.BASE_URL}/seats/with-status?shiftNumber=${selectedShift}`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.error("Error fetching seats:", error));
  }

  const handleShiftSelect = (selectedList) => {
    const selectedNames = selectedList.map(item => item.name).join(",");
    setEditFormData({ ...editFormData, shift: selectedNames }); // Update editFormData
    setSelectedShift(selectedNames);
  };
  
  const handleRemove = (selectedList) => {
    const selectedNames = selectedList.map(item => item.name);
    setEditFormData({ ...editFormData, shift: selectedNames }); // Update editFormData
    setSelectedShift(selectedNames);
  };
  
  // Delete a user
  const deleteUser = (id) => {
    axios
      .delete(`${config.BASE_URL}/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user?.id !== id));
        setMessage("User deleted successfully.");
      })
      .catch((error) => console.error("Error deleting user:", error));

  };

  // Start editing a user
  const startEditing = (user) => {
    setEditingUser(user?.id);
    setEditFormData({ ...user });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleStatus = (id) => {
    axios
      .post(`${config.BASE_URL}/users/${id}`)
      .then((response) => {
        setMessage(`User ${id} details updated successfully!`);
        setTimeout(() => {
          // Optionally, you could redirect or keep the user on the same page
        }, 2000);
      })
      .catch((error) => {
        setMessage("Error updating user details.");
        console.error("Error updating user details:", error);
      });

  }
  // Save edited user
  const saveEdit = () => {
    const updatedUser = { ...editFormData };
    
    // Convert shift array to comma-separated string if backend expects a string
    if (Array.isArray(updatedUser.shift)) {
      updatedUser.shift = updatedUser.shift.join(",");
    }
  
    axios
      .put(`${config.BASE_URL}/users/update/${editingUser}`, updatedUser)
      .then((response) => {
        setUsers(users.map((user) => user.id === editingUser ? response.data : user));
        setEditingUser(null);
        setMessage("User updated successfully.");
      })
      .catch((error) => console.error("Error updating user:", error));
  };
  
  const filteredUsers = users
  .slice() // make a copy to avoid mutating the original array
  .sort((a, b) => {
    // Ensure both seat values are valid numbers for comparison
    const seatA = parseInt(a?.seat || 0, 10);
    const seatB = parseInt(b?.seat || 0, 10);
    return seatA - seatB;
  })
  .filter(user =>
    `${user?.name} ${user?.email} ${user?.id} ${user?.seat} ${user?.shift}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter(user =>
    filterMode === "all" ||
    (filterMode === "registered" && user?.isRegistered === 'Y') ||
    (filterMode === "unregistered" && user?.isRegistered !== 'Y')
  );

  const registeredUsers = users.filter(user => user?.isRegistered === 'Y');
  const unregisteredUsers = users.filter(user => user?.isRegistered !== 'Y');
  
  // Check if payment due date is overdue
  const isPaymentOverdue = (duedate) => {
    const today = new Date();
    const dueDate = new Date(duedate);
    return today > dueDate;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <GrowLoader />
      </div>
    );
  }

  const navigateToDue = () => {
    navigate("../payments/overduePayments")
  }

  const handleUserIsRegistered = () => {
    setFilterMode(prevMode => 
        prevMode === "all" ? "registered" : prevMode === "registered" ? "unregistered" : "all"
    );
};

  return (
    <>
    <div className="container-fluid mt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3 col-sm-11 float-left">
        <input
          type="text"
          className="form-control"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="col-sm-2 float-left"><Card className={`badge bg-${filterMode === "registered" ? 'success' : filterMode === "unregistered" ? 'danger': 'secondary'} text-wrap select2-container`} onClick={handleUserIsRegistered} style={{ 'fontSize': '22px', cursor:'pointer' }}>{filterMode === "all" ? "Show Registered" :
    filterMode === "registered" ? "Show Unregistered" : 
   "Show All Users"}</Card> <a>{(filterMode === "registered").length}</a>
   </div>
      <div className="col-sm-2 float-left"><Card className="badge bg-primary text-wrap select2-container" onClick={navigateToDue} style={{ 'fontSize': '22px', cursor:'pointer' }}>Overdue Students</Card></div>
      <div className="col-sm-2 float-left">
        <Card className="badge bg-primary text-wrap select2-container" style={{ 'fontSize': '22px' }} onClick={() => navigate("/seatfullInfopage")}>
          Total Users {" "}
        {count}
        </Card>
      </div>
      <div className="col-sm-2 float-left">
  <Card className="badge bg-success text-wrap select2-container" style={{ fontSize: '22px', cursor: 'pointer' }} onClick={() => navigate("/seatfullInfopage")}>
    Registered: {registeredUsers?.length}
  </Card>
  {/* <Card className="badge bg-success text-wrap select2-container" style={{ fontSize: '22px' }} }>
    Seats: {seats?.length}
  </Card> */}
</div>

<div className="mb-3 col-sm-2 float-left">
  <Card className="badge bg-danger text-wrap select2-container" style={{ fontSize: '22px' }}>
    Unregistered: {unregisteredUsers.length}
  </Card>
</div>
<div className="table-responsive">
      <table className="table table-striped table-responsive-sm">
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }}>User ID</th>

            <th>Name</th>
            <th>Admission Date</th>
            <th>Email</th>
            <th>Password</th>
            <th>Mobile</th>
            <th>Shift</th>
            <th>Seat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {filteredUsers.map((user) => {
            const dueDate = paymentDueDates[user?.id];
            return (
              <tr key={user?.id} >
                <td style={{
                  backgroundColor: dueDate && isPaymentOverdue(dueDate) ? 'red' : 'transparent',
                  color: dueDate && isPaymentOverdue(dueDate) ? 'white' : 'black',
                }}>
                  <a onClick={(e) => {
                    e.preventDefault();
                    navigate(`/payments/${user?.id}`);
                  }}
                    style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                    href="#"
                  >
                    {user?.id}
                  </a>
                </td>
                <td>
                  {editingUser === user?.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="form-control"
                    // onClick={updatePayment}

                    />
                  ) : (
                    user?.name
                  )}

                </td>
                <td>
                  {editingUser === user?.id ? (
                    <input
                      type="date"
                      name="admissionDate"
                      value={editFormData.admissionDate}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  ) : (
                    user?.admissionDate
                  )}

                </td>
                <td>
                  {editingUser === user?.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  ) : (
                    user?.email
                  )}
                </td>
                <td>
                  {editingUser === user?.id ? (
                    <input
                      type="text"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  ) : (
                    user?.password
                  )}
                </td>
                <td>
                  {editingUser === user?.id ? (
                    <input
                      type="text"
                      name="mobile"
                      value={editFormData.mobile}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  ) : (
                    user?.mobile
                  )}
                </td>
                <td>
                  {editingUser === user?.id ? (
                <MultiSelect
                options={shifts}
                selectedValues={shifts.filter(shift => editFormData.shift?.includes(shift.name))} // Ensure selected values are populated
                onSelect={handleShiftSelect}
                onRemove={handleRemove}
                label="Select Shifts:"
                name="shift"
              />

                  ) : (
                    user?.shift
                  )}
                </td>
                <td>
                  {editingUser === user?.id ? (
                    <select
                      id="seat"
                      name="seat"
                      className="form-select"
                      value={editFormData.seat}
                      onChange={handleEditChange}
                      onClick={getSeatResponse}
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
                  ) : (
                    user?.seat
                  )}
                </td>
                <td>
                  {editingUser === user?.id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => startEditing(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(user?.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning btn-sm margin-left-10"
                        key={user?.id} onClick={() => handleStatus(user?.id)}
                      >
                        {user?.isRegistered == 'Y' ? 'Active' : 'Inactive'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
</div>
      {filteredUsers.length === 0 && (
        <p className="text-center">No users found.</p>
      )}
    </div>
    </>
  );
};

export default AdminDashboard;