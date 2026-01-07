import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FaBell } from "react-icons/fa";
import config from "../config";

/* ---------- helpers ---------- */
const isOlderThanDays = (dateStr, days) => {
  const created = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays >= days;
};

const normalizeNotifications = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("RECENT"); // RECENT | HISTORY
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminRole, setAdminRole] = useState(
    localStorage.getItem("adminRole")
  );

  const clientRef = useRef(null);

  /* 🔁 sync role change */
  useEffect(() => {
    const handler = () =>
      setAdminRole(localStorage.getItem("adminRole"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* 📥 load notifications */
  useEffect(() => {
    if (adminRole !== "ADMIN") return;

    const token = localStorage.getItem("adminToken");

    fetch(`${config.BASE_ENV}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.json();
      })
      .then((data) => {
        const list = normalizeNotifications(data);
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      })
      .catch(() => setNotifications([]));
  }, [adminRole]);

  /* 🔌 websocket */
  useEffect(() => {
    if (adminRole !== "ADMIN") return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${config.BASE_ENV}/ws`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe("/topic/notifications", (msg) => {
        const n = JSON.parse(msg.body);
        setNotifications((prev) => [n, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [adminRole]);

  /* 🔔 mark read visually */
  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  if (adminRole !== "ADMIN") return null;

  /* ---------- split data ---------- */
  const recent = notifications.filter(
    (n) => !isOlderThanDays(n.createdAt, 15)
  );

  const history = notifications.filter((n) =>
    isOlderThanDays(n.createdAt, 15)
  );

  /* ---------- UI ---------- */
  return (
    <div className="position-relative d-inline-block ms-2">
      <button
        className="btn btn-primary position-relative"
        onClick={() => setOpen((v) => !v)}
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 bg-white border rounded shadow"
          style={{ width: 360, zIndex: 9999 }}
        >
          {/* tabs */}
          <div className="d-flex border-bottom">
            <button
              className={`btn btn-sm flex-fill ${
                activeTab === "RECENT"
                  ? "btn-light fw-bold"
                  : "btn-white"
              }`}
              onClick={() => setActiveTab("RECENT")}
            >
              Recent
            </button>
            <button
              className={`btn btn-sm flex-fill ${
                activeTab === "HISTORY"
                  ? "btn-light fw-bold"
                  : "btn-white"
              }`}
              onClick={() => setActiveTab("HISTORY")}
            >
              History (15+ days)
            </button>
          </div>

          {/* content */}
          <ul
            className="list-unstyled mb-0"
            style={{ maxHeight: 300, overflowY: "auto" }}
          >
            {(activeTab === "RECENT" ? recent : history).length ===
              0 && (
              <li className="p-3 text-muted text-center">
                No notifications
              </li>
            )}

            {(activeTab === "RECENT" ? recent : history).map(
              (n, i) => (
                <li
                  key={i}
                  className="p-3 border-bottom"
                >
                  <div className="fw-semibold">
                    {n.message}
                  </div>
                  <small className="text-muted">
                    {new Date(
                      n.createdAt
                    ).toLocaleString()}
                  </small>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
