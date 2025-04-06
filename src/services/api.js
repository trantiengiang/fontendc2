import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  },
  (error) => {
    console.error('[API] Response Error:', error);
    
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.',
        code: 'NETWORK_ERROR'
      });
    }

    const { status, data } = error.response;
    let errorMessage = data?.message || 'Đã xảy ra lỗi';

    // Xử lý thông báo lỗi chi tiết
    if (data?.errors) {
      errorMessage = Object.entries(data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');
    }

    return Promise.reject({
      success: false,
      message: errorMessage,
      status,
      data
    });
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
      // Chuẩn bị data theo đúng yêu cầu backend
      const loginData = {
        // Gửi cả email và usernameOrEmail để phù hợp với backend
        usernameOrEmail: credentials.email,
        email: credentials.email,
        password: credentials.password
      };

      const response = await api.post('/auth/login', loginData);
      
      // Debug: Log dữ liệu gửi đi và nhận về
      console.log('Request data:', loginData);
      console.log('Response data:', response.data);
      
      if (!response.data?.token) {
        throw new Error('Token không tồn tại trong response');
      }
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    } catch (error) {
      console.error('Auth API Error:', {
        config: error.config,
        response: error.response?.data
      });
      throw error;
    }
  },
  // ... các methods khác


  register: (userData) => api.post('/auth/signup', {
    username: userData.username.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  getProfile: () => api.get('/auth/me')
};

// API Products
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductDetails: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export default api;