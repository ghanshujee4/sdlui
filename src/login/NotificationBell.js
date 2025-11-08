import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FaBell } from "react-icons/fa";
import config from "../config";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role"); // get role from storage
  
  useEffect(() => {
    if (role !== "admin") return;
    // Create STOMP client
  const client = new Client({
  webSocketFactory: () => new SockJS(`${config.BASE_ENV}/ws`),
  reconnectDelay: 5000,
  debug: (str) => console.log(str),
});


    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      client.subscribe("/topic/notifications", (message) => {
        console.log("📩 Incoming message:", message.body);
        console.log("📩 Incoming header:",message.headers);
        const newNotification = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [role]);

  if (role !== "admin") return null;

  return (
    <button className="btn bg-primary text-wrap card btn-info pull-left margin-left-10">
    <div className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <FaBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="max-h-72 overflow-y-auto list-unstyled">
            {notifications.map((n, i) => (
              <li key={i} className="p-3 border-b border-gray-100 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
               <div class="text-gray-800 font-medium color-green"> {n.message} </div>
               <div class="text-gray-500 text-sm"> {new Date(n.timestamp).toLocaleString()} </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </button>
  );
}

export default NotificationBell;
