<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Quản Lý Hóa Đơn</h2>

        <!-- Ô tìm kiếm trạng thái -->
        <div class="form-group mb-4">
            <select class="form-control short-select" v-model="selectedStatus" @change="filterByStatus">
                <option value="">Tất cả trạng thái</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Chưa thanh toán">Chưa thanh toán</option>
            </select>
        </div>

        <!-- Danh sách hóa đơn -->
        <div v-if="!selectedHoaDon">
            <div v-if="filteredHoaDons.length === 0" class="text-center">
                <p>Không có hóa đơn nào.</p>
            </div>
            <div v-else>
                <div v-for="hoaDon in filteredHoaDons" :key="hoaDon._id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Mã hóa đơn: {{ hoaDon._id }}</h5>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(hoaDon.ngayTao) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ hoaDon.tongTien }} VND</p>
                        <!-- <p><strong>Trạng thái: </strong>
                            <span v-if="hoaDon.trangThai === 'Đã thanh toán'" class="text-success">
                                {{ hoaDon.trangThai }}
                            </span>
                            <span v-else class="text-danger">
                                {{ hoaDon.trangThai }}
                            </span>
                        </p> -->
                        <p><strong>Trạng thái: </strong>
                            <span v-if="hoaDon.trangThai === 'Đã thanh toán'" class="badge badge-success">
                                {{ hoaDon.trangThai }}
                            </span>
                            <span v-else class="badge badge-danger">
                                {{ hoaDon.trangThai }}
                            </span>
                        </p>




                        <button class="btn btn-primary mr-2" @click="xemChiTietHoaDon(hoaDon)">
                            Xem chi tiết
                        </button>
                        <button v-if="hoaDon.trangThai === 'Chưa thanh toán'" class="btn btn-success"
                            @click="xacNhanThanhToan(hoaDon._id)">
                            Xác nhận thanh toán
                        </button>
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
                    <p><strong>Trạng thái: </strong> {{ selectedHoaDon.trangThai }}</p>
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
                    </div>
                    <div class="mt-4">
                        <h5>Thông tin người nhận:</h5>
                        <p><strong>Tên người nhận:</strong> {{ selectedHoaDon.tenNguoiNhan }}</p>
                        <p><strong>Số điện thoại:</strong> {{ selectedHoaDon.soDienThoai }}</p>
                        <p><strong>Địa chỉ:</strong> {{ selectedHoaDon.diaChi }}</p>
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
            selectedHoaDon: null, // Hóa đơn đang được xem chi tiết
            searchStatus: "",
            filteredHoaDons: []
        };
    },
    async mounted() {
        await this.fetchHoaDons();
    },
    methods: {
        // Lấy danh sách tất cả hóa đơn
        async fetchHoaDons() {
            try {
                const response = await HoaDonService.layTatCaHoaDon(); // Gọi API để lấy tất cả hóa đơn
                this.hoaDons = response.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
                this.filteredHoaDons = this.hoaDons;
                //this.hoaDons = response;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách hóa đơn:", error);
                alert("Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.");
            }
        },
        // Lọc danh sách hóa đơn theo trạng thái
        filterByStatus() {
            if (this.selectedStatus === "") {
                this.filteredHoaDons = this.hoaDons; // Nếu chọn "Tất cả trạng thái", hiển thị tất cả
            } else {
                this.filteredHoaDons = this.hoaDons.filter(hoaDon =>
                    hoaDon.trangThai === this.selectedStatus
                );
            }
        },
        // Reset bộ lọc
        resetFilter() {
            this.searchStatus = "";
            this.filteredHoaDons = this.hoaDons; // Hiển thị lại tất cả hóa đơn
        },
        // Xác nhận thanh toán hóa đơn
        async xacNhanThanhToan(id) {
            try {
                if (confirm("Bạn có chắc chắn muốn xác nhận thanh toán hóa đơn này?")) {
                    await HoaDonService.capNhatTrangThaiHoaDon(id, "Đã thanh toán"); // Gọi API cập nhật trạng thái
                    alert("Hóa đơn đã được xác nhận thanh toán!");
                    await this.fetchHoaDons(); // Cập nhật danh sách hóa đơn
                }
            } catch (error) {
                console.error("Lỗi khi xác nhận thanh toán hóa đơn:", error);
                alert("Không thể xác nhận thanh toán hóa đơn. Vui lòng thử lại sau.");
            }
        },
        // Xem chi tiết hóa đơn
        // xemChiTietHoaDon(hoaDon) {
        //     this.selectedHoaDon = hoaDon; // Gắn hóa đơn được chọn vào biến `selectedHoaDon`
        // },

        async xemChiTietHoaDon(hoaDon) {
            try {
                const response = await HoaDonService.layChiTietHoaDon(hoaDon._id);
                this.selectedHoaDon = response.data;

                // Kiểm tra xem các thông tin có tồn tại không, nếu không thì gán mặc định "Không có thông tin"
                this.selectedHoaDon.tenNguoiNhan = this.selectedHoaDon.tenNguoiNhan || "Không có thông tin";
                this.selectedHoaDon.soDienThoai = this.selectedHoaDon.soDienThoai || "Không có thông tin";
                this.selectedHoaDon.diaChi = this.selectedHoaDon.diaChi || "Không có thông tin";
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
                alert("Không thể tải chi tiết hóa đơn. Vui lòng thử lại sau.");
            }
        },
        
       
        // Quay lại danh sách hóa đơn
        quayLaiDanhSach() {
            this.selectedHoaDon = null; // Xóa trạng thái chi tiết để quay lại danh sách
        },
        // Format ngày hiển thị
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        // Lấy URL ảnh
        getAnhUrl(anhFileName) {
            if (anhFileName) {
                return `http://localhost:3000/uploads/${anhFileName}`;
            }
            return "default-image-path.jpg"; // Đường dẫn ảnh mặc định
        },
    },
};
</script>


<style scoped>
.card {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.6);
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #fff;
    margin-bottom: 1rem;
    padding: 0.8rem;
    max-width: 600px;
    margin: 0.5rem auto;
}

.card:hover {
    transform: scale(1.02);
}

.btn-success {
    background-color: #28a745;
    border: none;
}

.btn-success:hover {
    background-color: #218838;
}

/* Badge chung */
.badge {
    padding: 0.4rem 0.8rem;
    border-radius: 5px;
    font-size: 0.9rem;
    font-weight: bold;
    color: #fff;
    /* Chữ màu trắng */
    display: inline-block;
}

/* Màu nền cho trạng thái */
.badge-success {
    background-color: #4CAF50;
    /* Màu xanh */
}

.badge-danger {
    background-color: #F44336;
    /* Màu đỏ */
}

.text-success {
    font-weight: bold;
}

.text-danger {
    font-weight: bold;
    color: #dc3545;
}

.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.product-detail {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.short-select {
    width: 200px;
    /* Độ rộng của dropdown */
    margin: 0 auto;
    /* Căn giữa theo chiều ngang */
    display: block;
    /* Đảm bảo dropdown là một khối để có thể căn giữa */
}
</style>
