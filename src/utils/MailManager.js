import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import config from "../config";

export default function MailManager() {
  const [users, setUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showMailWindow, setShowMailWindow] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [openSection, setOpenSection] = useState("registered");

  useEffect(() => {
    axios.get(`${config.BASE_URL}/users`).then((res) => setUsers(res.data));
  }, []);

  const toggleSelect = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const sendEmails = async () => {
    setIsSending(true);
    try {
      await axios.post(`${config.BASE_URL}/email/sendBulk`, {
        emails: selectedEmails,
        subject,
        body,
      });
      alert("✅ Email(s) sent successfully!");
      setShowMailWindow(false);
      setSelectedEmails([]);
      setSubject("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send email(s)");
    } finally {
      setIsSending(false);
    }
  };

  const registered = users.filter((u) => u.isRegistered === "Y");
  const unregistered = users.filter((u) => u.isRegistered === "N");

  // Accordion toggle handler
  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Smooth accordion styles using max-height and transition
  const accordionContentStyle = (isOpen) => ({
    maxHeight: isOpen ? "600px" : "0px",
    overflow: "hidden",
    transition: "max-height 0.5s ease",
  });

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans text-gray-900 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-4 text-indigo-700 drop-shadow-md">
        <span>📧</span> Mail Manager
      </h1>

      {/* Accordion for Registered Users */}
      <section className="mb-6 bg-white rounded-xl shadow-lg border border-indigo-200">
        <button
          onClick={() => handleToggle("registered")}
          className="w-full flex justify-between items-center px-6 py-3 text-indigo-800 font-semibold text-lg rounded-t-xl hover:bg-indigo-100 transition"
          aria-expanded={openSection === "registered"}
          aria-controls="registered-content"
        >
          Registered Users
          <span className={`transform transition-transform duration-300 ${openSection === "registered" ? "rotate-180" : "rotate-0"}`}>
            ▼
          </span>
        </button>
        <div
          id="registered-content"
          style={accordionContentStyle(openSection === "registered")}
          aria-hidden={openSection !== "registered"}
          className="px-6 pb-4"
        >
          {registered.length === 0 ? (
            <p className="py-4 text-indigo-400 font-medium">No registered users found.</p>
          ) : (
            <table className="w-full text-sm border-collapse border border-indigo-100 mt-3 rounded-md">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700 rounded-t-md">
                  <th className="py-2 px-3 w-12">Select</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {registered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-indigo-100 hover:bg-indigo-50 transition"
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        onChange={() => toggleSelect(u.email)}
                        checked={selectedEmails.includes(u.email)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 font-medium">{u.name}</td>
                    <td className="py-3 px-3 text-indigo-700">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Accordion for Unregistered Users */}
      <section className="mb-6 bg-white rounded-xl shadow-lg border border-red-200">
        <button
          onClick={() => handleToggle("unregistered")}
          className="w-full flex justify-between items-center px-6 py-3 text-red-700 font-semibold text-lg rounded-t-xl hover:bg-red-100 transition"
          aria-expanded={openSection === "unregistered"}
          aria-controls="unregistered-content"
        >
          Unregistered Users
          <span className={`transform transition-transform duration-300 ${openSection === "unregistered" ? "rotate-180" : "rotate-0"}`}>
            ▼
          </span>
        </button>
        <div
          id="unregistered-content"
          style={accordionContentStyle(openSection === "unregistered")}
          aria-hidden={openSection !== "unregistered"}
          className="px-6 pb-4"
        >
          {unregistered.length === 0 ? (
            <p className="py-4 text-red-400 font-medium">No unregistered users found.</p>
          ) : (
            <table className="w-full text-sm border-collapse border border-red-100 mt-3 rounded-md">
              <thead>
                <tr className="bg-red-100 text-red-700 rounded-t-md">
                  <th className="py-2 px-3 w-12">Select</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {unregistered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-red-100 hover:bg-red-50 transition"
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        onChange={() => toggleSelect(u.email)}
                        checked={selectedEmails.includes(u.email)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 font-medium">{u.name}</td>
                    <td className="py-3 px-3 text-red-700">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Compose Button */}
      <div className="mt-8 text-right">
        <button
          onClick={() => setShowMailWindow(true)}
          disabled={selectedEmails.length === 0}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
            selectedEmails.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          title={
            selectedEmails.length === 0
              ? "Select at least one recipient"
              : "Compose Email"
          }
        >
          ✉️ Compose Email ({selectedEmails.length} selected)
        </button>
      </div>

      {/* Mail Window Modal */}
      {showMailWindow && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-6">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowMailWindow(false)}
              className="absolute right-5 top-5 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-5 text-indigo-800">Compose Email</h2>
            <input
              className="border border-indigo-300 rounded-md p-3 w-full mb-5 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="border border-indigo-300 rounded-md p-3 w-full h-44 mb-6 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end gap-5">
              <button
                onClick={() => setShowMailWindow(false)}
                className="px-6 py-3 bg-gray-200 rounded-md font-semibold hover:bg-gray-300 transition"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={sendEmails}
                disabled={isSending || subject.trim() === "" || body.trim() === ""}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
