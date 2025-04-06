import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({ 
    usernameOrEmail: '', // Đổi từ email sang usernameOrEmail
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Login payload:', formData); // Debug log
      
      const response = await authAPI.login(formData);
      console.log('Login response:', response); // Debug log

      if (!response?.token) {
        throw new Error(response?.message || 'Đăng nhập không thành công');
      }

      localStorage.setItem('token', response.token);
      navigate('/');

    } catch (err) {
      console.error('Login error details:', {
        error: err,
        response: err.response?.data
      });

      // Xử lý lỗi từ backend
      const serverError = err.response?.data;
      setError(
        serverError?.message || 
        err.message || 
        'Sai tên đăng nhập hoặc mật khẩu'
      );
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng Nhập</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên đăng nhập/Email:</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
}

export default Login;