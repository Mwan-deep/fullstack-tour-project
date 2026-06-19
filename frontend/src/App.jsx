import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State quản lý chữ và số
  const [formData, setFormData] = useState({ name: '', destination: '', price: '' });
  // STATE MỚI: Quản lý riêng file ảnh do người dùng chọn
  const [imageFile, setImageFile] = useState(null); 
  // State quản lý trạng thái đang upload (để hiện chữ "Đang xử lý...")
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/tours');
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
      const response = await axios.post('http://localhost:8080/api/auth/login', loginData);
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

  // HÀM MỚI: Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Lấy file đầu tiên người dùng chọn
  };

  // CẬP NHẬT: Hàm Submit thực hiện 2 API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Khóa nút bấm để tránh double-click

    try {
      let uploadedImageUrl = null;

      // BƯỚC 1: Nếu người dùng có chọn ảnh, gọi API Upload trước
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile); // 'file' phải khớp với tên biến trong Spring Boot

        // Gọi API Upload (Nhớ truyền Token vào)
        const uploadRes = await axios.post('http://localhost:8080/api/upload', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ép kiểu gửi file
            'Authorization': `Bearer ${token}`
          }
        });
        
        uploadedImageUrl = uploadRes.data.url; // Hứng cái URL từ Cloudinary trả về
      }

      // BƯỚC 2: Gọi API lưu Tour cùng với cái URL vừa nhận được
      const finalTourData = {
        ...formData,
        imageUrl: uploadedImageUrl // Nhét thêm URL vào Object gửi đi
      };

      await axios.post('http://localhost:8080/api/tours', finalTourData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Xóa trắng form sau khi xong
      setFormData({ name: '', destination: '', price: '' });
      setImageFile(null);
      // Reset thẻ input file bằng cách dùng ID
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
      setIsSubmitting(false); // Mở khóa nút bấm
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
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors mt-2">
              Đăng Nhập
            </button>
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
        
        {/* FORM THÊM MỚI (Có bổ sung input file) */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thêm Tour Mới</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" name="name" placeholder="Tên Tour" value={formData.name} onChange={handleInputChange} required className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="destination" placeholder="Điểm đến" value={formData.destination} onChange={handleInputChange} required className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" name="price" placeholder="Giá tiền (VNĐ)" value={formData.price} onChange={handleInputChange} required min="0" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            
            {/* INPUT CHỌN FILE */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input 
                type="file" 
                id="imageInput"
                accept="image/*" 
                onChange={handleFileChange} 
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors whitespace-nowrap ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Đang tải lên...' : '+ Thêm Tour'}
              </button>
            </div>
          </form>
        </div>

        {/* DANH SÁCH TOUR (Có bổ sung hình ảnh) */}
        {loading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                
                {/* HIỂN THỊ ẢNH (Nếu không có ảnh thì hiện ảnh mặc định) */}
                <div className="h-48 w-full bg-gray-200 overflow-hidden">
                  <img 
                    src={tour.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                    alt={tour.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
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