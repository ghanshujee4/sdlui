import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FaBell } from "react-icons/fa";
import config from "../config";

const isOlderThanDays = (dateStr, days) => {
  const created = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays >= days;
};

const normalizeNotifications = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

function StudentNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("RECENT");
  const [unreadCount, setUnreadCount] = useState(0);
  const [studentRole, setStudentRole] = useState(
    localStorage.getItem("token") && !localStorage.getItem("adminToken") ? "USER" : null
  );
  const clientRef = useRef(null);

  useEffect(() => {
    const handler = () =>
      setStudentRole(
        localStorage.getItem("token") && !localStorage.getItem("adminToken") ? "USER" : null
      );
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (studentRole !== "USER") return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    fetch(`${config.BASE_API_ROOT}/notifications/my?page=0&size=30`, {
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
  }, [studentRole]);

  useEffect(() => {
    if (studentRole !== "USER") return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${config.BASE_ENV}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 10000,
    });
    client.onConnect = () => {
      client.subscribe(`/topic/notifications/user/${userId}`, (msg) => {
        const n = JSON.parse(msg.body);
        setNotifications((prev) => [n, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    };
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [studentRole]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    try {
      await fetch(`${config.BASE_API_ROOT}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  if (studentRole !== "USER") return null;

  const recent = notifications.filter((n) => !isOlderThanDays(n.createdAt, 15));
  const history = notifications.filter((n) => isOlderThanDays(n.createdAt, 15));

  return (
    <div className="position-relative d-inline-block ms-2">
      <button
        className="btn btn-primary position-relative padding-xs-0"
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
          <div className="d-flex border-bottom">
            <button
              className={`btn btn-sm flex-fill ${activeTab === "RECENT" ? "btn-light fw-bold" : "btn-white"}`}
              onClick={() => setActiveTab("RECENT")}
            >
              Recent
            </button>
            <button
              className={`btn btn-sm flex-fill ${activeTab === "HISTORY" ? "btn-light fw-bold" : "btn-white"}`}
              onClick={() => setActiveTab("HISTORY")}
            >
              History (15+ days)
            </button>
          </div>
          <ul className="list-unstyled mb-0" style={{ maxHeight: 300, overflowY: "auto" }}>
            {(activeTab === "RECENT" ? recent : history).length === 0 && (
              <li className="p-3 text-muted text-center">No notifications</li>
            )}
            {(activeTab === "RECENT" ? recent : history).map((n, i) => (
              <li
                key={i}
                className="p-3 border-bottom cursor-pointer"
                onClick={() => markAsRead(n.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="fw-semibold">{n.message}</div>
                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentNotificationBell;
