<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card login-card p-4 shadow-sm" style="width: 400px;">
            <h2 class="text-center mb-4">Đăng nhập</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label">Tên đăng nhập:</label>
                    <input v-model="username" type="text" class="form-control login-input" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu:</label>
                    <input type="password" v-model="password" class="form-control login-input" required />
                </div>
                <button type="submit" class="btn btn-primary w-100 login-button">Đăng nhập</button>
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
                this.errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại! 😔 ";
            }
        }
    }
};
</script>

<style scoped>
.login-background {
    background: linear-gradient(135deg, #81c784, #4fc3f7);
}

.login-card {
    width: 400px;
    padding: 2rem;
    border-radius: 15px;
    border: none;
    background: #ffffff;
}

.login-input {
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.login-input:focus {
    border-color: #2878a7;
    box-shadow: 0 0 8px rgba(40, 120, 167, 0.3);
}

.login-button {
    padding: 12px;
    background-color: #4169e1;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-button:hover {
    background-color: #27408b;
    transform: translateY(-2px);
}

.card {
    border: 0;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.text-center {
    color: #4169e1;
}
</style>