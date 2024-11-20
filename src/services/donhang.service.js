import axios from "axios";

class DonHangService {
  constructor() {
    this.apiUrl = "http://localhost:3000/api/donhang";
  }

  async taoDonHang(data) {
    const response = await axios.post(this.apiUrl, data);
    return response.data;
  }
  // Lấy danh sách đơn hàng của người dùng
  async layDonHang(MaDocGia) {
    const response = await axios.get(`${this.baseUrl}/${MaDocGia}`);
    return response.data;
  }
  async layTatCaDonHang() {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }

  async layDanhSachDonHang(MaDocGia, page = 1, limit = 10) {
    const response = await axios.get(`${this.apiUrl}/${MaDocGia}`, {
      params: { page, limit },
    });
    return response.data;
  }
  async huyDonHang(id) {
    const response = await axios.delete(`${this.apiUrl}/${id}`);
    return response.data;
  }

  
     async capNhatTrangThaiDonHang(id, data) {
        const response = await axios.put(`${this.apiUrl}/${id}`, data);
        return response.data;
    }

   async capNhatThongTinDonHang(id, data) {
    const response = await axios.put(`${this.apiUrl}/capnhat-thongtin/${id}`, data);
    return response.data;
  }
  // Cập nhật số lượng sách sau khi đơn hàng bị hủy
  async capNhatSoLuongSauHuy(id) {
    const response = await axios.put(`${API_URL}/capnhat-soluong/${id}`);
    return response.data;
  }


}

export default new DonHangService();
