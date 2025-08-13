import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../App.css';
import config from "../config";
import { useNavigate } from "react-router-dom";
import "./Overdue.css";  // Ensure to import the CSS for custom styles
import { FaPrint, FaFileDownload, FaDashcube, FaWhatsapp } from 'react-icons/fa';
import WhatsAppLink from '../utils/WhatsAppLink';
import PhoneCallLink from '../utils/PhoneCallLink';
const OverduePayments = () => {
    // State to store the overdue payments
    const [overduePayments, setOverduePayments] = useState([]);
    // State to store any potential error
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch overdue payments when the component mounts
        const fetchOverduePayments = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/payments/overdue`);
                if (response.status === 200) {
                    const filteredPayments = response.data.filter(payment => payment.user?.isRegistered === 'Y');
                    // Sort the overdue payments by the due date (longest first)
                    const sortedPayments = filteredPayments?.sort((a, b) => {
                        const dueDateA = new Date(a.dueDate);
                        const dueDateB = new Date(b.dueDate);
                        return dueDateB - dueDateA; // Sorting in descending order (longest due date first)
                    });
                    setOverduePayments(sortedPayments);
                }
            } catch (err) {
                console.error('Error fetching overdue payments:', err);
                setError('An error occurred while fetching overdue payments.');
            }
        };

        fetchOverduePayments();
    }, []); // Empty dependency array means this runs once when the component is mounted
    useEffect(() => {
        const checkTimeAndTrigger = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Trigger at exactly 10:00 AM
            if (hours === 10 && minutes === 0) {
                sendWhatsAppMessage();
            }
        };

        // Check every 60 seconds
        const interval = setInterval(checkTimeAndTrigger, 60000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    // Function to calculate overdue days
    const calculateOverdueDays = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const timeDifference = today - due;
        const daysOverdue = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days
        return daysOverdue;
    };

    // Print function to print the table
    const handlePrint = () => {
        const printContent = document.getElementById("overduePaymentsTable").outerHTML;
        const newWindow = window.open('', '', 'height=800,width=1000');
        newWindow.document.write('<html><head><title>Overdue Payments Report</title></head><body>');
        newWindow.document.write(printContent);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.print();
    };

    // function handlePrint() {
    //     const element = document.getElementById("someElementId");
    //     console.log(element); // Check if element is null
    //     console.log(element?.outerHTML); // Use optional chaining to avoid errors
    //     window.print(element.outerHTML);
    // }

    const sendWhatsAppToAll = () => {
        overduePayments.forEach((payment, index) => {
            const mobile = '+91' + payment?.user?.mobile;
            setTimeout(() => { // To prevent browser throttling
                const message = `Hi ${payment?.user?.name} (${payment?.user?.id}), Your payment is pending from ${payment?.dueDate} for the amount of ${payment?.amount}. Please make the payment at the earliest.\n Thank you.\n SDL`;
                const whatsappURL = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
                setTimeout(() => {
                    window.open(whatsappURL, "_blank")
                }, index * 2000); // Open a new tab every 2 seconds to prevent blocking
            });
        });
    };
    // Download the overdue payments data as CSV
    const handleDownload = () => {
        const csvContent = "User ID, Name, Mobile Number, Amount, Due Date\n" +
            overduePayments.map(payment => {
                return `${payment.user?.id}, ${payment.user?.name}, ${payment.user?.mobile}, ${payment.amount}, ${payment.dueDate}`;
            }).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "overdue_payments_report.csv";
        link.click();
    };
    const navigateToDashboard = () => {
        navigate('../admindashboard')
    }

    return (
        <div className="container-fluid mt-5">
            <h2>Overdue Payments</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {/* Buttons for report and print */}
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleDownload}>
                    <FaFileDownload className="me-2" /> Download Report
                </button>
                <button className="btn btn-success me-2" onClick={handlePrint}>
                    <FaPrint className="me-2" /> Print Report
                </button>
                <button className="btn btn-info me-2" onClick={navigateToDashboard}>
                    <FaDashcube className="me-2" /> Dasboard
                </button>
                <button className="btn btn-primary me-2" onClick={sendWhatsAppToAll}>
                    <FaWhatsapp className="me-2" /> Send to All
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-responsive-sm custom-table">
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
                        </tr>
                    </thead>
                    <tbody>
                        {overduePayments.length === 0 ? (
                            <tr>
                                <td colSpan="5">No overdue payments found.</td>
                            </tr>
                        ) : (
                            overduePayments.map((payment) => {
                                const overdueDays = calculateOverdueDays(payment.dueDate);
                                // Apply bg-warning if overdue within 5 days, else bg-danger
                                const rowClass = overdueDays <= 5 ? 'bg-warning' : 'bg-danger';

                                return (
                                    <tr style={{ color: '#fff' }}
                                        key={payment.user?.id}
                                        className={rowClass}  // Add Bootstrap class dynamically
                                    >
                                        <td>
                                            <a onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/payments/${payment?.user?.id}`);
                                            }}
                                                style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                                                href="#"
                                            >{payment?.user?.id}

                                            </a>
                                        </td>
                                        <td>{payment?.user?.name} </td>
                                        <td>{payment?.user?.seat} / {payment?.user?.shift}</td>
                                        <td>{payment?.user?.mobile}</td>
                                        <td>{payment?.amount}</td>
                                        <td>{new Date(payment?.dueDate).toLocaleDateString('en-IN')}</td>
                                        
                                        <WhatsAppLink payment={payment} />
                                        <PhoneCallLink payment={payment} />

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
