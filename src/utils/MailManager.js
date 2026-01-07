import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
// import "../assets/plugins/animation/css/animate.min.css";
// import "../assets/css/style.css";

export default function MailManager() {
  const [users, setUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showMailWindow, setShowMailWindow] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [openSection, setOpenSection] = useState("registered");

  // Load users
  useEffect(() => {
    axiosInstance.get(`/users`).then((res) => setUsers(res.data));
  }, []);

  // Toggle checkbox
  const toggleSelect = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  // Send bulk emails
  const sendEmails = async () => {
    setIsSending(true);
    try {
      await axiosInstance.post(`/email/sendBulk`, {
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

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const accordionContentStyle = (isOpen) => ({
    maxHeight: isOpen ? "400px" : "0px",
    overflow: "hidden",
    transition: "max-height 0.35s ease",
  });

  const renderUserSection = (label, sectionKey, rows) => (
    <section className="mb-4 rounded-xl border border-slate-200 bg-slate-50/60">
      <button
        onClick={() => handleToggle(sectionKey)}
        className="flex w-full items-center justify-between px-4 py-2 text-left"
        aria-expanded={openSection === sectionKey}
        aria-controls={`${sectionKey}-content`}
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {rows.length} recipient{rows.length !== 1 && "s"} available
          </p>
        </div>
        <span
          className={`text-xs text-slate-500 transition-transform duration-200 ${
            openSection === sectionKey ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      <div
        id={`${sectionKey}-content`}
        style={accordionContentStyle(openSection === sectionKey)}
        className="px-4 pb-3"
      >
        {rows.length === 0 ? (
          <p className="py-4 text-xs text-slate-400">
            No {label.toLowerCase()} found.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-10 px-3 py-2 text-left font-medium text-slate-500">
                    Sel
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        onChange={() => toggleSelect(u.email)}
                        checked={selectedEmails.includes(u.email)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-slate-900">{u.name}</td>
                    <td className="px-3 py-2 text-slate-600">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-lg border border-slate-200 px-8 py-6 font-sans text-slate-900">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Mail manager
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Select recipients and send bulk communication.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            {users.length} users
          </span>
        </header>

        {/* User sections */}
        {renderUserSection("Registered users", "registered", registered)}
        {renderUserSection("Unregistered users", "unregistered", unregistered)}

        {/* Compose bar */}
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={() => setShowMailWindow(true)}
            disabled={selectedEmails.length === 0}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition
              ${
                selectedEmails.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            title={
              selectedEmails.length === 0
                ? "Select at least one recipient"
                : "Compose email"
            }
          >
            ✉ Compose email
            {selectedEmails.length > 0 && (
              <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px]">
                {selectedEmails.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal */}
        {showMailWindow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Compose email
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Sending to {selectedEmails.length} recipient
                    {selectedEmails.length > 1 && "s"}
                  </p>
                </div>
                <button
                  onClick={() => setShowMailWindow(false)}
                  className="text-lg leading-none text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* Modal body */}
              <div className="px-4 py-3 space-y-3">
                <input
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <textarea
                  className="h-32 w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Write your message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                <button
                  onClick={() => setShowMailWindow(false)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmails}
                  disabled={isSending || !subject.trim() || !body.trim()}
                  className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 btn-success"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
