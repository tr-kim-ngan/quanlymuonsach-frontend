<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4" v-if="!selectedOrder">Quản Lý Đơn Hàng</h2>
        <h2 class="text-center mb-4" v-else>Chi Tiết Đơn Hàng</h2>
        <!-- Phần tìm kiếm đơn hàng theo trạng thái -->
        <div v-if="!selectedOrder" class="mb-4 text-center">
            <div class="input-group w-50 mx-auto">
                <select v-model="timKiemTrangThai" class="form-control">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
                <button class="btn btn-primary ml-2" @click="thucHienTimKiem">Tìm kiếm</button>
            </div>
        </div>

        <!-- Danh sách đơn hàng -->
        <div v-if="!selectedOrder">
            <div v-if="loading" class="text-center">
                <p>Đang tải danh sách đơn hàng...</p>
            </div>
            <div v-else-if="filteredDonHangs.length === 0" class="text-center">
                <p>Không có đơn hàng nào.</p>
            </div>
            <div v-else>
                <div v-for="donHang in filteredDonHangs" :key="donHang._id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Mã đơn hàng: {{ donHang._id }}</h5>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(donHang.ngayTao) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ donHang.tongTien }} VND</p>
                        <p>
                            <strong>Trạng thái hiện tại: </strong>
                            <span class="trang-thai" :class="{
                                'cho-xu-ly': donHang.trangThai === 'Chờ xử lý',
                                'dang-giao': donHang.trangThai === 'Đang giao',
                                'da-hoan-thanh': donHang.trangThai === 'Đã hoàn thành',
                                'da-huy': donHang.trangThai === 'Đã hủy'
                            }">
                                {{ donHang.trangThai }}
                            </span>
                        </p>

                        <!-- Dropdown để chọn trạng thái -->
                        <div v-if="donHang.trangThai !== 'Đã hoàn thành' && donHang.trangThai !== 'Đã hủy'">
                            <label for="status">Chọn trạng thái mới:</label>
                            <select v-model="selectedStatus[donHang._id]" class="form-select mb-3">
                                <option value="" disabled>Chọn trạng thái</option>
                                <option v-for="status in getValidStatuses(donHang.trangThai)" :key="status"
                                    :value="status">
                                    {{ status }}</option>
                            </select>
                            <button class="btn btn-success" @click="capNhatTrangThai(donHang._id)">
                                Cập nhật trạng thái
                            </button>
                        </div>
                        <div>

                            <button class="btn btn-primary mt-2" @click="xemChiTietDonHang(donHang)">Xem chi
                                tiết</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Chi tiết đơn hàng -->
        <div v-else>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Mã đơn hàng: {{ selectedOrder._id }}</h5>
                    <p><strong>Ngày tạo:</strong> {{ formatDate(selectedOrder.ngayTao) }}</p>
                    <p><strong>Tổng tiền:</strong> {{ selectedOrder.tongTien }} VND</p>
                    <p><strong>Trạng thái:</strong> {{ selectedOrder.trangThai }}</p>
                    <div>
                        <h5 class="mt-4">Sản phẩm:</h5>
                        <div v-for="item in selectedOrder.items" :key="item.MaSach._id" class="product-detail">
                            <img :src="getAnhUrl(item.MaSach.Anh)" alt="Hình ảnh sản phẩm" class="product-image mr-3" />
                            <div class="product-info">
                                <p><strong>Tên sách:</strong> {{ item.MaSach.TenSach }}</p>
                                <p><strong>Đơn giá:</strong> {{ item.MaSach.DonGia }} VND</p>
                                <p><strong>Số lượng:</strong> {{ item.soLuong }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <h5>Thông tin người nhận:</h5>
                        <p><strong>Tên người nhận:</strong> {{ selectedOrder.tenNguoiNhan }}</p>
                        <p><strong>Số điện thoại:</strong> {{ selectedOrder.soDienThoai }}</p>
                        <p><strong>Địa chỉ:</strong> {{ selectedOrder.diaChi }}</p>
                    </div>
                    <button class="btn btn-secondary mt-3" @click="quayLaiDanhSach">Quay lại danh sách</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DonHangService from "@/services/donhang.service";

export default {
    data() {
        return {
            donHangs: [],
            selectedStatus: {},
            loading: true,
            selectedOrder: null,
            timKiemTrangThai: "", 
        };
    },
    async mounted() {
        await this.fetchDonHangs();
    },
    computed: {
        filteredDonHangs() {
            // Lọc đơn hàng dựa theo trạng thái tìm kiếm
            if (!this.timKiemTrangThai) {
                return this.donHangs;
            }
            return this.donHangs.filter(donHang => donHang.trangThai === this.timKiemTrangThai);
        },
    },
    methods: {
        async fetchDonHangs() {
            this.loading = true;
            try {
                const response = await DonHangService.layTatCaDonHang();
                this.donHangs = response;
            } catch (error) {
                console.error("Lỗi khi tải danh sách đơn hàng:", error);
                alert("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
            } finally {
                this.loading = false;
            }
        },
        async capNhatTrangThai(id) {
            const newStatus = this.selectedStatus[id];
            if (!newStatus) {
                alert("Vui lòng chọn trạng thái mới.");
                return;
            }
            try {
                await DonHangService.capNhatTrangThaiDonHang(id, { trangThai: newStatus });
                alert("Cập nhật trạng thái thành công!");
                this.fetchDonHangs();
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái:", error);
                alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        getValidStatuses(currentStatus) {
            switch (currentStatus) {
                case 'Chờ xử lý':
                    return ['Đang giao', 'Đã hủy'];
                case 'Đang giao':
                    return ['Đã hoàn thành'];
                default:
                    return [];
            }
        },
        xemChiTietDonHang(donHang) {
            this.selectedOrder = donHang;
        },
        quayLaiDanhSach() {
            this.selectedOrder = null;
        },
        getAnhUrl(anhFileName) {
            if (anhFileName) {
                return `http://localhost:3000/uploads/${anhFileName}`;
            }
            return "default-image-path.jpg";
        },
        thucHienTimKiem() {
            // Thực hiện tìm kiếm dựa trên trạng thái đã chọn
            console.log("Tìm kiếm trạng thái:", this.timKiemTrangThai);
        },
    },
};
</script>

<style scoped>
/* Định dạng card */
.card {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
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

/* Định dạng tiêu đề */
.card-title {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0rem;
}

/* Căn chỉnh nội dung */
.card-body p {
    font-size: 0.8rem;
    color: #555;
    margin-bottom: 0.3rem;
}

/* Màu sắc trạng thái */
.trang-thai {
    font-weight: bold;
    padding: 0.2rem 0.7rem;
    border-radius: 4px;
    display: inline-block;
    font-size: 0.85rem;
}

.trang-thai.cho-xu-ly {
    color: #ffffff;
    background-color: #FF9800;
}

.trang-thai.dang-giao {
    color: #ffffff;
    background-color: #2196F3;
}

.trang-thai.da-hoan-thanh {
    color: #ffffff;
    background-color: #4CAF50;
}

.trang-thai.da-huy {
    color: #ffffff;
    background-color: #F44336;
}
.btn {
    padding: 0.4rem 0.9rem;
        /* Giảm padding để nhỏ gọn hơn */
    font-size: 0.8rem;
    /* Kích thước chữ giống nhau */
    border-radius: 4px;
    /* Bo góc đồng nhất */
    font-weight: bold;
    /* Độ dày chữ giống nhau */
    display: inline-block;
    cursor: pointer;
}

/* Nút cập nhật trạng thái */
.btn-success {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 0.4rem 0.9rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-success:hover {
    background-color: #45a049;
}

/* Dropdown */
.form-select {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.3rem;
    font-size: 0.85rem;
    color: #333;
    max-width: 200px;
}

/* Hiệu ứng loading */
.text-center p {
    font-size: 1rem;
    font-style: italic;
    color: #888;
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
</style>
