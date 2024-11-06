// Import thư viện Axios
import axios from 'axios';

// Tạo một instance của Axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Địa chỉ URL của backend
  headers: {
    'Content-Type': 'application/json', // Thiết lập kiểu dữ liệu là JSON
  },
});

// Thêm interceptor để xử lý lỗi (nếu cần)
apiClient.interceptors.response.use(
  response => response, // Trả về phản hồi nếu thành công
  error => {
    console.error('Lỗi API:', error); // In ra lỗi nếu có
    return Promise.reject(error); // Trả lỗi về để xử lý tiếp
  }
);

// Xuất apiClient để sử dụng trong các file khác
export default apiClient;
