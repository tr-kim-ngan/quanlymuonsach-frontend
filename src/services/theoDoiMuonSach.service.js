import axios from "axios";

const API_URL = "http://localhost:3000/api/theodoimuonsach";

class TheoDoiMuonSachService {
  // Lấy danh sách tất cả các bản ghi trong TheoDoiMuonSach
  async layDanhSachTheoDoiMuonSach() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  // Lấy danh sách sách đang mượn
  async laySachDangMuon(MaDocGia) {
    const response = await axios.get(`${API_URL}/dang-muon/${MaDocGia}`);
    return response.data;
  }

  // Lấy danh sách sách đã trả
  async laySachDaTra(MaDocGia) {
    const response = await axios.get(`${API_URL}/da-tra/${MaDocGia}`);
    return response.data;
  }
  // Lấy toàn bộ lịch sử mượn sách của một độc giả
  async layLichSuMuonSach(MaDocGia) {
    const response = await axios.get(`${API_URL}/lich-su/${MaDocGia}`);
    return response.data;
  }


  // Trả sách
  // async traSach(id) {
  //   const response = await axios.put(`${API_URL}/tra-sach/${id}`);
  //   return response.data;
  // }
  // Cập nhật trạng thái của sách

  // Gửi yêu cầu trả sách
 async yeuCauTraSach(id) {
  const response = await axios.put(`${API_URL}/tra-sach/${id}`);
  return response.data;
}

  // Xác nhận trả sách
async xacNhanTraSach(id) {
  const response = await axios.put(`${API_URL}/xac-nhan-tra-sach/${id}`);
  return response.data;
}




}

export default new TheoDoiMuonSachService();
