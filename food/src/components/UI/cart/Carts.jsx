import React from "react";
import { ListGroup } from "reactstrap";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";

import "../../../styles/shopping-cart.css";

const Carts = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  // Toggles cart visibility
  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  return (
    <div className="cart__container" onClick={toggleCart}>
      <ListGroup
        onClick={(event) => event.stopPropagation()} // Prevents cart from closing when interacting with the cart
        className="cart"
      >
        <div className="cart__closeButton">
          <span onClick={toggleCart}>
            <i className="ri-close-fill"></i>
          </span>
        </div>

        <div className="cart__item-list">
          {cartProducts.length === 0 ? (
            <div className="empty-cart-message text-center">
              <h6>No items added to the cart</h6>
              <p>Start shopping to fill your cart with delicious pizzas!</p>
            </div>
          ) : (
            cartProducts.map((item, index) => (
              <CartItem item={item} key={index} onClose={toggleCart} />
            ))
          )}
        </div>

        {cartProducts.length > 0 && (
          <div className="cart__bottom d-flex align-items-center justify-content-between">
            <h6>
              Subtotal : <span>${totalAmount.toFixed(2)}</span>
            </h6>
            <button>
              <Link to="/checkout" onClick={toggleCart}>
                Checkout
              </Link>
            </button>
          </div>
        )}
      </ListGroup>
    </div>
  );
};

export default Carts;
