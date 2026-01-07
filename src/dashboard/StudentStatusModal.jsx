import React from 'react';
import PaymentQR from "../utils/PaymentQR";

const StudentStatusModal = ({ userData , paymentData }) => {
  return (
    <>
      {/* Hidden trigger button */}
      <button
        type="button"
        className="d-none"
        id="triggerStudentModal"
        data-bs-toggle="modal"
        data-bs-target="#inactiveStudentModal"
      />

      <div
        className="modal fade"
        id="inactiveStudentModal"
        tabIndex="-1"
        aria-labelledby="inactiveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">

            {/* Header */}
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="inactiveModalLabel">❌ Access Restricted</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />
            </div>

            {/* Body */}
            <div className="modal-body text-center fs-5">
              <p>Hello <strong>{userData?.name}</strong>,</p>

              <p>
                Your account status is:{" "}
                <strong className="text-danger">✖ Inactive</strong>
              </p>

              <p className="text-muted">
                Please contact the administrator for assistance.
              </p>

              <p className="fw-bold text-warning">
                💰 You have outstanding dues.<br />
                ✔ Please clear your dues.<br />
                ✔ Submit an Activation Request.
              </p>

              {/* Payment QR Section */}
              {!paymentData?.paid ? (
                <div className="mt-3">
                  <h6 className="text-primary">Scan to Complete Payment</h6>
                  <PaymentQR
                    userId={userData?.id}
                    userName={userData?.name}
                    amount={paymentData.amount}
                  />
                </div>
              ) : (
                <div className="mt-3 text-success fw-bold">No Pending Payments ✔</div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary px-4"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentStatusModal;
