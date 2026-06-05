import React, { useState } from "react";
import adminAxios from "../utils/axiosInstance";
import { FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import config from "../config";

const PaymentRequestButton = ({ userId, paymentId }) => {
  const [loading, setLoading] = useState(false);
  const raiseRequest = async (type) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const url = `${config.BASE_URL}/requests/${userId}?type=PAYMENT_APPROVAL&details=paymentId=${paymentId},type=${type}`;

      await adminAxios.post(url); // ✅ interceptor handles token
      
      toast.success(`Request sent for ${type} payment ✅`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      
      {/* 💰 CASH */}
      <button
        disabled={loading}
        onClick={() => raiseRequest("CASH")}
        className="btn btn-warning btn-sm"
      >
        <FaMoneyBillWave /> Cash
      </button>

      {/* 🌐 ONLINE */}
      <button
        disabled={loading}
        onClick={() => raiseRequest("ONLINE")}
        className="btn btn-success btn-sm"
      >
        <FaCheckCircle /> Online
      </button>
    </div>
  );
};

export default PaymentRequestButton;