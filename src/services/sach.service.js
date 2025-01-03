// sach.service.js
import apiClient from './api.service.js';

class SachService {
  constructor(baseUrl = "/sach") {
    this.api = apiClient;
    this.baseUrl = baseUrl;
  }

  // Lấy tất cả sách
  async layTatCa() {
   const response = await this.api.get(this.baseUrl);
    console.log('Dữ liệu lấy từ API:', response.data);
    return response.data;
  }

   // Thêm mới sách
  async themMoi(data) {
    // Truyền data là FormData
    return (await this.api.post(this.baseUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })).data;
  }

// Xóa sách theo ID
async xoa(id) {
    try {
        return (await this.api.delete(`${this.baseUrl}/${id}`)).data;
    } catch (error) {
        // Xử lý lỗi từ server và trả về để hiển thị chi tiết hơn trên frontend
        if (error.response) {
            throw error.response;
        }
        throw error;
    }
}


  // Lấy thông tin chi tiết của một cuốn sách
  async layTheoId(id) {
    return (await this.api.get(`${this.baseUrl}/${id}`)).data;
  }

  // Cập nhật sách
async capNhat(id, data) {
    return (await this.api.put(`${this.baseUrl}/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data' // Thiết lập Content-Type cho multipart/form-data
        }
    })).data;
}

}

export default new SachService();
