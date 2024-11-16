<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Giỏ Hàng</h2>
    <!-- Hiển thị thông báo nếu giỏ hàng trống -->
    <div v-if="cartItems.length === 0" class="text-center">
      <p>Giỏ hàng của bạn hiện đang trống.</p>
    </div>

    <!-- Hiển thị danh sách sản phẩm trong giỏ hàng -->
    <div v-else class="row">
      <div class="col-md-4 mb-4" v-for="item in cartItems" :key="item._id">
        <div class="card h-100">
          <img
            :src="getAnhUrl(item.MaSach.Anh)"
            class="card-img-top"
            alt="Ảnh sách"
            style="height: auto; max-height: 350px; object-fit: contain"
            @click="viewBookDetails(item.MaSach._id)"
          />

          <div class="card-body">
            <h5 class="card-title">{{ item.MaSach.TenSach }}</h5>
            <p class="card-text">
              <strong>Đơn Giá:</strong> {{ item.MaSach.DonGia }} VND
            </p>
            <p class="card-text">
              <strong>Ngày Hạn Mượn:</strong>{{ item.MaSach.NgayHanMuon }}
            </p>
            <!-- <p class="card-text"><strong>Số Lượng:</strong> {{ item.soLuong }}</p> -->
            <p class="card-text">
              <strong>Số Quyển còn lại:</strong> {{ item.MaSach.SoQuyen }}
            </p>
            <p class="card-text">
              <strong>Số Lượng:</strong>
              <input
                type="number"
                v-model.number="item.soLuong"
                class="form-control"
                min="1"
                :max="item.MaSach.SoQuyen"
                @change="updateCartItem(item)"
              />
            </p>
            <p class="card-text">
              <strong>Tổng Giá:</strong>
              {{ item.soLuong * item.MaSach.DonGia }} VND
            </p>
            <button
              class="btn btn-danger w-100"
              @click="removeCartItem(item._id)"
            >
              Xóa khỏi giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-4" v-if="cartItems.length > 0">
      <button class="btn btn-success w-50" @click="datHang">
        Hoàn tất mượn sách
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
    };
  },
  mounted() {
    this.fetchCartItems(); // Lấy danh sách giỏ hàng khi component được gắn vào
  },
  methods: {
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

        const tongTien = this.cartItems.reduce(
          (total, item) => total + item.soLuong * item.MaSach.DonGia,
          0
        );

        // Gọi API để tạo đơn hàng
        const response = await DonHangService.taoDonHang({
          MaDocGia: userId,
          items,
          tongTien,
        });

        if (response) {
          alert("Đơn hàng đã được tạo thành công!");
          // Xóa toàn bộ giỏ hàng sau khi đặt hàng
          await GioHangService.xoaToanBoGioHang(userId);
          this.fetchCartItems(); // Làm mới giỏ hàng
          this.$router.push("/don-hang"); // Điều hướng đến trang đơn hàng
        }
      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        alert("Không thể hoàn tất mượn sách. Vui lòng thử lại sau.");
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
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
}
</style>
