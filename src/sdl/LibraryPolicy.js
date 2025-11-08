import React from "react";


const LibraryPolicy = () => {
  return (
    <div className="">
      <div className="card shadow-4-strong p-4 rounded">
        <div className="card prod-p-card">
          <h3 className="card-header bg-primary text-white">
            📚 Shastra Digital Library – Policies & Guidelines
          </h3>
          <p className="lead text-muted text-center mb-4">
            All students are required to adhere to the following policies to maintain a peaceful and productive study environment.
          </p>

          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <strong>1. Admission & Attendance:</strong> Students must register online and sign in daily at the front desk. Regular attendance ensures seat retention.
            </li>
            <li className="list-group-item">
              <strong>2. Library Timings:</strong> The library is open 24×7 for registered members. Please respect quiet hours and avoid loud conversation.
            </li>
            <li className="list-group-item">
              <strong>3. Seat & Shift Allocation:</strong> Seats are assigned based on shift preference. Shifts may be changed only through an approved seat-shift request.
            </li>
            <li className="list-group-item">
              <strong>4. Payment Policy:</strong> Monthly payments should be cleared before the due date. Failure to pay may result in seat cancellation or deactivation.
            </li>
            <li className="list-group-item">
              <strong>5. Cleanliness & Decorum:</strong> Maintain a quiet and clean environment. Eating or sleeping inside the study hall is not allowed.
            </li>
            <li className="list-group-item">
              <strong>6. Prohibited Activities:</strong> Mobile gaming, video calls, or group discussions that disturb others are strictly prohibited.
            </li>
            <li className="list-group-item">
              <strong>7. Wi-Fi Usage:</strong> Free Wi-Fi is provided for study and research only. Any misuse may lead to suspension.
            </li>
            <li className="list-group-item">
              <strong>8. Personal Belongings:</strong> The library is not responsible for loss of personal items. Students should keep their belongings secure.
            </li>
            <li className="list-group-item">
              <strong>9. Emergency Conduct:</strong> Follow staff instructions during emergencies or maintenance periods.
            </li>
            <li className="list-group-item">
              <strong>10. Violation Consequences:</strong> Repeated violations may lead to suspension or termination of membership without refund.
            </li>
             <li className="list-group-item">
              <strong>11. No carry forward or Refund Policy:</strong> There is no carry forward or refund of paid fees are applicable in Library.
            </li>
          </ul>

          <div className="text-center mt-4">
            <p className="text-secondary">
              By continuing to use the facilities of Shastra Digital Library, students confirm that they have read and agreed to all the above policies.
            </p>
            <p className="fw-bold mt-3 mb-0">— Library Administration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPolicy;
