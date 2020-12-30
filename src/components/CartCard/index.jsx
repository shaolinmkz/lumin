import React from "react";
import { currencyFormatter } from "../../utils";
import { string, object as objectPropType, func } from "prop-types";
import "./index.scss";

/**
 * @function CartCard
 * @description Cart card component
 * @param {object} props - properties
 * @param {object} props.cartData - cart Data
 * @param {string} props.currency - price currency
 * @param {Function} props.handleIncrementDecrement - handles increase and decrease of product
 * @param {Function} props.handleRemove - handles the removal of a product from the cart
 */
const CartCard = ({
  cartData,
  currency,
  handleIncrementDecrement,
  handleRemove,
}) => (
  <div className="cart-card">
    <button
      type="button"
      className="remove-item"
      id={cartData.id}
      onClick={handleRemove}
    >
      &times;
    </button>
    <p>{cartData.title}</p>

    <section className="img-container">
      <img src={cartData.image_url} alt="" />
    </section>

    <section className="increment-controller">
      <div>
        <button
          disabled={cartData.count === 1}
          type="button"
          id={cartData.id}
          value="-"
          onClick={handleIncrementDecrement}
        >
          -
        </button>
        <span>{cartData.count}</span>
        <button
          type="button"
          id={cartData.id}
          value="+"
          onClick={handleIncrementDecrement}
        >
          +
        </button>
      </div>

      <p>{currencyFormatter(cartData.price, currency)}</p>
    </section>
  </div>
);

CartCard.propTypes = {
  currency: string.isRequired,
  cartData: objectPropType.isRequired,
  handleIncrementDecrement: func.isRequired,
  handleRemove: func.isRequired,
};

export default CartCard;
