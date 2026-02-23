import React, { useState, useEffect } from "react";
import adminAxios from "../login/adminAxios";
import config from "../config";
import MultiSelect from "./../MultiSelect";
import { Card, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { handleStatus } from './Dashboard';
import "../assets/css/style.css";
import "./../assets/glowonhover.css";
import formatDateDDMMYYYY from "../utils/formatDateDDMMYYYY";
 import { useMemo } from "react";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('name');
  const [ascending, setAscending] = useState(true);
  // State declarations
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState("");
  const [shifts, setShifts] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState('');
  const [paymentDueDates, setPaymentDueDates] = useState({});
  const [filterMode, setFilterMode] = useState("all");
  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // 🔐 AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "ADMIN") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      navigate("/adminlogin");
      return;
    }

    setAuthReady(true);
  }, [navigate]);
  // SortKey type removed for JS compatibility
const handleSort = (key) => {
  alert("Sorting by " + key);
  if (key === sortKey) {
    setAscending((prev) => !prev);
  } else {
    setSortKey(key);
    setAscending(true);
  }
};

  useEffect(() => {
    if (!authReady) return;
    fetchUsers();
  }, [authReady]);


  // Fetch users on mount if admin
  // useEffect(() => {
  //     fetchUsers();
  // }, []);

  // Fetch shifts on mount
  useEffect(() => {
    // if (!localStorage.getItem("adminToken")) return;
if (!authReady) return;
    adminAxios.get(`/shifts`)
      .then((res) => setShifts(res.data))
      .catch(console.error);
  }, [authReady]);

  // Fetch payment due dates for users
  useEffect(() => {
    users.forEach(user => {
      if (!authReady) return;
      adminAxios.get(`/payments/${user.id}`)
        .then(res => {
          setPaymentDueDates(prev => ({ ...prev, [user.id]: res.data.duedate }));
        })
        .catch(console.error);
    });
  }, [users]);

  // Fetch seats based on selected shift
  const getSeatResponse = () => {
    if (!selectedShift) return;
    // if (!localStorage.getItem("adminToken")) return;
    if (!authReady) return;
    adminAxios.get(`/seats/with-status?shiftNumber=${selectedShift}`)
      .then(res => setSeats(res.data))
      .catch(console.error);
  };

  // Fetch all users
  const fetchUsers = () => {
    setLoading(true);
    // if (!localStorage.getItem("adminToken")) return;
    if (!authReady) return;
    adminAxios.get(`/users`)
      .then(res => {
        setUsers(res.data);
        setCount(res.data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
 
    }


const sortedUsers = useMemo(() => {
  return [...users].sort((a, b) => {
    // 1️⃣ First: Registered users on top
    if (a.isRegistered === 'Y' && b.isRegistered !== 'Y') return -1;
    if (a.isRegistered !== 'Y' && b.isRegistered === 'Y') return 1;

    let aValue = "";
    let bValue = "";

    if (sortKey === "name") {
      aValue = a.name || "";
      bValue = b.name || "";
    } else if (sortKey === "email") {
      aValue = a.email || "";
      bValue = b.email || "";
    } else {
      aValue = a.seat || "";
      bValue = b.seat || "";
    }

    const result = aValue.localeCompare(bValue);
    return ascending ? result : -result;
  });
}, [users, sortKey, ascending]);


  // Toggle filter mode among all, registered, unregistered
  const handleUserIsRegistered = () => {
    setFilterMode(prev => prev === "all" ? "registered" : prev === "registered" ? "unregistered" : "all");
  };

  // Handle shift select and remove for MultiSelect
  const handleShiftSelect = (selectedList) => {
    const selectedNames = selectedList.map(i => i.name).join(",");
    setEditFormData({ ...editFormData, shift: selectedNames });
    setSelectedShift(selectedNames);
  };
  const handleRemove = (selectedList) => {
    const selectedNames = selectedList.map(i => i.name);
    setEditFormData({ ...editFormData, shift: selectedNames });
    setSelectedShift(selectedNames);
  };

  // Start editing a user
  const startEditing = user => {
    setEditingUser(user.id);
    setEditFormData({ ...user });
  };

  // Handle edit form change
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save edited user
  const saveEdit = () => {
    const updatedUser = { ...editFormData };
    if (Array.isArray(updatedUser.shift)) {
      updatedUser.shift = updatedUser.shift.join(",");
    }
    setLoading(true);
    // if (!localStorage.getItem("adminToken")) return;
    if (!authReady) return;
    adminAxios.put(`/users/update/${editingUser}`, updatedUser)
      .then(res => {
        setUsers(users.map(u => u.id === editingUser ? res.data : u));
        setEditingUser(null);
        setMessage("User updated successfully.");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error updating user:", err);
        setLoading(false);
      });
  };

  // Delete a user with modal confirmation flow
  const confirmDeleteUser = id => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (!userIdToDelete) return;
    // if (!localStorage.getItem("adminToken")) return;
    if (!authReady) return;
    adminAxios.delete(`/users/${userIdToDelete}`)
      .then(() => {
        setUsers(users.filter(u => u.id !== userIdToDelete));
        setMessage("User deleted successfully.");
      }).catch(console.error)
      .finally(() => {
        setShowDeleteModal(false);
        setUserIdToDelete(null);
      });
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setUserIdToDelete(null);
  };

  // Toggle user active/inactive status
  const handleStatus = id => {
    setLoading(true);
    // if (!localStorage.getItem("adminToken")) return;
    if (!authReady) return;
    adminAxios.post(`/users/${id}`)
      .then(() => {
        setMessage(`User ${id} details updated successfully!`);
        fetchUsers();
        setLoading(false);
      })
      .catch(err => {
        setMessage("Error updating user details.");
        console.error(err);
        setLoading(false);
      });
  };

  // Calculate if payment overdue
  const isPaymentOverdue = duedate => {
    const today = new Date();
    const dueDt = new Date(duedate);
    return today > dueDt;
  };

  // Navigation helpers
  const navigateToDue = () => navigate("../payments/overduePayments");

  // Prepare filtered users list
  const filteredUsers = sortedUsers
    .filter(u =>
      (`${u.name} ${u.email} ${u.id} ${u.seat} ${u.shift} ${u.mobile}`).toLowerCase().includes(search.toLowerCase())
    )
    .filter(u =>
      filterMode === "all" ||
      (filterMode === "registered" && u.isRegistered === 'Y') ||
      (filterMode === "unregistered" && u.isRegistered !== 'Y')
    );

  const registeredUsers = users.filter(u => u.isRegistered === 'Y');
  const unregisteredUsers = users.filter(u => u.isRegistered !== 'Y');

  // Loading screen
  // if (loading) {
  //   return <div className="text-center mt-5"><GrowLoader /></div>;
  // }

  return (
    <>
      <div className="container-fluid mb-5">
        <h3 className="text-center mb-4">Admin Dashboard</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="col-xs-2 float-left mb-3">
          <input
            type="text"
            className="form-control glow-on-hover"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="col-sm-2 float-left">
          <Card
            className={`badge bg-${filterMode === "registered" ? 'success' : filterMode === "unregistered" ? 'danger' : 'secondary'} text-wrap select2-container glow-on-hover`}
            onClick={handleUserIsRegistered}
            style={{ fontSize: 22, cursor: 'pointer' }}
          >
            {filterMode === "all" ? "Show Registered" :
              filterMode === "registered" ? "Show Unregistered" :
                "Show All Users"}
          </Card>
        </div>

        <div className="col-sm-2 float-left">
          <Card className="badge bg-primary text-wrap select2-container glow-on-hover" onClick={navigateToDue} style={{ fontSize: 22, cursor: 'pointer' }}>
            Overdue
          </Card>
        </div>

        <div className="col-sm-2 float-left">
          <Card className="badge bg-primary text-wrap select2-container glow-on-hover" style={{ fontSize: 22 }} onClick={() => navigate("/seatfullInfopage")}>
            Total Users {count}
          </Card>
        </div>

        <div className="col-sm-2 float-left">
          <Card className="badge bg-success text-wrap select2-container glow-on-hover" style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => navigate("/seatfullInfopage")}>
            Registered: {registeredUsers.length}/ {unregisteredUsers.length}
          </Card>
        </div>

        <div className="col-sm-2 float-left">
          <Card className="badge bg-info text-wrap select2-container glow-on-hover" style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => navigate("/chartdashboard")}>
            Chart Board
          </Card>
        </div>
        <div className="col-sm-2 float-left">
          <Card
            className="badge bg-warning text-wrap select2-container glow-on-hover"
            style={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => navigate("/requests-approval")}
          >
            User Approval
          </Card>
        </div>


        <div className="table-responsive mt-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{ cursor: "pointer" }}>User ID</th>
                <th onClick={() => handleSort("name")}>Name</th>
                <th>Admission Date</th>
                <th onClick={() => handleSort("email")}>Email</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Shift</th>
                <th onClick={() => handleSort("seat")}>Seat</th>
                <th>Extra</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">No users found.</td>
                </tr>
              ) : filteredUsers.map(user => {
                const dueDate = paymentDueDates[user.id];
                return (
                  <tr key={user.id} style={{
                    backgroundColor: dueDate && isPaymentOverdue(dueDate) ? 'red' : undefined,
                    color: dueDate && isPaymentOverdue(dueDate) ? 'white' : undefined,
                  }}>
                    <td>
                      <a href="#"
                        onClick={e => {
                          e.preventDefault();
                          navigate(`/payments/${user.id}`);
                        }}
                        style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                      >
                        {user.id}
                      </a>
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="form-control" />
                      ) : user.name}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input type="date" name="admissionDate" value={formatDateDDMMYYYY(editFormData.admissionDate)} onChange={handleEditChange} className="form-control" />
                      ) : formatDateDDMMYYYY(user.admissionDate)}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="form-control" />
                      ) : user.email}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input type="text" name="password" value={editFormData.password} onChange={handleEditChange} className="form-control" />
                      ) : user.password}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input type="text" name="mobile" value={editFormData.mobile} onChange={handleEditChange} className="form-control" />
                      ) : user.mobile}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <MultiSelect
                          options={shifts}
                          selectedValues={shifts.filter(shift => editFormData.shift?.includes(shift.name))}
                          onSelect={handleShiftSelect}
                          onRemove={handleRemove}
                          label="Select Shifts:"
                          name="shift"
                        />
                      ) : user.shift}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <select id="seat" name="seat" className="form-select" value={editFormData.seat} onChange={handleEditChange} onClick={getSeatResponse} required>
                          <option value="">Select a seat</option>
                          {seats.filter(seat => !seat.registered).map(seat => (
                            <option key={seat.id} value={seat.seatNo}>{seat.seatName}</option>
                          ))}
                        </select>
                      ) : user.seat}
                    </td>
                    <td>
                      {editingUser === user?.id ? (
                        <input type="number" name="extraHour" value={editFormData.extraHour} onChange={handleEditChange} className="form-control" />
                      ) : user.extraHour}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingUser(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary btn-sm me-2" onClick={() => startEditing(user)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => confirmDeleteUser(user?.id)}>Delete</button>
                          <button className="btn btn-warning btn-sm ms-2" onClick={() => handleStatus(user?.id)}>
                            {user.isRegistered === 'Y' ? 'Active' : 'Inactive'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm User Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
