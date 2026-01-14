import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '1rem'
      }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p style={{ color: '#666', margin: 0 }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
