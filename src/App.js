import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import api from './services/api'; // Sử dụng export default
import Login from './pages/Login';
import Register from './pages/Register';

// Cập nhật authAPI
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password
      });
      
      if (!response.data?.token) {
        throw new Error('Không nhận được token');
      }
      
      return {
        token: response.data.token,
        user: response.data.user
      };
    } catch (error) {
      console.error('Login API error:', {
        request: error.config?.data,
        response: error.response?.data
      });
      throw error;
    }
  },
  // ... các methods khác
};

// Giữ nguyên productAPI và các components khác
export const productAPI = {
  getProducts: async (options = {}) => {
    const response = await api.get('/products', options);
    return response.data;
  },
  getProductDetails: async (id, options = {}) => {
    const response = await api.get(`/products/${id}`, options);
    return response.data;
  }
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getProducts({ 
          signal: controller.signal 
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <a href={`/products/${product.id}`}>View Details</a>
        </div>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getProductDetails(id, {
          signal: controller.signal
        });
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError(error.message || 'Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)}>Back to Products</button>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    
    const checkAuth = async () => {
      try {
        await authAPI.getProfile({ signal: controller.signal });
        setAuth(true);
      } catch (error) {
        setAuth(false);
        setError('Please login to continue');
        navigate('/login', { state: { from: location.pathname } });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();

    return () => controller.abort();
  }, [navigate]);

  if (loading) return <div className="loading">Checking authentication...</div>;
  if (error) return <div className="error">{error}</div>;
  return auth ? children : null;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Thanh điều hướng đơn giản */}
        <header className="app-header">
          <div className="nav-container">
            <a href="/" className="logo">MyShop</a>
            <nav className="main-nav">
              <a href="/products">Products</a>
              <div className="auth-links">
                <a href="/login">Login</a>
                <a href="/signup">Register</a>
              </div>
            </nav>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="main-content">
          <Routes>
            {/* Các route công khai */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            
            {/* Các route được bảo vệ */}
            <Route path="/" element={<PrivateRoute><ProductList /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
            
            {/* Redirect cho các đường dẫn không tồn tại */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2023 My App</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;