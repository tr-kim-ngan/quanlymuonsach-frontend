<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Giỏ Hàng</h2>
    <!-- Ô nhập tìm kiếm và nút tìm kiếm -->
    <div class="mb-4 text-center">
      <div class="input-group w-50 mx-auto">
        <input
          type="text"
          v-model="timKiem"
          class="form-control"
          placeholder="Tìm kiếm sách trong giỏ hàng..."
        />
        <button class="btn btn-primary" @click="thucHienTimKiem">
          Tìm kiếm
        </button>
      </div>
    </div>
    <!-- Hiển thị thông báo nếu giỏ hàng trống -->
    <div v-if="cartItems.length === 0" class="text-center">
      <p>Giỏ hàng của bạn hiện đang trống.</p>
    </div>

    <!-- Hiển thị danh sách sản phẩm trong giỏ hàng -->
    <div v-else>
      <table class="table table-bordered table-hover">
        <thead class="thead-light">
          <tr>
            <th>Sản phẩm</th>
            <th>Hạn mượn</th>
            <th>Số lượng còn lại</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCartItems" :key="item._id">
            <td class="product-cell">
              <div class="product-wrapper">
                <!-- <img :src="getAnhUrl(item.MaSach.Anh)" alt="Ảnh sách" class="product-image" /> -->
                <img
                  :src="getAnhUrl(item.MaSach.Anh)"
                  alt="Ảnh sách"
                  class="product-image cursor-pointer"
                  @click="viewBookDetails(item.MaSach._id)"
                />
                <span class="product-name">{{ item.MaSach.TenSach }}</span>
              </div>
            </td>

            <td>{{ item.MaSach.NgayHanMuon }}</td>

            <td>{{ item.MaSach.SoQuyen }}</td>
            <td>
              <input
                type="number"
                v-model.number="item.soLuong"
                class="form-control"
                min="1"
                :max="item.MaSach.SoQuyen"
                @change="updateCartItem(item)"
              />
            </td>
            <td>{{ item.MaSach.DonGia }} VND</td>
            <td>{{ item.soLuong * item.MaSach.DonGia }} VND</td>
            <td>
              <button class="btn btn-danger" @click="removeCartItem(item._id)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-right">
              <strong>Tổng thanh toán</strong>
            </td>
            <td colspan="2">
              <strong>{{ tongTien }} VND</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Nút "Hoàn tất mượn sách" -->
    <div class="text-center mt-4" v-if="cartItems.length > 0">
      <button class="btn btn-success w-50" @click="hienThiFormThongTin = true">
        Hoàn tất mượn sách
      </button>
    </div>

    <!-- Thông tin thanh toán chỉ hiển thị khi người dùng nhấn "Hoàn tất mượn sách" -->
    <div v-if="hienThiFormThongTin" class="form-wrapper mt-4">
      <h4>Thông Tin Người Nhận</h4>
      <div class="form-group">
        <label for="tenNguoiNhan">Tên Người Nhận</label>
        <input
          type="text"
          id="tenNguoiNhan"
          v-model="tenNguoiNhan"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="soDienThoai">Số Điện Thoại</label>
        <input
          type="text"
          id="soDienThoai"
          v-model="soDienThoai"
          class="form-control"
          @input="kiemTraSo"
          required
        />
      </div>

      <div class="form-group">
        <label for="diaChi">Địa Chỉ</label>
        <textarea
          id="diaChi"
          v-model="diaChi"
          class="form-control"
          rows="3"
          required
        ></textarea>
      </div>
      <button class="btn btn-primary w-50 mt-4" @click="datHang">
        Xác nhận mượn sách
      </button>
    </div>
  </div>
</template>

<script>
import GioHangService from "@/services/giohang.service";
import DonHangService from "@/services/donhang.service";

