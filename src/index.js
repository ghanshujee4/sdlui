import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';

// CSS Imports (Order matters)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

// Bootstrap JS (includes Popper automatically)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import ThemeProvider from 'react-bootstrap/ThemeProvider';

// import '../assets/css/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals();
