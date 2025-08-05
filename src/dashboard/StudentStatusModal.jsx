import React from 'react';

const StudentStatusModal = ({ userData }) => {
  return (
    <>
      {/* Hidden button to trigger modal (optional fallback) */}
      <button
        type="button"
        className="d-none"
        id="triggerStudentModal"
        data-bs-toggle="modal"
        data-bs-target="#inactiveStudentModal"
      >
        Trigger Modal
      </button>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="inactiveStudentModal"
        tabIndex="-1"
        aria-labelledby="inactiveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="inactiveModalLabel">Access Denied</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Student is not allowed. Please contact the administrator.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
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
