import React from "react";
import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/checkout.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  // Function to open the Razorpay payment gateway
  const handlePayment = () => {
    // Declare Razorpay as a global object
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_LgeTONMHbSUmnn", // Replace with your Razorpay API Key
        amount: totalAmount * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        name: "Your Order",
        description: "Your order at Our College Store",
        image: "https://your-logo-url.com/logo.png", // Optional: Add your logo here
        handler: function (response) {
          alert("Payment Successful!");
          // Here you can send the response.payment_id to your server to verify the payment
        },
        prefill: {
          name: "Customer Name", // Optional: Add user's name
          email: "customer@example.com", // Optional: Add user's email
        },
        notes: {
          address: "Some address", // Optional: Add any additional notes
        },
        theme: {
          color: "#F37254", // Optional: Set theme color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay script not loaded. Please try again.");
    }
  };

  return (
    <div className="checkoutContainer">
      <CommonSection title="Checkout" />
      <div className="checkoutMessage">
        <div className="checkoutTitleContainer">
          <AiFillCheckCircle className="checkoutIcon" />
          <h3>Thank you for your order!</h3>
        </div>
        <p className="checkoutText">
          Your order is being processed and will be delivered as fast as possible.
        </p>
        <div className="checkoutActions">
          <Link to="/pizzas" className="continueShoppingBtn">
            Continue Shopping
          </Link>
          <Link to="/" className="goHomeBtn">
            Go to Home
          </Link>
          {/* Razorpay button to proceed with payment */}
          <button className="proceedToPaymentBtn" onClick={handlePayment}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
