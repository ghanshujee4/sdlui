import React from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap"; // or MDBootstrap if you prefer
import config from "../config";
import axiosInstance from "../utils/axiosInstance";

const AadhaarSection = ({ user }) => {
  const handleDownloadAdhar = async () => {
    try {
      if (!user?.adharCard) {
        alert("Aadhaar file not available");
        return;
      }

      // Normalize URL (remove any leading slash)
      const filePath = user.adharCard.replace(/^\/+/, "");
      const url = `${config.BASE_ENV}/${filePath}`;

      const response = await axiosInstance.get(url, { responseType: "blob" });

      // Create download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filePath.split("/").pop();
      link.click();
    } catch (error) {
      console.error("❌ Download failed", error);
      alert("Failed to download Aadhaar. Please try again.");
    }
  };

  return (
    <Card className="shadow-sm p-3 mb-3 rounded" style={{ maxWidth: "500px" }}>
      <h5 className="mb-3">Aadhaar Card</h5>

      {user?.adharCard ? (
        <>
          <div className="mb-3">
            {/* Inline view (PDF in iframe or image if it's a jpg/png) */}
            {user.adharCard.endsWith(".pdf") ? (
              <iframe
                src={`${config.BASE_ENV}/${user.adharCard.replace(/^\/+/, "")}`}
                title="Aadhaar Preview"
                width="100%"
                height="300px"
                style={{ border: "1px solid #ddd", borderRadius: "10px" }}
              ></iframe>
            ) : (
              <img
                src={`${config.BASE_ENV}/${user.adharCard.replace(/^\/+/, "")}`}
                alt="Aadhaar Card"
                width="100%"
                style={{ borderRadius: "10px" }}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>

          <Button
            variant="primary"
            className="w-100"
            onClick={handleDownloadAdhar}
          >
            📄 Download Aadhaar
          </Button>
        </>
      ) : (
        <p className="text-muted">No Aadhaar card uploaded.</p>
      )}
    </Card>
  );
};

export default AadhaarSection;
