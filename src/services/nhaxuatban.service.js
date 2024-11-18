// Import Axios từ cấu hình API
import apiClient from "./api.service.js";

// Tạo class dịch vụ Nhà Xuất Bản để gọi các API liên quan
class NhaXuatBanService {
  constructor(baseUrl = "/nhaxuatban") {
    this.api = apiClient; 
    this.baseUrl = baseUrl;
  }
  // Lấy tất cả nhà xuất bản
  async layTatCa() {
    const response = await this.api.get(this.baseUrl);
    console.log("Phản hồi từ server:", response.data);
    return response.data;
  }

  // Thêm mới nhà xuất bản
  async themMoi(data) {
    // Kiểm tra định dạng của Gmail trước khi gửi
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.Gmail)) {
      throw new Error("Địa chỉ Gmail không hợp lệ.");
    }

    try {
      const response = await this.api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Có lỗi xảy ra khi thêm nhà xuất bản.");
      }
    }
  }

  // Xóa tất cả nhà xuất bản
  async xoaTatCa() {
    return (await this.api.delete(this.baseUrl)).data;
  }

  // Lấy thông tin chi tiết của một nhà xuất bản theo ID
  async layTheoId(id) {
    return (await this.api.get(`${this.baseUrl}/${id}`)).data;
  }

  // Cập nhật thông tin của một nhà xuất bản
  async capNhat(id, data) {
    return (await this.api.put(`${this.baseUrl}/${id}`, data)).data;
  }

  // Xóa một nhà xuất bản theo ID
  async xoa(id) {
    try {
      const response = await this.api.delete(this.baseUrl + `/${id}`);
      console.log("Nhà Xuất Bản đã bị xóa thành công:", response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Không thể xóa:", error.response.data.message);
        throw new Error("Không thể xóa: " + error.response.data.message);
      } else {
        console.error("Lỗi khi xóa nhà xuất bản:", error);
        throw new Error("Lỗi khi xóa nhà xuất bản");
      }
    }
  }
}

// Xuất đối tượng để sử dụng ở các nơi khác trong dự án
export default new NhaXuatBanService();
