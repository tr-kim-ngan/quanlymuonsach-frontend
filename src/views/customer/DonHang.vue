<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4" v-if="!selectedOrder">Danh Sách Đơn Hàng</h2>
        <h2 class="text-center mb-4" v-else>Chi Tiết Đơn Hàng</h2>
        <!-- Tìm kiếm đơn hàng theo trạng thái -->
        <div v-if="!selectedOrder" class="mb-4 text-center">
            <div class="input-group w-50 mx-auto">
                <select v-model="timKiemTrangThai" class="form-control">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
                <button class="btn btn-primary" @click="thucHienTimKiem">Tìm kiếm</button>
            </div>
        </div>

        <!-- Danh sách đơn hàng -->
        <div v-if="!selectedOrder">
            <div v-if="donHangs.length === 0" class="text-center">
                <p>Bạn chưa có đơn hàng nào.</p>
            </div>
            <div v-else>
                <div v-for="donHang in filteredDonHangs" :key="donHang._id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Mã đơn hàng: {{ donHang._id }}</h5>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(donHang.ngayTao) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ donHang.tongTien }} VND</p>
                        <!-- <p><strong>Trạng thái:</strong>
                            <span v-if="validStatuses.includes(donHang.trangThai)">
                                {{ donHang.trangThai }}
                            </span>
                            <span v-else>
                                Trạng thái không xác định
                            </span>
                        </p> -->
                        <p><strong>Trạng thái hiện tại: </strong>
                            <span class="trang-thai" :class="{
                            'cho-xu-ly': donHang.trangThai === 'Chờ xử lý',
                            'dang-giao': donHang.trangThai === 'Đang giao',
                            'da-hoan-thanh': donHang.trangThai === 'Đã hoàn thành',
                            'da-huy': donHang.trangThai === 'Đã hủy'
                        }">
                                {{ donHang.trangThai }}
                            </span>
                        </p>



                        <button class="btn btn-primary mr-2" @click="xemChiTietDonHang(donHang)">Xem chi tiết</button>
                        <button v-if="donHang.trangThai === 'Chờ xử lý'" class="btn btn-danger"
                            @click="huyDonHang(donHang._id)">
                            Hủy đơn hàng
                        </button>
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
                    <!-- Hiển thị thông tin người nhận cho tất cả trạng thái -->
                    <div class="mt-4">
                        <h5>Thông tin người nhận:</h5>
                        <p><strong>Tên người nhận:</strong> {{ selectedOrder.tenNguoiNhan }}</p>
                        <p><strong>Số điện thoại:</strong> {{ selectedOrder.soDienThoai }}</p>
                        <p><strong>Địa chỉ:</strong> {{ selectedOrder.diaChi }}</p>
                    </div>

                    <!-- Form nhập thông tin thanh toán nếu trạng thái đơn hàng là "Chờ xử lý" -->
                    <div v-if="selectedOrder.trangThai === 'Chờ xử lý'" class="mt-4">
                        <h5>Thông tin người nhận:</h5>
                        <form @submit.prevent="capNhatThongTinThanhToan">
                            <div class="form-group">
                                <label for="tenNguoiNhan">Tên người nhận:</label>
                                <input type="text" v-model="tenNguoiNhan" class="form-control" id="tenNguoiNhan"
                                    required>
                            </div>
                            <div class="form-group">
                                <label for="soDienThoai">Số điện thoại:</label>
                                <input type="text" v-model="soDienThoai" class="form-control" id="soDienThoai" required>
                            </div>
                            <div class="form-group">
                                <label for="diaChi">Địa chỉ:</label>
                                <input type="text" v-model="diaChi" class="form-control" id="diaChi" required>
                            </div>
                            <button type="submit" class="btn btn-success mt-3">Cập nhật thông tin</button>
                        </form>
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
            donHangs: [], // Danh sách đơn hàng
            userId: localStorage.getItem("userId"), // ID độc giả từ localStorage
            validStatuses: ['Chờ xử lý', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'],
            selectedOrder: null, // Đơn hàng được chọn để xem chi tiết
            tenNguoiNhan: "", // Tên người nhận
            soDienThoai: "", // Số điện thoại người nhận
            diaChi: "", // Địa chỉ người nhận
            timKiemTrangThai: "",
        };
    },
    computed: {
        filteredDonHangs() {
            if (!this.timKiemTrangThai) {
                return this.donHangs;
            }
            return this.donHangs.filter(donHang => donHang.trangThai === this.timKiemTrangThai);
        },
    },
    async mounted() {
        await this.fetchDonHangs();
    },
    methods: {
        async fetchDonHangs() {
            try {
                const response = await DonHangService.layDanhSachDonHang(this.userId);
                console.log("Danh sách đơn hàng nhận được:", response);
                this.donHangs = response;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
                alert("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
            }
        },
        async huyDonHang(id) {
            try {
                if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                    const response = await DonHangService.huyDonHang(id);
                    console.log("Kết quả khi hủy đơn hàng:", response);
                    alert("Đơn hàng đã được hủy!");
                    this.fetchDonHangs();
                }
            } catch (error) {
                console.error("Lỗi khi hủy đơn hàng:", error);
                alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
            }
        },
        async capNhatThongTinThanhToan() {
            try {
                if (this.selectedOrder) {
                    // Cập nhật thông tin thanh toán vào đơn hàng đã chọn
                    this.selectedOrder.tenNguoiNhan = this.tenNguoiNhan;
                    this.selectedOrder.soDienThoai = this.soDienThoai;
                    this.selectedOrder.diaChi = this.diaChi;

                    await DonHangService.capNhatThongTinDonHang(this.selectedOrder._id, {
                        tenNguoiNhan: this.tenNguoiNhan,
                        soDienThoai: this.soDienThoai,
                        diaChi: this.diaChi,
                    });

                    alert("Cập nhật thông tin thanh toán thành công!");
                    this.fetchDonHangs(); // Cập nhật lại danh sách đơn hàng
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin thanh toán:", error);
                alert("Không thể cập nhật thông tin thanh toán. Vui lòng thử lại sau.");
            }
        }
,
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        xemChiTietDonHang(donHang) {
            this.selectedOrder = donHang; // Lưu thông tin đơn hàng để hiển thị chi tiết
            // Gán giá trị cho các trường thông tin thanh toán nếu đã tồn tại
            this.tenNguoiNhan = donHang.tenNguoiNhan || "";
            this.soDienThoai = donHang.soDienThoai || "";
            this.diaChi = donHang.diaChi || "";
        },
        quayLaiDanhSach() {
            this.selectedOrder = null; // Quay lại danh sách đơn hàng
        },
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

/* Màu sắc trạng thái */
.trang-thai {
    font-weight: bold;
    padding: 0.2rem 0.7rem;
    border-radius: 4px;
    display: inline-block;
    font-size: 0.85rem;
    /* Giảm kích thước chữ */
}

.trang-thai.cho-xu-ly {
    color: #ffffff;
    background-color: #FF9800;
    /* Cam - Chờ xử lý */
}

.trang-thai.dang-giao {
    color: #ffffff;
    background-color: #2196F3;
    /* Xanh dương - Đang giao */
}

.trang-thai.da-hoan-thanh {
    color: #ffffff;
    background-color: #4CAF50;
    /* Xanh lá - Đã hoàn thành */
}

.trang-thai.da-huy {
    color: #ffffff;
    background-color: #F44336;
    /* Đỏ - Đã hủy */
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

.form-group {
    margin-bottom: 1rem;
}
</style>
