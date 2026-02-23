import React, { useEffect, useState } from 'react';
import './../App.css';
import config from "../config";
import { useNavigate } from "react-router-dom";
import "./Overdue.css";
import { FaPrint, FaFileDownload, FaDashcube, FaWhatsapp, FaFilter } from 'react-icons/fa';
import WhatsAppLink from '../utils/WhatsAppLink';
import PhoneCallLink from '../utils/PhoneCallLink';
import PaymentQR from '../utils/PaymentQR';
import adminAxios from '../login/adminAxios';
import formatDateDDMMYYYY from '../utils/formatDateDDMMYYYY';
import AdminWhatsAppSummary from '../utils/AdminWhatsAppSummary';

const OverduePayments = () => {
  const [overduePayments, setOverduePayments] = useState([]);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState("ALL");
  const navigate = useNavigate();

  // 🔹 Combine multiple overdue payments per user
  const aggregatePaymentsByUser = (payments) => {
    const userPaymentsMap = {};
    payments.forEach((payment) => {
      const userId = payment.user?.id;
      if (!userPaymentsMap[userId]) {
        userPaymentsMap[userId] = { ...payment };
      } else {
        userPaymentsMap[userId].amount += payment.amount;
        const prevDue = new Date(userPaymentsMap[userId].dueDate);
        const newDue = new Date(payment.dueDate);
        if (newDue > prevDue) {
          userPaymentsMap[userId] = {
            ...userPaymentsMap[userId],
            ...payment,
            amount: userPaymentsMap[userId].amount,
          };
        }
      }
    });
    return Object.values(userPaymentsMap);
  };

  // 🔹 Fetch all overdue payments
  useEffect(() => {
    const fetchOverduePayments = async () => {
      try {
        const response = await adminAxios.get(`/payments/overdue`);
        if (response.status === 200) {
          const filtered = response.data.filter(p => p.user?.isRegistered === 'Y');
          // ✅ Sort oldest to newest (ascending order)
          const sorted = filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          const aggregated = aggregatePaymentsByUser(sorted);
          setOverduePayments(aggregated);
        }
      } catch (err) {
        console.error('Error fetching overdue payments:', err);
        setError('An error occurred while fetching overdue payments.');
      }
    };
    fetchOverduePayments();
  }, []);

  // 🔹 Auto WhatsApp trigger check at 10 AM
  useEffect(() => {
    const checkTimeAndTrigger = () => {
      const now = new Date();
      if (now.getHours() === 10 && now.getMinutes() === 0) sendWhatsAppToAll();
    };
    const interval = setInterval(checkTimeAndTrigger, 60000);
    return () => clearInterval(interval);
  }, [overduePayments]);

  // 🔹 Calculate overdue days
  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.floor((today - due) / (1000 * 3600 * 24));
  };

  // 🔹 Print table
  const handlePrint = () => {
    const printContent = document.getElementById("overduePaymentsTable").outerHTML;
    const newWindow = window.open('', '', 'height=800,width=1000');
    newWindow.document.write('<html><head><title>Overdue Payments Report</title></head><body>');
    newWindow.document.write(printContent);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  // 🔹 Download as CSV
  const handleDownload = () => {
    const csv = "User ID, Name, Mobile Number, Amount, Due Date, Seat, Shift\n" +
      overduePayments.map(p =>
        `${p.user?.id},${p.user?.name},${p.user?.mobile},${p.amount},${formatDateDDMMYYYY(p.dueDate)} ,${p?.user?.seat},,${p?.user?.shift},`
      ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "overdue_payments_report.csv";
    link.click();
  };

  const navigateToDashboard = () => navigate('../admindashboard');

  // 🔹 Filter by date logic
  const filterPaymentsByDate = (payments) => {
    const today = new Date();
    const filtered = payments.filter(payment => {
      const dueDate = new Date(payment.dueDate);
      const diffDays = Math.floor((today - dueDate) / (1000 * 3600 * 24));

      switch (filterOption) {
        case "TODAY": return diffDays === 0;
        case "LAST_7_DAYS": return diffDays > 0 && diffDays <= 7;
        case "LAST_30_DAYS": return diffDays > 7 && diffDays <= 30;
        case "OVER_30_DAYS": return diffDays > 30;
        default: return true;
      }
    });
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const filteredPayments = filterPaymentsByDate(overduePayments);

  // 🔹 UI
  return (
    <div className="container-fluid mt-5">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
          <h3 className="fw-bold mb-0 text-primary">
            📅 Overdue Payments
          </h3>
          <div className="mt-2 mt-md-0">
            <button className="btn btn-primary me-2" onClick={handleDownload}>
              <FaFileDownload className="me-2" /> Download
            </button>
            <button className="btn btn-success me-2" onClick={handlePrint}>
              <FaPrint className="me-2" /> Print
            </button>
            <button className="btn btn-info me-2" onClick={navigateToDashboard}>
              <FaDashcube className="me-2" /> Dashboard
            </button>
            {/* <button className="btn btn-success me-2" onClick={sendWhatsAppToAll}>
              <FaWhatsapp className="me-2" /> Send All
            </button> */}
            <AdminWhatsAppSummary
  payments={filteredPayments}
  adminNumber="919934614711"   // 👈 Replace with real admin WhatsApp number
/>

            <WhatsAppLink mode="all" payments={filteredPayments}>
              <button className="btn btn-success me-2">
                <FaWhatsapp className="me-2" /> Send All
              </button>
            </WhatsAppLink>

          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* 🔹 Filter Section */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <FaFilter className="text-secondary me-2" />
            <label className="fw-bold me-2 mb-0">Filter by Due Date:</label>
            <select
              className="form-select w-auto"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="TODAY">Due Today</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="OVER_30_DAYS">Over 30 Days</option>
            </select>
          </div>

          <div className="text-end">
            <p className="fw-semibold mb-0 text-muted">
              Showing <span className="text-primary fw-bold">{filteredPayments.length}</span> records
              {" "}(<span className="text-uppercase">{filterOption.replace(/_/g, " ")}</span>)
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="card border-0 shadow-sm">
        <div className="card-body table-responsive custom-table">
          <table id="overduePaymentsTable" className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Seat/Shift</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Alert</th>
                <th>Call</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No overdue payments found for this filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const overdueDays = calculateOverdueDays(payment.dueDate);
                  const rowClass = overdueDays <= 5 ? 'bg-warning' : 'bg-danger';

                  return (
                    <tr key={payment.user?.id} className={rowClass} style={{ color: '#fff' }}>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/payments/${payment.user?.id}`);
                          }}
                          style={{ cursor: "pointer", color: "white", textDecoration: "underline" }}
                        >
                          {payment.user?.id}
                        </a>
                      </td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/dashboard/${payment.user?.id}`);
                          }}
                          style={{ cursor: "pointer", color: "white", textDecoration: "underline" }}
                        >
                          {payment?.user?.name}
                        </a>
                      </td>
                      <td>{payment?.user?.seat} / {payment?.user?.shift}</td>
                      <td>{payment?.user?.mobile}</td>
                      <td>₹{payment?.amount}</td>
                      <td>{new Date(payment?.dueDate).toLocaleDateString('en-IN')}</td>
                      {/* <WhatsAppLink payment={payment} /> */}
                      <td>
                      <WhatsAppLink payment={payment}>
                        <FaWhatsapp size={24} color="green" />
                      </WhatsAppLink>
                      </td>
                      <PhoneCallLink payment={payment} />
                      <td>
                        {payment.amount > 0 ? (
                          <PaymentQR
                            userId={payment.id}
                            userName={payment.user.name}
                            amount={payment.amount}
                          />
                        ) : "No Payment"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverduePayments;
