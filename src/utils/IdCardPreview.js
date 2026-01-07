import React, { forwardRef } from "react";
import "./IdCard.css";
import { downloadIdCard } from "./DownloadIdCard";
import formatDateDDMMYYYY from "./formatDateDDMMYYYY";


const IdCardPreview = forwardRef(({ user, onDownload }, ref) => {
  if (!user) return null;

  return (
    <div className="idcard-container">
      <div className="idcard-card" ref={ref}>
        {/* Top wave / brand bar */}
        <div className="idcard-top">
          <div className="idcard-logo-circle">
            <img src="../../../logo.png" alt="Shastra Digital Library" height={42} width={42} style={{ marginLeft: '17px' }}/>
            {/* Replace with  if you have a logo */}
            <span>SDL</span>
          </div>
          <div className="idcard-brand-text">
            <h1>SHASTRA DIGITAL LIBRARY</h1>
            <p>Member Identification Card</p>
          </div>
        </div>

        {/* Main content */}
        <div className="idcard-body">
          <div className="id-row">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>
          <div className="id-row">
            <span>Mobile</span>
            <strong>{user.mobile}</strong>
          </div>
          <div className="id-row">
            <span>Seat</span>
            <strong>{user.seat}</strong>
          </div>
          <div className="id-row">
            <span>Shift</span>
            <strong>{user.shift} {!user?.extraHour == 0 && <strong> ({user?.extraHour})<span> h</span></strong>}</strong> 
          </div>
        </div>

        {/* Glowing validity watermark */}
        <div className="idcard-validity-watermark">
          VALIDITY <br></br> <b>
            {/* {formatDateDDMMYYYY(user.validTill - 1)} */}
            {formatDateDDMMYYYY(new Date(user.validTill).getTime() - 86400000)}
            </b>
        </div>

        {/* Footer */}
        <div className="idcard-footer">
          <button onClick={onDownload}>Download ID Card</button>
        </div>
      </div>
    </div>
  );
});

export default IdCardPreview;
