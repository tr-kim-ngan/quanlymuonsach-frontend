<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Danh Sách Sản Phẩm</h2>

    <!-- Ô nhập tìm kiếm và nút tìm kiếm -->
    <div class="mb-4 text-center">
      <div class="input-group w-50 mx-auto">
        <input type="text" v-model="timKiem" class="form-control" placeholder="Tìm kiếm sách, tác giả, nhà xuất bản..." />
        <button class="btn btn-primary" @click="thucHienTimKiem">Tìm kiếm</button>
      </div>
    </div>

    <!-- Chỉ hiển thị thông báo nếu không có sản phẩm -->
    <p v-if="filteredBooks.length === 0 && thongBao" class="text-danger text-center">
      {{ thongBao }}
    </p>



    <!-- Danh sách sản phẩm -->
    <div class="row g-4">
      <div class="col-lg-3 col-md-4 col-sm-6" v-for="book in filteredBooks" :key="book._id">
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
      timKiem: "", // Từ khóa tìm kiếm
    };
  },
  mounted() {
    this.fetchBooks(); // Gọi API lấy danh sách sách khi component được mount
  },
  computed: {
    filteredBooks() {
      if (!this.timKiem) {
        return this.books;
      }
      const tuKhoa = this.timKiem.toLowerCase();
      return this.books.filter((book) => {
        const tenSach = book.TenSach ? book.TenSach.toLowerCase() : "";
        const tacGia = book.TacGia ? book.TacGia.toLowerCase() : "";
        const nhaXuatBan = book.MaNXB && book.MaNXB.TenNXB ? book.MaNXB.TenNXB.toLowerCase() : "";

        return tenSach.includes(tuKhoa) || tacGia.includes(tuKhoa) || nhaXuatBan.includes(tuKhoa);
      });
    }
  }
,


  methods: {
    thucHienTimKiem() {
      this.timKiem = this.timKiem.trim(); // Xóa khoảng trắng
    },
    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:3000/api/sach");
        this.books = response.data;
        // Log dữ liệu lấy được từ API
        console.log("Danh sách sách từ API:", this.books);
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
          alert(`Sản phẩm "${book.TenSach}" đã được thêm vào giỏ hàng! 😍`);
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
.book-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.card-title {
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow: hidden;

}



.search-bar {
  margin-bottom: 20px;
}

.search-input input {
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.search-input button {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

