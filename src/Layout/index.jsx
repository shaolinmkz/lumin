import React from "react";
import TopNavbar from "../components/TopNavbar";

const Layout = ({ children, totalItemInCart, handleCartModal }) => {

  return (
    <div className="app">
      <TopNavbar totalItemInCart={totalItemInCart} handleCartModal={handleCartModal} />
      {children}
    </div>
  );
};

export default Layout;
