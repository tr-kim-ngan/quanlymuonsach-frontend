<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Danh Sách Đơn Hàng</h2>
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

                    <div>
                        <ul>
                            <li v-for="item in donHang.items" :key="item.MaSach._id">
                                {{ item.MaSach.TenSach }} - Số lượng: {{ item.soLuong }}
                            </li>
                        </ul>
                    </div>
                    <button v-if="donHang.trangThai === 'Chờ xử lý'" class="btn btn-danger"
                        @click="huyDonHang(donHang._id)">
                        Hủy đơn hàng
                    </button>
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
    },
};
</script>
