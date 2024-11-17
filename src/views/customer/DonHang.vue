<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4" v-if="!selectedOrder">Danh Sách Đơn Hàng</h2>
        <h2 class="text-center mb-4" v-else>Chi Tiết Đơn Hàng</h2>

        <!-- Danh sách đơn hàng -->
        <div v-if="!selectedOrder">
            <div v-if="donHangs.length === 0" class="text-center">
                <p>Bạn chưa có đơn hàng nào.</p>
            </div>
            <div v-else>
                <div v-for="donHang in donHangs" :key="donHang._id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Mã đơn hàng: {{ donHang._id }}</h5>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(donHang.ngayTao) }}</p>
                        <p><strong>Tổng tiền:</strong> {{ donHang.tongTien }} VND</p>
                        <p><strong>Trạng thái:</strong>
                            <span v-if="validStatuses.includes(donHang.trangThai)">
                                {{ donHang.trangThai }}
                            </span>
                            <span v-else>
                                Trạng thái không xác định
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
        };
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
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        xemChiTietDonHang(donHang) {
            this.selectedOrder = donHang; // Lưu thông tin đơn hàng để hiển thị chi tiết
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
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
