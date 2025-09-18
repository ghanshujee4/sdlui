// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import config from "../config";
// import '../App.css';
// import axios from "axios";
// import '../assets/css/style.css';
// import GrowLoader from "../utils/Growloader"; // Import loader
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const Payments = () => {
//     const { userId } = useParams();
//     const [payments, setPayments] = useState([]);
//     const [paymentAmounts, setPaymentAmounts] = useState({});
//     const [paymentComments, setPaymentComments] = useState({});
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [editableRow, setEditableRow] = useState(null);
//     const [userName, setUserName] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const role = localStorage.getItem("role"); // assuming the role is stored in localStorage

//         if (!token || role !== "admin") {
//             navigate("/"); // Redirect to home or login if not admin
//         }
//     }, [navigate]);

//     useEffect(() => {
//         axios
//             .get(`${config.BASE_URL}/payments/${userId}`, { cache: "no-store" })
//             .then(response => {
//                 const data = response?.data;  // ✅ Extract the actual data
//                 console.log("Fetched Data:", data); // Debugging

//                 if (Array.isArray(data)) {  // ✅ Ensure it's an array before looping
//                     setPayments(data);
//                     if (data?.length > 0 && data[0]?.user) {
//                         setUserName(data[0]?.user?.name); // Extract user's name
//                     }

//                     const initialAmounts = {};
//                     data.forEach(payment => {
//                         initialAmounts[payment?.id] = payment?.amount || "";
//                     });

//                     setPaymentAmounts(initialAmounts);
//                     setLoading(false);
//                 } else {
//                     console.error("Expected an array but got:", data);
//                 }
//             })
//             .catch(error => console.error("Error fetching payments:", error));
//     }, [userId]);


//     const markAsPaid = (paymentId, dueDate, amount) => {
//         if (!amount) {
//             setMessage("Please enter an amount before marking as paid.");
//             return;
//         }

//         const comments = paymentComments[paymentId] || "";

//         axios.post(`${config.BASE_URL}/payments/mark-as-paid/${paymentId}`, {
//             amount: parseFloat(amount),
//             dueDate,
//             comments
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     const updatedPayments = payments.map(p =>
//                         p.id === paymentId
//                             ? {
//                                 ...p,
//                                 paid: true,
//                                 amount,
//                                 comments,
//                                 paymentDate: new Date().toISOString().split("T")[0]
//                             }
//                             : p
//                     );

//                     const nextDueDate = getNextMonthDate(dueDate);
//                     const newPayment = {
//                         id: Math.max(...payments.map(p => p.id)) + 1,
//                         amount: amount,
//                         paid: false,
//                         paymentDate: null,
//                         dueDate: nextDueDate,
//                         comments: ""
//                     };

//                     setPayments([...updatedPayments, newPayment]);
//                     setPaymentAmounts({ ...paymentAmounts, [newPayment.id]: amount });
//                     setPaymentComments({ ...paymentComments, [paymentId]: comments, [newPayment.id]: "" });

//                     setMessage(`Payment ID ${paymentId} marked as paid with ₹${amount}. New payment created for ${nextDueDate}.`);
//                     toast.success(`Payment ID ${paymentId} marked as paid with ₹${amount}. New payment created for ${nextDueDate}.`);
//                 } else {
//                     setMessage("Failed to update payment status.");
//                 }
//             })
//             .catch(error => console.error("Error marking payment as paid:", error));
//     };


//     const handleInputChange = (event, paymentId, field) => {
//         const updatedPayments = payments.map(payment =>
//             payment.id === paymentId ? { ...payment, [field]: event.target.value } : payment
//         );
//         setPayments(updatedPayments);
//     };

//     const updatePayment = (paymentId, updatedPayment) => {
//         axios.put(`${config.BASE_URL}/payments/${paymentId}`,
//             {
//                 ...updatedPayment,
//                 paid: !!updatedPayment.paid // Ensure it's a boolean
//             })
//             .then(response => {
//                 setMessage(`Payment ID ${paymentId} updated successfully.`);
//                 setEditableRow(null);
//             })
//             .catch(error => {
//                 console.error("Error updating payment:", error);
//                 setMessage("Failed to update payment.");
//             });
//     };


//     const deletePayment = (paymentId) => {
//         axios
//             .delete(`${config.BASE_URL}/payments/${paymentId}`)
//             .then(response => {
//                 if (response) {
//                     setPayments(payments.filter(p => p.id !== paymentId));
//                     setMessage(`Payment ID ${paymentId} deleted successfully.`);
//                 } else {
//                     setMessage("Failed to delete payment.");
//                 }
//             })
//             .catch(error => console.error("Error deleting payment:", error));
//     };

//     const getNextMonthDate = (dateString) => {
//         const date = new Date(dateString);
//         date.setMonth(date.getMonth() + 1);
//         return date.toISOString().split("T")[0];
//     };

//     const handleSave = (paymentId) => {
//         const payment = payments.find(p => p.id === paymentId);
//         const updatedPayment = {
//             ...payment,
//             amount: parseFloat(paymentAmounts[paymentId] || 0),
//             comments: paymentComments[paymentId] || payment.comments,
//         };
//         updatePayment(paymentId, updatedPayment);
//     };

//     return (
//         <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 p-10">
//             <h2 className="text-center text-2xl font-bold mb-4">Payments for User {userId} : {userName}</h2>
//             {loading ? (
//                 <div className="flex justify-center items-center py-10">
//                     <GrowLoader />
//                 </div>
//             ) : (
//                 <>
//                     {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>}
//         <div className="table-responsive">
//                     <table className="table table-striped table-responsive-sm">
//                         <thead>
//                             <tr className="bg-gray-100">
//                                 <th className="border p-2">ID</th>
//                                 <th className="border p-2">Amount</th>
//                                 <th className="border p-2">Status</th>
//                                 <th className="border p-2">Due Date</th>
//                                 <th className="border p-2">Payment Date</th>
//                                 <th className="border p-2">Paid for Month</th>
//                                 <th className="border p-2">Comments</th>
//                                 <th className="border p-2 col-span-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {payments
//                                 .slice() // Create a shallow copy to avoid mutating the state directly
//                                 .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort by dueDate
//                                 .map(payment => {
//                                     const isOverdue = !payment.paid && new Date(payment.dueDate) < new Date();
//                                     return (
//                                         <tr key={payment.id} className={`border ${isOverdue ? "bg-red-200" : ""}`}>
//                                             <td className="border p-2">
//                                                 <a onClick={(e) => {
//                                                     e.preventDefault();
//                                                     navigate(`/dashboard/${userId}`);
//                                                 }}>
//                                                     {payment.id} </a></td>
//                                             <td className="border p-2">
//                                                 {editableRow === payment.id ? (
//                                                     <input
//                                                         type="number"
//                                                         className="border p-2 rounded w-32"
//                                                         value={paymentAmounts[payment.id] || ""}
//                                                         onChange={(e) => setPaymentAmounts({ ...paymentAmounts, [payment.id]: e.target.value })}
//                                                         disabled= {false}
//                                                     />
//                                                 ) : (
//                                                     paymentAmounts[payment.id]
//                                                 )}
//                                             </td>
//                                             <td className="border p-2">
//                                                 {editableRow === payment.id ? (
//                                                     <select
//                                                         className="border p-2 rounded"
//                                                         value={payment.paid ? "Paid" : "Pending"}
//                                                         onChange={(e) => handleInputChange({ target: { value: e.target.value === "Paid" } }, payment.id, "paid")} >
//                                                         <option value="Pending">Pending</option>
//                                                         <option value="Paid">Paid</option>
//                                                     </select>
//                                                 ) : (
//                                                     payment.paid ? "Paid" : "Pending"
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="date"
//                                                     className="form-control"
//                                                     value={payment.dueDate || ""}
//                                                     onChange={(e) => handleInputChange(e, payment.id, "dueDate")}
//                                                     disabled={editableRow !== payment.id}
//                                                 />
//                                             </td>
//                                             <td className="border p-2">{payment.paymentDate || "N/A"}</td>
//                                             <td className="border p-2">{payment.monthPaid
//                                                 ? new Date(payment.monthPaid).toLocaleString("en-US", { month: "long" })
//                                                 : "N/A"}</td>
//                                             <td className="border p-2">
//                                                 {editableRow === payment.id ? (
//                                                     <textarea
//                                                         className="border p-2 rounded w-32"
//                                                         value={paymentComments[payment.id] || payment.comments || ""}
//                                                         onChange={(e) =>
//                                                             setPaymentComments({ ...paymentComments, [payment.id]: e.target.value })
//                                                         }
//                                                     />
//                                                 ) : (
//                                                     payment.comments || ""
//                                                 )}
//                                             </td>
                                           
//                                             {/* <td className="border p-2">{payment?.monthPaid || "N/A"}</td> */}
//                                             <td className="border p-2">
//                                                 {!payment.paid && (
//                                                     <button onClick={() => markAsPaid(payment.id, payment.dueDate, paymentAmounts[payment.id])} className="bg-green-500 btn-success text-white px-4 py-2 rounded hover:bg-green-700 mr-2">Mark as Paid</button>
//                                                 )}
//                                                 {editableRow === payment.id ? (
//                                                     <button className="bg-green-500 btn-success text-white px-4 py-2 rounded hover:bg-red-700 mr-2" onClick={() => handleSave(payment.id)}>
//                                                         Save
//                                                     </button>
//                                                 ) : (
//                                                     <button className="bg-yellow-500 btn-warning text-white px-4 py-2 rounded hover:bg-red-700 mr-2" onClick={() => setEditableRow(payment.id)}>
//                                                         Edit
//                                                     </button>
//                                                 )}
//                                                 <button onClick={() => deletePayment(payment.id)} className="bg-red-500 btn-danger text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                         </tbody>
//                     </table>
//                     </div>
//                     {message}
//                 </>
//             )}
//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//         </div>
//     );
// };

// export default Payments;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import GrowLoader from "../utils/Growloader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "../assets/css/style.css";

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

  // 🔹 Verify admin auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  // 🔹 Fetch payments
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BASE_URL}/payments/${userId}`, { cache: "no-store" })
      .then((response) => {
        const data = response?.data;

        if (Array.isArray(data)) {
          setPayments(data);

          if (data.length > 0 && data[0].user) {
            setUserName(data[0].user.name);
          }

          const initialAmounts = {};
          const initialComments = {};
          const initialDueDates = {};

          data.forEach((payment) => {
            initialAmounts[payment.id] = payment.amount || "";
            initialComments[payment.id] = payment.comments || "";
            initialDueDates[payment.id] = payment.dueDate || "";
          });

          setPaymentAmounts(initialAmounts);
          setPaymentComments(initialComments);
          setPaymentDueDates(initialDueDates);
        } else {
          toast.error("Unexpected response format from server.");
        }
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        toast.error("Failed to fetch payments.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 🔹 Helper: Get next month date
  const getNextMonthDate = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  // 🔹 Mark payment as paid
  const markAsPaid = (paymentId, dueDate, amount) => {
    if (!amount) {
      toast.error("Please enter an amount before marking as paid.");
      return;
    }

    setLoading(true);
    const comments = paymentComments[paymentId] || "";

    axios
      .post(`${config.BASE_URL}/payments/mark-as-paid/${paymentId}`, {
        amount: parseFloat(amount),
        dueDate,
        comments,
      })
      .then((response) => {
        if (response.status === 200) {
          const updatedPayments = payments.map((p) =>
            p.id === paymentId
              ? {
                  ...p,
                  paid: true,
                  amount,
                  comments,
                  paymentDate: new Date().toISOString().split("T")[0],
                }
              : p
          );

          const nextDueDate = getNextMonthDate(dueDate);
          const newPayment = {
            id: Math.max(...payments.map((p) => p.id)) + 1,
            amount: amount,
            paid: false,
            paymentDate: null,
            dueDate: nextDueDate,
            comments: "",
          };

          setPayments([...updatedPayments, newPayment]);
          setPaymentAmounts({
            ...paymentAmounts,
            [newPayment.id]: amount,
          });
          setPaymentComments({
            ...paymentComments,
            [paymentId]: comments,
            [newPayment.id]: "",
          });
          setPaymentDueDates({
            ...paymentDueDates,
            [newPayment.id]: nextDueDate,
          });

          toast.success(
            `Payment ID ${paymentId} marked as paid. New payment added for ${nextDueDate}.`
          );
        } else {
          toast.error("Failed to update payment status.");
        }
      })
      .catch((error) => {
        console.error("Error marking payment as paid:", error);
        toast.error("Error occurred while marking as paid.");
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Update payment
  const updatePayment = (paymentId, updatedPayment) => {
    setLoading(true);
    axios
      .put(`${config.BASE_URL}/payments/${paymentId}`, {
        ...updatedPayment,
        paid: !!updatedPayment.paid,
      })
      .then(() => {
        toast.success(`Payment ID ${paymentId} updated successfully.`);
        setEditableRow(null);
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
        toast.error("Failed to update payment.");
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Delete payment
  const deletePayment = (paymentId) => {
    setLoading(true);
    axios
      .delete(`${config.BASE_URL}/payments/${paymentId}`)
      .then(() => {
        setPayments(payments.filter((p) => p.id !== paymentId));
        toast.success(`Payment ID ${paymentId} deleted.`);
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        toast.error("Failed to delete payment.");
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Handle Save
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

      <ToastContainer position="top-right" autoClose={3000} />

      {/* 🔹 Fullscreen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <GrowLoader />
        </div>
      )}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-striped table-responsive-sm">
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
                      <td className="border p-2">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/dashboard/${userId}`);
                          }}
                        >
                          {payment.id}
                        </a>
                      </td>
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
                        {payment.paymentDate || "N/A"}
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
                              paymentComments[payment.id] || payment.comments || ""
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
