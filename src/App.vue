<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <!-- Menu cho admin -->
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/" class="nav-link">Trang chủ</router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/danh-sach-sach" class="nav-link"
                >Sách</router-link
              >
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/danh-sach-nha-xuat-ban" class="nav-link"
                >Nhà xuất bản</router-link
              >
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/duyet-don-hang" class="nav-link"
                >Duyệt đơn hàng</router-link
              >
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/quan-ly-hoa-don" class="nav-link"
                >Quản lý hóa đơn</router-link
              >
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link to="/theo-doi-muon-sach" class="nav-link"
                >Theo Dõi Mượn Sách</router-link
              >
            </li>

            <!-- Menu cho khách hàng -->
            <li v-if="!isAdmin" class="nav-item">
              <router-link to="/san-pham" class="nav-link"
                >Sản phẩm</router-link
              >
            </li>
            <li v-if="!isAdmin" class="nav-item">
              <a class="nav-link" @click="checkAuthAndNavigate('/gio-hang')"
                >Giỏ hàng</a
              >
            </li>
            <li v-if="!isAdmin" class="nav-item">
              <a class="nav-link" @click="checkAuthAndNavigate('/don-hang')"
                >Đơn hàng</a
              >
            </li>

            <li v-if="!isAdmin" class="nav-item">
              <a class="nav-link" @click="checkAuthAndNavigate('/hoa-don')"
                >Hóa đơn</a
              >
            </li>
            <li v-if="!isAdmin" class="nav-item">
              <a class="nav-link" @click="checkAuthAndNavigate('/sach-da-muon')"
                >Sách đã mượn</a
              >
            </li>
          </ul>

          <!-- Thông tin người dùng -->
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ isAdmin && isLoggedIn ? userName : "Tên đăng nhập" }}
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <!-- Thông tin admin -->
                <li v-if="isAdmin">
                  <a class="dropdown-item">
                    <strong>Họ Tên:</strong> {{ userFullName }}
                  </a>
                </li>
                <li v-if="isAdmin">
                  <a class="dropdown-item">
                    <strong>Chức Vụ:</strong> {{ userPosition }}
                  </a>
                </li>
                <li v-if="isAdmin">
                  <a class="dropdown-item">
                    <strong>Địa Chỉ:</strong> {{ userAddress }}
                  </a>
                </li>
                <li v-if="isAdmin">
                  <a class="dropdown-item">
                    <strong>SĐT:</strong> {{ userPhone }}
                  </a>
                </li>

                <!-- Thông tin khách hàng -->
                <!-- <li v-if="isCustomer ">
                  <a class="dropdown-item">
                    <strong>Họ Lót:</strong> {{ userFirstName || "" }}
                  </a>
                </li> -->
                <li v-if="isCustomer">
                  <a class="dropdown-item">
                    <strong>Tên:</strong> {{ userLastName || "" }}
                  </a>
                </li>
                <li v-if="isCustomer">
                  <a class="dropdown-item">
                    <strong>Ngày Sinh:</strong> {{ userBirthDate || "" }}
                  </a>
                </li>
                <li v-if="isCustomer">
                  <a class="dropdown-item">
                    <strong>Phái:</strong> {{ userGender || "" }}
                  </a>
                </li>
                <!-- <li v-if="isCustomer || !isLoggedIn">
                  <a class="dropdown-item">
                    <strong>Địa Chỉ:</strong> {{ userAddress || "" }}
                  </a>
                </li> -->
                <li v-if="isCustomer">
                  <a class="dropdown-item">
                    <strong>Điện Thoại:</strong> {{ userPhone || "" }}
                  </a>
                </li>

                <!-- Đăng nhập & Đăng ký cho khách hàng chưa đăng nhập -->
                <li v-if="!isLoggedIn">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="!isLoggedIn">
                  <a class="dropdown-item" @click="navigateToLogin"
                    >Đăng nhập</a
                  >
                </li>
                <li v-if="!isLoggedIn">
                  <a class="dropdown-item" @click="navigateToRegister"
                    >Đăng ký</a
                  >
                </li>

                <!-- Đăng xuất cho người đã đăng nhập -->
                <li v-if="isLoggedIn">
                  <hr class="dropdown-divider" />
                </li>
                <li v-if="isLoggedIn">
                  <a class="dropdown-item" href="#" @click="dangXuat"
                    >Đăng xuất</a
                  >
                </li>
                <li v-if="isCustomer">
                  <a class="dropdown-item" @click="navigateToEditProfile"
                    >Chỉnh sửa thông tin</a
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view @profile-updated="checkLoginStatus" />
    <!-- Phần để hiển thị component tương ứng -->
    <AppFooter />
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import moment from "moment";
// import AppFooter from "./components/AppFooter.vue";
export default {
  name: "App",
  components: {
    AppFooter,
  },

  data() {
    return {
      userRole: null,
      isAdmin: false,
      isCustomer: false,
      userName: "",
      userFullName: "",
      userPosition: "",
      userAddress: "",
      userPhone: "",
      userFirstName: "",
      userLastName: "",
      userBirthDate: "",
      userGender: "",
      isLoggedIn: false,
    };
  },
  created() {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi tạo
  },

  watch: {
    // Theo dõi sự thay đổi của route để cập nhật trạng thái đăng nhập
    $route(to, from) {
      this.checkLoginStatus();
    },
  },
  methods: {
    checkLoginStatus() {
      this.userRole = AuthService.getRole();
      this.userName = AuthService.getUserName();
      this.userFullName = localStorage.getItem("userFullName");
      this.userPosition = localStorage.getItem("userPosition");
      this.userAddress = localStorage.getItem("userAddress");
      this.userPhone = localStorage.getItem("userPhone");
      this.userFirstName = localStorage.getItem("userFirstName");
      this.userLastName = localStorage.getItem("userLastName");

      // Định dạng lại ngày sinh để hiển thị trong dropdown
      const rawBirthDate = localStorage.getItem("userBirthDate");
      this.userBirthDate = rawBirthDate
        ? moment(rawBirthDate, "DD-MM-YYYY").format("DD-MM-YYYY")
        : "";

      this.userGender = localStorage.getItem("userGender");
      this.isLoggedIn = !!AuthService.getToken();
      this.updateUserRoleFlags();
    },
    updateUserRoleFlags() {
      this.isAdmin = this.userRole === "admin";
      this.isCustomer = this.userRole === "customer";
    },
    dangXuat() {
      AuthService.logout(); // Xóa phiên người dùng
      this.isLoggedIn = false; // Đặt lại cờ đăng nhập khi đăng xuất
      this.$router.push("/login"); // Điều hướng về trang đăng nhập
    },
    checkAuthAndNavigate(route) {
      // Kiểm tra người dùng đã đăng nhập hay chưa
      if (this.isLoggedIn) {
        this.$router.push(route);
      } else {
        // Chưa đăng nhập, chuyển hướng đến trang đăng nhập
        this.$router.push("/login");
      }
    },
    navigateToLogin() {
      this.$router.push("/login");
    },
    navigateToRegister() {
      this.$router.push("/register");
    },
    navigateToEditProfile() {
      this.$router.push("/sua-thong-tin");
    },
  },
};
</script>

<style scoped>

#app {
   display: flex;
  background: 
    radial-gradient(circle, rgba(255, 255, 255, 0.6) 20%, transparent 80%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.3) 15%, transparent 70%),
    linear-gradient(135deg, #e8f7fc, #36aaed);
   background-blend-mode: screen;
   flex-direction: column;
    min-height: 100vh; 
}
.content {
  flex: 1;
   margin-bottom: 50px;
}

.navbar {
  background-color: #050e18 !important;
  color: #ffffff !important; 
}

.nav-link {
  color: #ffffff !important; 
}

.nav-link:hover {
  color: #6fe1e1 !important; 
}


.navbar-brand {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff !important;
  margin-right: 30px;
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.1);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba%28255, 255, 255, 1%29' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}
</style>