export default {
  name: "Cart",
  data() {
    return {
      cartItems: [], // Danh sách các mục trong giỏ hàng
      tenNguoiNhan: "",
      soDienThoai: "",
      diaChi: "",
      hienThiFormThongTin: false, // Biến để điều khiển hiển thị form thông tin
      timKiem: "",
    };
  },
  computed: {
    tongTien() {
      return this.cartItems.reduce(
        (total, item) => total + item.soLuong * item.MaSach.DonGia,
        0
      );
    },
    filteredCartItems() {
      if (!this.timKiem) {
        return this.cartItems;
      }
      const tuKhoa = this.timKiem.toLowerCase();
      return this.cartItems.filter((item) => {
        return item.MaSach.TenSach.toLowerCase().includes(tuKhoa);
      });
    },
    
  },
  mounted() {
    this.fetchCartItems(); // Lấy danh sách giỏ hàng khi component được gắn vào
  },
  methods: {
    kiemTraSo() {
      this.soDienThoai = this.soDienThoai.replace(/[^0-9]/g, '');
    },
    async fetchCartItems() {
      try {
        const userId = localStorage.getItem("userId"); // Lấy ID người dùng đã đăng nhập
        if (!userId) {
          throw new Error(
            "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại."
          );
        }

        // Gọi API để lấy dữ liệu giỏ hàng
        const response = await GioHangService.layGioHang(userId);

        if (response && response.items) {
          this.cartItems = response.items; // Lấy danh sách items từ giỏ hàng
        } else {
          this.cartItems = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giỏ hàng:", error);
        alert("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
      }
    },

    getAnhUrl(anhFileName) {
      if (anhFileName) {
        return `http://localhost:3000/uploads/${anhFileName}`;
      }
      return "default-image-path.jpg"; // Đường dẫn tới ảnh mặc định nếu không có ảnh
    },

    async updateCartItem(item) {
      try {
        if (item.soLuong <= 0) {
          alert("Số lượng không hợp lệ! Số lượng phải lớn hơn 0.");
          await this.fetchCartItems(); // Tải lại giỏ hàng để reset giá trị
          return;
        }
        if (item.soLuong > item.MaSach.SoQuyen) {
          alert(
            `Số lượng vượt quá số lượng tồn kho! Số lượng còn lại: ${item.MaSach.SoQuyen}`
          );
          await this.fetchCartItems(); // Tải lại giỏ hàng để reset giá trị
          return;
        }

        // Gửi yêu cầu cập nhật số lượng tới backend
        await GioHangService.capNhatMucGioHang(item._id, {
          soLuong: item.soLuong,
        });
        alert("Cập nhật số lượng thành công!");
        this.fetchCartItems(); // Cập nhật lại danh sách giỏ hàng
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
      }
    },

    async removeCartItem(cartItemId) {
      // Xóa mục trong giỏ hàng
      try {
        await GioHangService.xoaMucTrongGioHang(cartItemId);
        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
        this.fetchCartItems(); // Cập nhật lại danh sách giỏ hàng
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      }
    },
    async datHang() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("Vui lòng đăng nhập trước khi mượn sách!");
          return;
        }

        // Chuẩn bị dữ liệu từ giỏ hàng
        const items = this.cartItems.map((item) => ({
          MaSach: item.MaSach._id,
          soLuong: item.soLuong,
        }));

        // Gọi API để tạo đơn hàng
        const response = await DonHangService.taoDonHang({
          MaDocGia: userId,
          items,
          tongTien: this.tongTien,
          tenNguoiNhan: this.tenNguoiNhan,
          soDienThoai: this.soDienThoai,
          diaChi: this.diaChi,
        });

        if (response) {
          alert("Đơn hàng đã được tạo thành công! 😚");
          // Xóa toàn bộ giỏ hàng sau khi đặt hàng
          await GioHangService.xoaToanBoGioHang(userId);
          this.fetchCartItems(); // Làm mới giỏ hàng
          this.$router.push("/don-hang"); // Điều hướng đến trang đơn hàng
        }
      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        alert("Không thể hoàn tất mượn sách. Vui lòng xem lại");
      }
    },

    viewBookDetails(bookId) {
      // Chuyển hướng tới trang chi tiết sản phẩm
      this.$router.push(`/san-pham/${bookId}`);
    },
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
  border-collapse: collapse;
}

.table thead th {
  background-color: #000 !important;
  color: #fff !important;
  border: none;
}

.product-cell {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: none;
  vertical-align: middle;
}

.product-wrapper {
  display: flex;
  align-items: center;
}

.product-image {
  width: 80px;
  height: auto;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: bold;
  margin-top: 0.5rem;
  text-align: center;
}

td,
th {
  padding: 10px;
  vertical-align: middle;
  background-color: #fff;
}

tfoot td {
  font-weight: bold;
  font-size: 1.1em;
  text-align: right;
  background-color: #fff;
}

.btn-danger {
  padding: 5px 10px;
  font-size: 0.9em;
}
.form-wrapper {
  border: 2px solid #007bff; 
  border-radius: 10px; 
  padding: 20px; 
  background-color: #f9f9f9; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  max-width: 600px;
  margin: 70px auto; 
}
</style>
