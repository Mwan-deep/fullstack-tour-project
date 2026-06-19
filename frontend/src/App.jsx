import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Lấy đường dẫn API từ biến môi trường của Vite
  // Nếu không có, mặc định sẽ là localhost (để đề phòng lỗi)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', destination: '', price: '' });
  const [imageFile, setImageFile] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tours`);
      setTours(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến Backend.");
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
      const receivedToken = response.data.token;
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      setAuthError('');
    } catch (err) {
      setAuthError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        uploadedImageUrl = uploadRes.data.url;
      }

      const finalTourData = {
        ...formData,
        imageUrl: uploadedImageUrl
      };

      await axios.post(`${API_BASE_URL}/api/tours`, finalTourData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setFormData({ name: '', destination: '', price: '' });
      setImageFile(null);
      document.getElementById('imageInput').value = ''; 
      
      fetchTours();
      alert("Thêm Tour thành công!");
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
        handleLogout();
      } else {
        alert("Có lỗi xảy ra. Hãy kiểm tra Console (F12).");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Đăng Nhập Quản Trị</h2>
          {authError && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{authError}</div>}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <input type="text" name="username" placeholder="Tài khoản" value={loginData.username} onChange={handleLoginChange} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" name="password" placeholder="Mật khẩu" value={loginData.password} onChange={handleLoginChange} required className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors mt-2">Đăng Nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-4xl font-bold text-blue-700">Hệ Thống Quản Lý Tour Du Lịch</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">Đăng Xuất</button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thêm Tour Mới</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="name" placeholder="Tên Tour" value={formData.name} onChange={handleInputChange} required className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="destination" placeholder="Điểm đến" value={formData.destination} onChange={handleInputChange} required className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" name="price" placeholder="Giá tiền (VNĐ)" value={formData.price} onChange={handleInputChange} required min="0" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input type="file" id="imageInput" accept="image/*" onChange={handleFileChange} className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <button type="submit" disabled={isSubmitting} className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors whitespace-nowrap ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isSubmitting ? 'Đang tải lên...' : '+ Thêm Tour'}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="h-48 w-full bg-gray-200 overflow-hidden">
                  <img src={tour.imageUrl || "https://placehold.co/600x400?text=No+Image"} alt={tour.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{tour.name}</h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium">📍 {tour.destination}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="text-2xl font-extrabold text-blue-600">
                      {Number(tour.price).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;