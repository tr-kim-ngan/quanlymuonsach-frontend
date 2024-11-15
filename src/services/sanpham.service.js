// sanpham.service.js
import apiClient from './api.service.js';

class SanPhamService {
  constructor(baseUrl = "/sanpham") {
    this.api = apiClient;
    this.baseUrl = baseUrl;
  }

  // Lấy tất cả sản phẩm
  async getTatCaSanPham() {
    const response = await this.api.get(this.baseUrl);
    console.log('Dữ liệu lấy từ API sản phẩm:', response.data); // Để kiểm tra dữ liệu nhận được từ API
    return response.data;
  }

  // Lấy chi tiết sản phẩm theo ID
  async getChiTietSanPham(id) {
    return (await this.api.get(`${this.baseUrl}/${id}`)).data;
  }
}

export default new SanPhamService();
