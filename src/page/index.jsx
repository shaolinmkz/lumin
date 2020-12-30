import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import "./index.scss";
import { ReactComponent as ChevronLeft } from "../assets/chevron-left.svg";
import emptyCartItemIcon from "../assets/empty-cart.svg";
import ItemCard from "../components/ItemCard";
import NoData from "../components/NoData";
import Loader from "../components/Loader";
import { currencyFormatter } from "../utils";
import CartCard from "../components/CartCard";
import Layout from "../Layout";

const FETCH_PRODUCTS = gql`
  query($currency: Currency!) {
    products {
      id
      title
      image_url
      price(currency: $currency)
    }
  }
`;

const FETCH_CURRENCIES = gql`
  query {
    currency
  }
`;

const Hero = () => {
  const [state, setState] = useState({
    currency: "USD",
    currencies: [],
    products: [],
    cart: [],
    subtotal: 0,
    openCart: false,
  });

  const { data: currenciesResponse } = useQuery(FETCH_CURRENCIES);

  const { loading: fetchingProducts, data: productsResponse } = useQuery(
    FETCH_PRODUCTS,
    {
      variables: {
        currency: state.currency,
      },
    }
  );

  const { currencies, products, openCart, currency, cart, subtotal } = state;

  const handleCartModal = () => {
    setState((prevState) => {
      document.body.style.overflow = prevState.openCart ? "initial" : "hidden";

      return {
        ...prevState,
        openCart: !prevState.openCart,
      };
    });
  };

  const handleSubtotal = () => {
    setState((prevState) => ({
      ...prevState,
      subtotal: prevState.cart.reduce((acc, cv) => acc + cv.subAmount, 0),
    }));
  };

  const handleAddToCart = ({ target: { id } }) => {
    const selectedProduct = products.find(
      ({ id: productId }) => `${productId}` === `${id}`
    );

    const newCartEntry = {
      ...selectedProduct,
      quantity: 1,
      subAmount: selectedProduct.price,
    };

    setState((prevState) => {
      const productExistInCart = prevState.cart.find(
        ({ id: productId }) => `${productId}` === `${id}`
      );

      if (!productExistInCart) {
        return {
          ...prevState,
          cart: prevState.cart.concat(newCartEntry),
        };
      } else {
        return {
          ...prevState,
          cart: prevState.cart.map((item) => {
            const quantity = item.quantity + 1;

            return `${item.id}` === `${id}`
              ? {
                  ...item,
                  quantity,
                  subAmount: quantity * item.price,
                }
              : item;
          }),
        };
      }
    });

    handleSubtotal();
    handleCartModal();
  };

  const handleCurrencyChange = ({ target: { value } }) => {
    setState((prevState) => ({
      ...prevState,
      currency: value,
    }));
  };

  const handleIncrementDecrement = ({ target: { id, value } }) => {
    setState((prevState) => ({
      ...prevState,
      cart: prevState.cart.map((item) => {
        const quantity = value === "+" ? item.quantity + 1 : item.quantity - 1;

        return `${item.id}` === `${id}`
          ? {
              ...item,
              quantity,
              subAmount: quantity * item.price,
            }
          : item;
      }),
    }));

    handleSubtotal();
  };

  const handleRemove = ({ target: { id } }) => {
    setState((prevState) => ({
      ...prevState,
      cart: prevState.cart.filter(
        ({ id: productId }) => `${productId}` !== `${id}`
      ),
    }));

    handleSubtotal();
  };

  useEffect(() => {
    if (productsResponse?.products) {
      setState((prevState) => ({
        ...prevState,
        products: productsResponse.products,
        cart: prevState.cart.map(cartData => {
          const presentCartItem = productsResponse.products.find(({ id }) => `${id}` === `${cartData.id}`)
          return {
            ...cartData,
            price: presentCartItem.price,
            subAmount: cartData.quantity *  presentCartItem.price,
          }
        })
      }));

      handleSubtotal();
    }
  }, [productsResponse, currency]);

  useEffect(() => {
    if (currenciesResponse?.currency) {
      setState((prevState) => ({
        ...prevState,
        currencies: currenciesResponse.currency,
      }));
    }
  }, [currenciesResponse]);

  if (fetchingProducts) {
    return (
      <Layout totalItemInCart={cart.length}>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout totalItemInCart={cart.length} handleCartModal={handleCartModal}>
      {products.length ? (
        <>
          <div className="app-wrapper">
            <section className="section-one">
              <h4>All Products</h4>
              <p>A 360&deg; look at Lumin</p>
            </section>

            <section className="section-two">
              {products.map((data) => (
                <ItemCard
                  key={data.id}
                  id={data.id}
                  imageUrl={data.image_url}
                  title={data.title}
                  price={currencyFormatter(data.price, currency)}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </section>
          </div>
          {openCart && (
            <div className="cart-slider-modal" id="cart-slider-modal" onClick={({ target: { id }}) => {
              if(id === 'cart-slider-modal') {
                handleCartModal();
              }
            }}>
              <aside className="cart-slider">
                <div className="back-btn-container">
                  <button type="button" onClick={handleCartModal}>
                    <ChevronLeft />
                  </button>
                  <span>YOUR CART</span>
                </div>

                <div className="custom-select">
                  <select value={currency} onChange={handleCurrencyChange}>
                    {currencies.map((currencyValue) => (
                      <option key={currencyValue} value={currencyValue}>
                        {currencyValue}
                      </option>
                    ))}
                  </select>
                </div>

                <section className="cart-scrollview">
                  {cart.length ? (
                    cart.map((cartData) => (
                      <CartCard
                        key={cartData.id}
                        cartData={cartData}
                        currency={currency}
                        handleRemove={handleRemove}
                        handleIncrementDecrement={handleIncrementDecrement}
                      />
                    ))
                  ) : (
                    <div className="empty-cart">
                      <img src={emptyCartItemIcon} alt="" />
                      <p>Empty Cart</p>
                    </div>
                  )}
                </section>

                <section className="checkouts">
                  <div>
                    <p>Subtotal</p>
                    <p>{currencyFormatter(subtotal, currency)}</p>
                  </div>

                  <button disabled type="button" className="subscribe-discount">
                    MAKE THIS A SUBSCRIPTION (SAVE 20%)
                  </button>
                  <button disabled type="button" className="cart-proceed">
                    PROCEED TO CHECKOUT
                  </button>
                </section>
              </aside>
            </div>
          )}
        </>
      ) : (
        <div className="app-wrapper">
          <NoData />
        </div>
      )}
    </Layout>
  );
};

export default Hero;
