// admin/AdminProduct.js
import React, { useState } from 'react';
import { createProduct } from '../services/api';

const AdminProduct = () => {
  const [product, setProduct] = useState({ name: '', description: '', price: '', image: '' });

  const handleAddProduct = async () => {
    try {
      const response = await createProduct(product);  // Gửi dữ liệu sản phẩm mới lên API
      console.log("Product added", response);
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Product Name"
      />
      <input
        type="text"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Product Description"
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        placeholder="Product Price"
      />
      <input
        type="file"
        onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
        placeholder="Product Image"
      />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AdminProduct;
