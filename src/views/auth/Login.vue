<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4 shadow-sm" style="width: 400px;">
            <h2 class="text-center mb-4">Đăng nhập</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label">Tên đăng nhập:</label>
                    <input v-model="username" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu:</label>
                    <input type="password" v-model="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
                <!-- Thêm phần này để hiển thị thông báo lỗi -->
                <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    data() {
        return {
            username: "",
            password: "",
            errorMessage: ""
        };
    },
    methods: {
        async login() {
            try {
                const response = await AuthService.login(this.username, this.password);

                localStorage.setItem("userToken", response.token);
                localStorage.setItem("userRole", response.role);
                localStorage.setItem("userName", response.userName);
                localStorage.setItem("userFullName", response.userFullName);
                localStorage.setItem("userEmail", response.userEmail);
                localStorage.setItem("userPosition", response.userPosition);
                localStorage.setItem("userAddress", response.userAddress);
                localStorage.setItem("userPhone", response.userPhone);

                if (response.role === 'admin') {
                    this.$router.push('/danh-sach-nha-xuat-ban');
                } else {
                    this.$router.push('/san-pham');
                }
            } catch (error) {
                this.errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
            }
        }
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
