<template>
    <div class="container mt-5">
        <!-- Tiêu đề -->
        <h2 class="text-center mb-4" v-if="!selectedHoaDon">Danh Sách Hóa Đơn</h2>
        <h2 class="text-center mb-4" v-else>Chi Tiết Hóa Đơn</h2>

        <!-- Danh sách hóa đơn -->
        <div v-if="!selectedHoaDon">
            <!-- Hiển thị thông báo nếu không có hóa đơn -->
            <div v-if="hoaDons.length === 0" class="text-center">
                <p>Bạn chưa có hóa đơn nào đã được thanh toán.</p>
            </div>
            <!-- Danh sách hóa đơn -->
            <div v-else>
                <div v-for="hoaDon in hoaDons" :key="hoaDon._id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Mã hóa đơn: {{ hoaDon._id }}</h5>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(hoaDon.ngayTao) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ hoaDon.tongTien }} VND</p>
                        <p><strong>Trạng thái:</strong>
                            <span class="text-success" v-if="hoaDon.trangThai === 'Đã thanh toán'">
                                {{ hoaDon.trangThai }}
                            </span>
                        </p>
                        <button class="btn btn-primary" @click="xemChiTietHoaDon(hoaDon._id)">Xem chi tiết</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chi tiết hóa đơn -->
        <div v-else>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Mã hóa đơn: {{ selectedHoaDon._id }}</h5>
                    <p><strong>Ngày tạo:</strong> {{ formatDate(selectedHoaDon.ngayTao) }}</p>
                    <p><strong>Tổng tiền:</strong> {{ selectedHoaDon.tongTien }} VND</p>
                    <p><strong>Trạng thái:</strong> {{ selectedHoaDon.trangThai }}</p>
                    <div>
                        <h5 class="mt-4">Chi Tiết Sản Phẩm:</h5>
                        <div v-for="item in selectedHoaDon.items" :key="item.MaSach._id" class="product-detail">
                            <img :src="getAnhUrl(item.MaSach.Anh)" alt="Hình ảnh sản phẩm" class="product-image mr-3" />
                            <div class="product-info">
                                <p><strong>Tên sách:</strong> {{ item.MaSach.TenSach }}</p>
                                <p><strong>Đơn giá:</strong> {{ item.donGia }} VND</p>
                                <p><strong>Số lượng:</strong> {{ item.soLuong }}</p>
                            </div>
                        </div>
                        <!-- Hiển thị thông tin người nhận từ hóa đơn -->
                        <div class="mt-4">
                            <h5>Thông tin người nhận:</h5>
                            <p><strong>Tên người nhận:</strong> {{ selectedHoaDon.tenNguoiNhan }}</p>
                            <p><strong>Số điện thoại:</strong> {{ selectedHoaDon.soDienThoai }}</p>
                            <p><strong>Địa chỉ:</strong> {{ selectedHoaDon.diaChi }}</p>
                        </div>

                    </div>

                    <button class="btn btn-secondary mt-3" @click="quayLaiDanhSach">Quay lại danh sách</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import HoaDonService from "@/services/hoadon.service";

export default {
    data() {
        return {
            hoaDons: [], // Danh sách hóa đơn
            userId: localStorage.getItem("userId"), // Lấy userId từ localStorage
            selectedHoaDon: null, // Hóa đơn được chọn để hiển thị chi tiết
        };
    },
    async mounted() {
        await this.fetchHoaDons();
    },
    methods: {
        // Lấy danh sách hóa đơn chỉ với trạng thái "Đã thanh toán"
        async fetchHoaDons() {
            try {
                const response = await HoaDonService.layDanhSachHoaDon(this.userId);
                // Lọc chỉ những hóa đơn có trạng thái "Đã thanh toán"
                this.hoaDons = response
                    .filter(hoaDon => hoaDon.trangThai === "Đã thanh toán")
                    .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));

                console.log("Danh sách hóa đơn đã thanh toán:", this.hoaDons);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách hóa đơn:", error);
                alert("Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.");
            }
        },
        // Hiển thị chi tiết hóa đơn
        async xemChiTietHoaDon(hoaDonId) {
            try {
                const response = await HoaDonService.layChiTietHoaDon(hoaDonId);
                this.selectedHoaDon = response.data;

                // Kiểm tra xem các thông tin có tồn tại không, nếu không thì gán mặc định "Không có thông tin"
                this.selectedHoaDon.tenNguoiNhan = this.selectedHoaDon.tenNguoiNhan || "Không có thông tin";
                this.selectedHoaDon.soDienThoai = this.selectedHoaDon.soDienThoai || "Không có thông tin";
                this.selectedHoaDon.diaChi = this.selectedHoaDon.diaChi || "Không có thông tin";
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
                alert("Không thể lấy chi tiết hóa đơn. Vui lòng thử lại sau.");
            }
        },


        // Quay lại danh sách hóa đơn
        quayLaiDanhSach() {
            this.selectedHoaDon = null; // Xóa hóa đơn được chọn để quay lại danh sách
        },
        // Format ngày hiển thị
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        // Lấy đường dẫn ảnh
        getAnhUrl(anhFileName) {
            if (anhFileName) {
                return `http://localhost:3000/uploads/${anhFileName}`;
            }
            return "default-image-path.jpg"; // Đường dẫn tới ảnh mặc định nếu không có ảnh
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
}

.card:hover {
    transform: scale(1.02); 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
}

.product-detail {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>
