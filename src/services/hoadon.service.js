import axios from "axios";

const API_URL = "http://localhost:3000/api/hoadon";

class HoaDonService {
  // Lấy danh sách hóa đơn của một người dùng
  async layDanhSachHoaDon(userId) {
    return (await axios.get(`${API_URL}/docgia/${userId}`)).data;
  }
// Lấy tất cả hóa đơn (admin)
  async thanhToanHoaDon(hoaDonId) {
    return (
      await axios.put(`${API_URL}/${hoaDonId}`, { trangThai: "Đã thanh toán" })
    ).data;
  }
// Lấy tất cả hóa đơn (admin)
  async layTatCaHoaDon() {
    return (await axios.get(`${API_URL}/`)).data;
  }

   // Cập nhật trạng thái hóa đơn
  async capNhatTrangThaiHoaDon(hoaDonId, trangThai) {
    return (
      await axios.put(`${API_URL}/${hoaDonId}`, { trangThai })
    ).data;
  }

  async xacNhanThanhToanHoaDon(hoaDonId) {
    return (
      await axios.put(`${API_URL}/${hoaDonId}`, { trangThai: "Đã thanh toán" })
    ).data;
  }

  async layDanhSachHoaDonHoanThanh() {
    const response = await axios.get(API_URL, {
        params: {
            trangThai: "Đã hoàn thành",
        },
    });
    return response.data;
}

  async capNhatTrangThaiHoaDon(hoaDonId, trangThai) {
    return (
        await axios.put(`${API_URL}/${hoaDonId}`, { trangThai })
      ).data;
  }


}

export default new HoaDonService();
