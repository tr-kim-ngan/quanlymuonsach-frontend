<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Danh Sách Sản Phẩm</h2>

    <!-- Chỉ hiển thị thông báo nếu không có sản phẩm -->
    <p v-if="books.length === 0 && thongBao" class="text-danger text-center">
      {{ thongBao }}
    </p>

    <!-- Danh sách sản phẩm -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
        <div class="card h-100">

          <img :src="getAnhUrl(book.Anh)" class="card-img-top" alt="Ảnh sách"
            style="height: auto; max-height: 350px; object-fit: contain" @click="viewBookDetails(book._id)" />

          <!-- Nếu số lượng còn lại là 0, hiển thị 'Hết hàng' -->
          <div v-if="book.SoQuyen === 0" class="text-danger text-center mt-3">
            <strong>Hết hàng</strong>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ book.TenSach }}</h5>
            <p class="card-text">
              <strong>Đơn Giá:</strong> {{ book.DonGia }} VND
            </p>
            <p class="card-text">
              <strong>Ngày Hạn Mượn:</strong> {{ book.NgayHanMuon }} ngày
            </p>
            <p class="card-text">
              <strong>Số Quyển còn lại:</strong> {{ book.SoQuyen }}
            </p>


            <div class="input-group mb-3">
              <input type="number" class="form-control" v-model.number="soLuong[book._id]" min="1" :max="book.SoQuyen"
                placeholder="Số lượng" />
            </div>

            <button class="btn btn-primary w-100" @click="themVaoGioHang(book)">
              Thêm vào giỏ hàng
            </button>
            <p v-if="books.length === 0 && thongBao" class="text-danger text-center">
              {{ thongBao }}
            </p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GioHangService from "@/services/giohang.service";

export default {
  name: "DanhSachSanPham",
  data() {
    return {
      books: [], // Danh sách sách
      soLuong: {}, // Số lượng nhập cho mỗi sách
      thongBao: "", // Thông báo lỗi
    };
  },
  mounted() {
    this.fetchBooks(); // Gọi API lấy danh sách sách khi component được mount
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:3000/api/sach");
        this.books = response.data;

        // Khởi tạo số lượng mặc định cho mỗi sách
        this.books.forEach((book) => {
          this.$set(this.soLuong, book._id, 1);
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        this.thongBao = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.";
      }
    },

    async themVaoGioHang(book) {
      const soLuongMuonThem = this.soLuong[book._id] || 1;
      // Kiểm tra số lượng sách còn lại
      if (book.SoQuyen === 0) {
        alert(`Sản phẩm "${book.TenSach}" đã hết hàng!`);
        return;
      }

      if (soLuongMuonThem <= 0) {
        alert("Số lượng không hợp lệ!");
        return;
      }

      if (soLuongMuonThem > book.SoQuyen) {
        alert("Số lượng yêu cầu vượt quá số lượng còn lại!");
        return;
      }

      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
          return;
        }

        const data = {
          MaDocGia: userId,
          MaSach: book._id,
          soLuong: soLuongMuonThem,
        };
        console.log("Dữ liệu gửi đi:", data); // Thêm log để kiểm tra dữ liệu

        const response = await GioHangService.themVaoGioHang(data);

        if (response) {
          alert(`Sản phẩm "${book.TenSach}" đã được thêm vào giỏ hàng!`);
        }
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.");
      }
    },

    getAnhUrl(anhFileName) {
      if (anhFileName) {
        return `http://localhost:3000/uploads/${anhFileName}`;
      }
      return "default-image-path.jpg"; // Đường dẫn mặc định
    },

    viewBookDetails(bookId) {
      this.$router.push(`/san-pham/${bookId}`);
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
}
</style>
