
<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- <a class="navbar-brand" href="#">Quản Lý Ứng Dụng</a> -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Trang chủ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/danh-sach-sach" class="nav-link">Sách</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/danh-sach-nha-xuat-ban" class="nav-link">Nhà xuất bản</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/duyet-don-hang" class="nav-link">Duyệt đơn hàng</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view /> <!-- Đây là phần quan trọng để hiển thị các component tương ứng -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
.navbar {
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #ffffff !important;
  margin-right: 15px;
  transition: color 0.3s ease-in-out;
}

.nav-link:hover {
  color: #ff6b6b !important;
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

