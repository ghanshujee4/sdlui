import React from "react";

const CustomDot = ({ cx, cy, payload }) => {
  if (!cx || !cy) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#28a745"
      stroke="#0d6efd"
      strokeWidth={11}
      style={{ cursor: "pointer", zIndex: "999" }}
      onClick={() => {
        console.log('CustomDot cliked')
        if (payload && payload.paidBy && payload.paidBy.length > 0) {
            const details = payload.paidBy
            .map(s => `${s.name}: ₹${s.amount}`)
            .join("\n");
              alert(`Payments on ${payload.day}:\n${details}`);
        } else {
          alert(`No students recorded for ${payload.day}`);
        }
        console.log("dot clicked", payload);
      }}
    />
  );
};

export default CustomDot;
