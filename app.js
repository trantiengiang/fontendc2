import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Lưu ý đổi Switch thành Routes

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminProduct from './admin/AdminProduct';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>   {/* Sử dụng Routes thay vì Switch */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
