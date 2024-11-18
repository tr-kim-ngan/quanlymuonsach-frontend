<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section about">
        <h5>Về Chúng Tôi</h5>
        <p>
          KN Library - Nơi mượn sách trực tuyến nhanh chóng và tiện lợi. Chúng tôi cam kết mang đến trải nghiệm đọc sách tốt nhất cho bạn.
        </p>
      </div>
      <div class="footer-section contact">
        <h5>Liên Hệ</h5>
        <p><i class="fas fa-map-marker-alt"></i>Phường Thường Thạnh - Quận Cái Răng - TP Cần Thơ</p>
        <p><i class="fas fa-phone-alt"></i> 0123-456-789</p>
        <p><i class="fas fa-envelope"></i> support@knlibrary.com</p>
      </div>
      <div class="footer-section follow-us">
        <h5>Theo Dõi Chúng Tôi</h5>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 KN Library. Tất cả các quyền được bảo lưu.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
/* Thiết lập chính cho footer */
.footer {
  background-color: #f8f9fa; /* Màu nền sáng */
  color: #333;
  /* text-align: center; */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  padding: 0px 0;
  border-top: 1px solid #ddd; /* Viền trên nhẹ */
  width: 100%; /* Chiếm toàn bộ chiều ngang */
  position: relative; /* Không đè lên nội dung */
  margin-top: 150px; 
}


/* Container chính */
.footer-container {
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
  flex-wrap: wrap; /* Đảm bảo bố cục đẹp trên màn hình nhỏ */
}

/* Các phần nội dung trong footer */
.footer-section {
  flex: 1 1 200px; /* Đảm bảo mỗi phần chiếm một không gian vừa phải */
  margin: 10px;
}

.footer-section h5 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff; /* Màu xanh đẹp */
  margin-bottom: 10px;
}

.footer-section p {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 5px 0;
}

/* Liên kết mạng xã hội */
.social-links a {
  margin: 0 10px;
  color: #007bff;
  font-size: 1.2rem;
  text-decoration: none;
  transition: color 0.3s ease-in-out;
}

.social-links a:hover {
  color: #0056b3;
}

/* Phần dưới cùng */
.footer-bottom {
  background-color: #e9ecef; /* Màu xám nhạt */
  color: #333;
  padding: 10px 0;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;
  text-align: center;
}
</style>
