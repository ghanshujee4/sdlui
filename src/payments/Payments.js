import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GrowLoader from "../utils/GrowLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "../assets/css/style.css";
import { FaEdit, FaTrash, FaRegCheckCircle, FaPlusCircle, FaClock, FaSave, FaWhatsapp } from "react-icons/fa";
import WhatsAppLink from "../utils/WhatsAppLink";
import formatDateDDMMYYYY from "../utils/formatDateDDMMYYYY";
import adminAxios from "../login/adminAxios";
const Payments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [paymentComments, setPaymentComments] = useState({});
  const [paymentDueDates, setPaymentDueDates] = useState({});
  const [userName, setUserName] = useState("");
  const [editableRow, setEditableRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customMsg, setCustomMsg] = useState("");
  

  // ✅ Verify admin auth
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   if (!token || role !== "admin") navigate("/");
  // }, [navigate]);

  // ✅ Fetch all payments for user
  const fetchPayments = () => {
    setLoading(true);
    adminAxios
      .get(`/payments/${userId}`, { cache: "no-store" })
      .then((response) => {
        const data = response?.data;
        if (Array.isArray(data)) {
          setPayments(data);
          if (data.length > 0 && data[0].user) setUserName(data[0].user.name);
          const initialAmounts = {};
          const initialComments = {};
          const initialDueDates = {};
          data.forEach((p) => {
            initialAmounts[p.id] = p.amount || "";
            initialComments[p.id] = p.comments || "";
            initialDueDates[p.id] = p.dueDate || "";
          });
          setPaymentAmounts(initialAmounts);
          setPaymentComments(initialComments);
          setPaymentDueDates(initialDueDates);
        } else {
          toast.error("Unexpected response format from server.");
        }
      })
      .catch(() => toast.error("Failed to fetch payments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  // ✅ Add new payment row (calls backend)
  const addNewRow = () => {
    const today = new Date().toISOString().split("T")[0];
    const newPaymentData = {
      amount: 0,
      dueDate: today,
      comments: "Manual Payment Entry",
    };

    setLoading(true);
    adminAxios
      .post(`/payments/${userId}/add`, newPaymentData)
      .then(() => {
        toast.success("New payment record added successfully!");
        fetchPayments(); // reload payments list from backend
      })
      .catch((error) => {
        console.error("Error adding payment:", error);
        toast.error("Failed to add new payment record.");
      })
      .finally(() => setLoading(false));
  };

  // ✅ Mark payment as paid
  const markAsPaid = (paymentId, dueDate, amount) => {
    if (!amount) {
      toast.error("Please enter an amount before marking as paid.");
      return;
    }
    setLoading(true);
    const comments = paymentComments[paymentId] || "";
    adminAxios
      .post(`/payments/mark-as-paid/${paymentId}`, {
        amount: parseFloat(amount),
        comments,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Payment ID ${paymentId} marked as paid.`);
          fetchPayments();
        } else toast.error("Failed to update payment status.");
      })
      .catch(() => toast.error("Error occurred while marking as paid."))
      .finally(() => setLoading(false));
  };

  // ✅ Update existing payment
  const updatePayment = (paymentId, updatedPayment) => {
    setLoading(true);
    adminAxios
      .put(`/payments/${paymentId}`, {
        ...updatedPayment,
        paid: !!updatedPayment.paid,
      })
      .then(() => {
        toast.success(`Payment ID ${paymentId} updated successfully.`);
        setEditableRow(null);
        fetchPayments();
      })
      .catch(() => toast.error("Failed to update payment."))
      .finally(() => setLoading(false));
  };

  // ✅ Delete payment
  const deletePayment = (paymentId) => {
    setLoading(true);
    adminAxios
      .delete(`/payments/${paymentId}`)
      .then(() => {
        toast.success(`Payment ID ${paymentId} deleted.`);
        fetchPayments();
      })
      .catch(() => toast.error("Failed to delete payment."))
      .finally(() => setLoading(false));
  };

  // ✅ Save edited payment
  const handleSave = (paymentId) => {
    const payment = payments.find((p) => p.id === paymentId);
    const updatedPayment = {
      ...payment,
      amount: parseFloat(paymentAmounts[paymentId] || 0),
      comments: paymentComments[paymentId] || payment.comments,
      dueDate: paymentDueDates[paymentId] || payment.dueDate,
    };
    updatePayment(paymentId, updatedPayment);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 relative">
      <h2 className="text-center text-2xl font-bold mb-4">
        Payments for User {userId} : {userName}
      </h2>

      {/* ✅ Add Payment Button (no UI class change) */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        {/* {payments.length > 0 && (
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2 btn-primary shadow hover:scale-105 transition flex items-center"
          onClick={() => setCustomMsg(`Hi ${payment.user.name}, your account has been deactivated due to non-payment. Please clear dues to reactivate.\nThank you.\nSDL`)}
        >
          <WhatsAppLink payment={payments} customMessage={customMsg} />
          Deactivate?
        </button> */}
        {/* )} */}
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2 btn-primary shadow hover:scale-105 transition"
          onClick={addNewRow}
        >
          <FaPlusCircle className="mr-2 text-xl" /> Add Payment
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
          <GrowLoader />
        </div>
      )}

      {!loading && (
        <div className="table-responsive table-responsive-sm">
          <table className="table table-striped">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Due Date</th>
                <th className="border p-2">Payment Date</th>
                <th className="border p-2">Paid for Month</th>
                <th className="border p-2">Comments</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .slice()
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((payment) => {
                  const isOverdue =
                    !payment.paid && new Date(payment.dueDate) < new Date();
                  return (
                    <tr
                      key={payment.id}
                      className={`border ${isOverdue ? "bg-red-200" : ""}`}
                    >
                      <td className="border p-2">{payment.id}</td>
                      <td className="border p-2">
                        {editableRow === payment.id ? (
                          <input
                            type="number"
                            className="border p-2 rounded w-32"
                            value={paymentAmounts[payment.id] || ""}
                            onChange={(e) =>
                              setPaymentAmounts({
                                ...paymentAmounts,
                                [payment.id]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          paymentAmounts[payment.id]
                        )}
                      </td>
                      <td className="border p-2">
                        {editableRow === payment.id ? (
                          <select
                            className="border p-2 rounded"
                            value={payment.paid ? "Paid" : "Pending"}
                            onChange={(e) =>
                              setPayments(
                                payments.map((p) =>
                                  p.id === payment.id
                                    ? { ...p, paid: e.target.value === "Paid" }
                                    : p
                                )
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        ) : payment.paid ? (
                          "Paid"
                        ) : (
                          "Pending"
                        )}
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          className="form-control"
                          value={paymentDueDates[payment.id] || ""}
                          onChange={(e) =>
                            setPaymentDueDates({
                              ...paymentDueDates,
                              [payment.id]: e.target.value,
                            })
                          }
                          disabled={editableRow !== payment.id}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          className="form-control"
                          value={payment.paymentDate || ""}
                          onChange={(e) => {
                            const updatedPayments = payments.map((p) =>
                              p.id === payment.id
                                ? { ...p, paymentDate: e.target.value }
                                : p
                            );
                            setPayments(updatedPayments);
                          }}
                          disabled={editableRow !== payment.id}
                        />
                      </td>
                      <td className="border p-2">
                        {payment.monthPaid
                          ? new Date(payment.monthPaid).toLocaleString("en-US", {
                            month: "long",
                          })
                          : "N/A"}
                      </td>
                      <td className="border p-2">
                        {editableRow === payment.id ? (
                          <textarea
                            className="border p-2 rounded w-32"
                            value={
                              paymentComments[payment.id] ||
                              payment.comments ||
                              ""
                            }
                            onChange={(e) =>
                              setPaymentComments({
                                ...paymentComments,
                                [payment.id]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          payment.comments || ""
                        )}
                      </td>
                      <td className="border p-2">
                        {!payment.paid && (
                          <button
                            onClick={() =>
                              markAsPaid(
                                payment.id,
                                paymentDueDates[payment.id] || payment.dueDate,
                                paymentAmounts[payment.id]
                              )
                            }
                            className="bg-green-500 text-white px-4 py-2 btn-success rounded hover:bg-green-700 mr-2"
                          >
                            Mark as Paid
                          </button>
                        )}
                        {editableRow === payment.id ? (
                          <button
                            onClick={() => handleSave(payment.id)}
                            className="bg-green-600 btn-success text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditableRow(payment.id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2 btn-warning"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deletePayment(payment.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
