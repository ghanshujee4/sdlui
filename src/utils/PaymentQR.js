import {React, useState} from "react";
import { QRCodeCanvas } from "qrcode.react"; 

const PaymentQR = ({ userId, userName, amount }) => {
    const [showModal, setShowModal] = useState(false);
  // Example: your backend payment URL
  const upiLink = `upi://pay?pa=Q362873870@ybl&pn=PhonePeMerchant&mc=0000&mode=02&purpose=00&am=${amount}&cu=INR&tn=Payment%20for%20${userName}`;


  return (
     <div className="text-center">
      {/* Small QR */}
      <div
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
      <QRCodeCanvas value={upiLink} size={30} includeMargin={true} />
      {/* <p className="mt-2">
        Scan to pay
      </p> */}
       </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeCanvas value={upiLink} size={250} includeMargin={true} />
            <p style={{ marginTop: "10px" }}>Scan to pay {userName}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "15px",
                padding: "6px 12px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentQR;
