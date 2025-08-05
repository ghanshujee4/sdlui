import React from "react";
// import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <main className="container-fluid mt-4">{children}</main>
    </>
  );
};

export default Layout;// Placeholder for Layout.js