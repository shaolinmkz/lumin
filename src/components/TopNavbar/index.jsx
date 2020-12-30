import React from "react";
import { number } from "prop-types";
import { ReactComponent as CartIcon } from "../../assets/cart.svg";
import "./index.scss";

/**
 * @function TonNavbar
 * @description The top navigation bar component
 */
const TopNavbar = ({ totalItemInCart, handleCartModal }) => (
  <header>
    <nav>
      <ul>
        <li key="1">
          <a href={window.location.href}>
            L&nbsp; &nbsp; &nbsp;U&nbsp; &nbsp; &nbsp;M&nbsp; &nbsp;
            &nbsp;I&nbsp; &nbsp; &nbsp;N
          </a>
        </li>

        <li key="2">
          <button type="button" onClick={handleCartModal}>
            <CartIcon />
            <span className="cart-size">{totalItemInCart}</span>
          </button>
        </li>
      </ul>
    </nav>
  </header>
);

TopNavbar.propTypes = {
  totalItemInCart: number
};

TopNavbar.defaultProps = {
  totalItemInCart: 0
}

export default TopNavbar;
