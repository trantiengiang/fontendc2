// src/components/Cards/Card.js
import React from 'react';

const Card = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {/* Thêm các thông tin khác của sản phẩm */}
    </div>
  );
};

export default Card;