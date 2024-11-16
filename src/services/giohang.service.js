// src/services/giohang.service.js
import axios from "axios";

class GioHangService {
  constructor(baseUrl = "http://localhost:3000/api/giohang") {
    this.baseUrl = baseUrl;
  }

  // Lấy giỏ hàng của người dùng
 async layGioHang(MaDocGia) {
    try {
        const response = await axios.get(`${this.baseUrl}/${MaDocGia}`);
        console.log("Dữ liệu giỏ hàng nhận được:", response.data); // Log dữ liệu trả về
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error.response?.data || error.message); // Log lỗi chi tiết
        throw error;
    }
}

async themVaoGioHang(data) {
    try {
        console.log("Dữ liệu gửi để thêm vào giỏ hàng:", data); // Log dữ liệu gửi đi
        const response = await axios.post(this.baseUrl, data);
        console.log("Kết quả trả về sau khi thêm vào giỏ hàng:", response.data); // Log kết quả trả về
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error.message); // Log lỗi chi tiết
        throw error;
    }
}

async capNhatMucGioHang(cartItemId, data) {
    try {
        console.log(`Cập nhật mục giỏ hàng ID: ${cartItemId} với dữ liệu:`, data); // Log dữ liệu gửi đi
        const response = await axios.put(`${this.baseUrl}/${cartItemId}`, data);
        console.log("Kết quả trả về sau khi cập nhật giỏ hàng:", response.data); // Log kết quả trả về
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error.response?.data || error.message); // Log lỗi chi tiết
        throw error;
    }
}

async xoaMucTrongGioHang(cartItemId) {
    try {
        console.log(`Xóa mục giỏ hàng ID: ${cartItemId}`); // Log ID mục cần xóa
        const response = await axios.delete(`${this.baseUrl}/${cartItemId}`);
        console.log("Kết quả trả về sau khi xóa mục giỏ hàng:", response.data); // Log kết quả trả về
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa mục giỏ hàng:", error.response?.data || error.message); // Log lỗi chi tiết
        throw error;
    }
}


  // Xóa toàn bộ giỏ hàng của người dùng
  async xoaToanBoGioHang(MaDocGia) {
    const response = await axios.delete(`${this.baseUrl}/xoa-het/${MaDocGia}`);
    return response.data;
  }
}

export default new GioHangService();
