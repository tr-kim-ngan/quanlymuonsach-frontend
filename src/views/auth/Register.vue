<template>
    <div class="register-container">
        <div class="card register-card shadow-sm">
            <h2 class="text-center mb-4">Đăng ký</h2>
            <form @submit.prevent="register">
                <div class="mb-3">
                    <label class="form-label">Tên đăng nhập:</label>
                    <input v-model="username" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu:</label>
                    <input v-model="password" type="password" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label class="form-label">Họ Lót:</label>
                    <input v-model="hoLot" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Tên:</label>
                    <input v-model="ten" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày Sinh:</label>
                    <input v-model="ngaySinh" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Phái:</label>
                    <select v-model="phai" class="form-control" required>
                        <option value="" disabled>Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Địa chỉ:</label>
                    <input v-model="diaChi" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Điện thoại:</label>
                    <input v-model="dienThoai" type="text" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
                <p v-if="errorMessage" class="text-danger text-center mt-3">
                    {{ errorMessage }}
                </p>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "", // Thêm thuộc tính username
      password: "",
      hoLot: "",
      ten: "",
      ngaySinh: "",
      phai: "",
      diaChi: "",
      dienThoai: "",
      errorMessage: "",
    };
  },
  methods: {
      async register() {
          try {
              const payload = {
                  username: this.username,
                  HoLot: this.hoLot,
                  Ten: this.ten,
                  NgaySinh: this.ngaySinh,
                  Phai: this.phai,
                  DiaChi: this.diaChi,
                  DienThoai: this.dienThoai,
                  Password: this.password,
              };

              console.log("Payload gửi đi:", payload); // Kiểm tra payload gửi đi

              const response = await axios.post("http://localhost:3000/api/auth/register", payload);

              // Xử lý khi đăng ký thành công
              alert("Đăng ký thành công! Bạn có thể đăng nhập.");
              this.$router.push("/login");
          } catch (error) {
              console.error("Lỗi khi đăng ký:", error);
              if (error.response && error.response.data && error.response.data.message) {
                  this.errorMessage = error.response.data.message;
              } else {
                  this.errorMessage = "Đăng ký thất bại. Vui lòng kiểm tra lại!";
              }
          }
      },

  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 70px);
  padding-top: 70px;
}

.register-card {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 130px;
}
</style>
