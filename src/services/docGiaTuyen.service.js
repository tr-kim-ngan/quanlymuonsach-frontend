// docGia.service.js
import apiClient from './api.service.js';

class DocGiaService {
  constructor(baseUrl = "/docgia") {
    this.api = apiClient;
    this.baseUrl = baseUrl;
  }

  // Lấy tất cả độc giả
  async layTatCa() {
    const response = await this.api.get(this.baseUrl);
    return response.data;
  }

  // Thêm mới độc giả
  async themMoi(docGiaData) {
    const response = await this.api.post(this.baseUrl, docGiaData);
    return response.data;
  }

  // Lấy thông tin chi tiết của một độc giả
  async layTheoId(id) {
    const response = await this.api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Cập nhật thông tin độc giả
  async capNhat(id, docGiaData) {
    const response = await this.api.put(`${this.baseUrl}/${id}`, docGiaData);
    return response.data;
  }

  // Xóa độc giả
  async xoa(id) {
    const response = await this.api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export default new DocGiaService();
