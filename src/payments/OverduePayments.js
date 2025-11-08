import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../App.css';
import config from "../config";
import { useNavigate } from "react-router-dom";
import "./Overdue.css";  // Ensure to import the CSS for custom styles
import { FaPrint, FaFileDownload, FaDashcube, FaWhatsapp } from 'react-icons/fa';
import WhatsAppLink from '../utils/WhatsAppLink';
import PhoneCallLink from '../utils/PhoneCallLink';
import PaymentQR from '../utils/PaymentQR';

const OverduePayments = () => {
    // State to store the overdue payments
    const [overduePayments, setOverduePayments] = useState([]);
    // State to store any potential error
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Aggregate multiple payments per user:
    const aggregatePaymentsByUser = (payments) => {
        const userPaymentsMap = {};

        payments.forEach((payment) => {
            const userId = payment.user?.id;
            if (!userPaymentsMap[userId]) {
                // Clone to avoid mutating original objects
                userPaymentsMap[userId] = { ...payment };
            } else {
                // Sum the amounts
                userPaymentsMap[userId].amount += payment.amount;

                // Update to the latest due date if this payment's dueDate is later
                const prevDue = new Date(userPaymentsMap[userId].dueDate);
                const newDue = new Date(payment.dueDate);
                if (newDue > prevDue) {
                    // Merge latest fields from current payment except amount to keep the sum
                    userPaymentsMap[userId] = {
                        ...userPaymentsMap[userId],
                        ...payment,
                        amount: userPaymentsMap[userId].amount, // preserve sum amount
                    };
                }
            }
        });

        return Object.values(userPaymentsMap);
    };

    useEffect(() => {
        // Fetch overdue payments when the component mounts
        const fetchOverduePayments = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/payments/overdue`);
                if (response.status === 200) {
                    const filteredPayments = response.data.filter(payment => payment.user?.isRegistered === 'Y');
                    // Sort the overdue payments by the due date (latest first)
                    const sortedPayments = filteredPayments?.sort((a, b) => {
                        const dueDateA = new Date(a.dueDate);
                        const dueDateB = new Date(b.dueDate);
                        return dueDateB - dueDateA; // Descending order
                    });
                    // Aggregate payments by user
                    const aggregatedPayments = aggregatePaymentsByUser(sortedPayments);
                    setOverduePayments(aggregatedPayments);
                }
            } catch (err) {
                console.error('Error fetching overdue payments:', err);
                setError('An error occurred while fetching overdue payments.');
            }
        };

        fetchOverduePayments();
    }, []); // Run once on mount

    useEffect(() => {
        // Check every minute to trigger WhatsApp message at exactly 10:00 AM
        const checkTimeAndTrigger = () => {
            const now = new Date();
            if (now.getHours() === 10 && now.getMinutes() === 0) {
                sendWhatsAppToAll();
            }
        };

        const interval = setInterval(checkTimeAndTrigger, 60000);

        return () => clearInterval(interval);
    }, [overduePayments]); // Depend on payments so sendWhatsAppToAll has updated data

    // Calculate how many days overdue
    const calculateOverdueDays = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const timeDifference = today - due;
        return Math.floor(timeDifference / (1000 * 3600 * 24));
    };

    // Print table content
    const handlePrint = () => {
        const printContent = document.getElementById("overduePaymentsTable").outerHTML;
        const newWindow = window.open('', '', 'height=800,width=1000');
        newWindow.document.write('<html><head><title>Overdue Payments Report</title></head><body>');
        newWindow.document.write(printContent);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.print();
    };

    // Send WhatsApp message to all users with overdue payments
    const sendWhatsAppToAll = () => {
        overduePayments.forEach((payment, index) => {
            const mobile = '+91' + payment?.user?.mobile;
            setTimeout(() => {
                const message = `Hi ${payment?.user?.name} (${payment?.user?.id}), Your total payment pending from ${payment?.dueDate} is ₹${payment?.amount}. Please pay at the earliest.\nThank you.\nSDL`;
                const whatsappURL = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
                setTimeout(() => {
                    window.open(whatsappURL, "_blank");
                }, index * 2000); // Open tabs spaced by 2 seconds
            });
        });
    };

    // Download CSV file of overdue payments
    const handleDownload = () => {
        const csvContent = "User ID, Name, Mobile Number, Amount, Due Date\n" +
            overduePayments.map(payment => 
                `${payment.user?.id},${payment.user?.name},${payment.user?.mobile},${payment.amount},${payment.dueDate}`
            ).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "overdue_payments_report.csv";
        link.click();
    };

    const navigateToDashboard = () => {
        navigate('../admindashboard');
    };

    return (
        <div className="container-fluid mt-5">
            <h2>Overdue Payments</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* Action buttons */}
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleDownload}>
                    <FaFileDownload className="me-2" /> Download Report
                </button>
                <button className="btn btn-success me-2" onClick={handlePrint}>
                    <FaPrint className="me-2" /> Print Report
                </button>
                <button className="btn btn-info me-2" onClick={navigateToDashboard}>
                    <FaDashcube className="me-2" /> Dashboard
                </button>
                <button className="btn btn-primary me-2" onClick={sendWhatsAppToAll}>
                    <FaWhatsapp className="me-2" /> Send to All
                </button>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table id="overduePaymentsTable" className="table table-striped table-responsive-sm custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Shift/Seat</th>
                            <th>Mobile</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Alert</th>
                            <th>Call</th>
                            <th>Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overduePayments.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">No overdue payments found.</td>
                            </tr>
                        ) : (
                            overduePayments.map((payment) => {
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
                                                style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
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
                                                style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                                            >
                                                {payment.user?.name}
                                            </a>
                                        </td>
                                        <td>{payment.user?.seat} / {payment.user?.shift}</td>
                                        <td>{payment.user?.mobile}</td>
                                        <td>{payment.amount}</td>
                                        <td>{new Date(payment.dueDate).toLocaleDateString('en-IN')}</td>
                                        <WhatsAppLink payment={payment} />
                                        <PhoneCallLink payment={payment} />
                                        <td>
                                            {payment.amount > 0 ? (
                                                <PaymentQR
                                                    userId={payment.id}
                                                    userName={payment.user.name}
                                                    amount={payment.amount}
                                                />
                                            ) : (
                                                "No Payment"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverduePayments;
