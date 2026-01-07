import React from "react";

const DateFormatter = ({ value, isEditing, onChange, name }) => {
  // Function to format date to "dd-MMM-yyyy"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateString.split("-");
    return `${day}-${months[parseInt(month, 10) - 1]}-${year}`;
  };

  return isEditing ? (
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    />
  ) : (
    <span>{formatDate(value)}</span>
  );
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
};


export default DateFormatter;