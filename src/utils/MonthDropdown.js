import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBTextArea
  }
    from 'mdb-react-ui-kit';

const MonthDropdown = () => {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];




  return (
    
    <div>
      <label htmlFor="month">Select a Month: </label>
     <select id="month" value={selectedMonth} onChange={handleChange}>
         <option value="">-- Select --</option>
       {months.map((month, index) => (
         <option key={index} value={month}>
           {month}
         </option>
        ))}
      </select>
      {selectedMonth && <p>You selected: {selectedMonth}</p>}
    </div>
  );
};

export default MonthDropdown;