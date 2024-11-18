// Import thư viện Axios
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json', 
  },
});

apiClient.interceptors.response.use(
  response => response, // Trả về phản hồi nếu thành công
  error => {
    console.error('Lỗi API:', error); // In ra lỗi nếu có
    return Promise.reject(error); // Trả lỗi về để xử lý tiếp
  }
);

export default apiClient;
