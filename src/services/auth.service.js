// src/services/auth.service.js
import axios from "axios";

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );
      console.log("Kết quả đăng nhập:", response.data);
     

        // Trích xuất các thông tin từ response để lưu vào localStorage
      const { token, role, userName,userFullName, userEmail, userPosition, userAddress, userPhone, userFirstName, userLastName, userBirthDate, userGender,  id: _id } = response.data;
      
      if (!_id) {
        throw new Error("Không tìm thấy ID người dùng từ API.");
      }
      localStorage.setItem("userToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", _id);
      //localStorage.setItem("username", username);
      localStorage.setItem("userFullName", userFullName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userPosition", userPosition);
      localStorage.setItem("userAddress", userAddress);
      localStorage.setItem("userPhone", userPhone);
      localStorage.setItem("userFirstName", userFirstName);
      localStorage.setItem("userLastName", userLastName);
      localStorage.setItem("userBirthDate", userBirthDate);
      localStorage.setItem("userGender", userGender);

       

      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Đăng nhập thất bại. Có lỗi xảy ra.");
      }
    }
  }

  logout() {
    localStorage.clear();
  }

  getRole() {
    return localStorage.getItem("userRole");
  }

  getUserName() {
    return localStorage.getItem("userName");
  }

  getToken() {
    return localStorage.getItem("userToken");
  }
}

export default new AuthService();
