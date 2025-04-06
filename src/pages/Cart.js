// Cart.js
import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Lấy thông tin giỏ hàng từ localStorage hoặc API
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleCheckout = () => {
    // Gửi yêu cầu thanh toán đến backend
    // TODO: Xử lý thanh toán ở đây
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <div>
        {cartItems.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.quantity} x ${item.price}</p>
          </div>
        ))}
      </div>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
