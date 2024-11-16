<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Quản Lý Đơn Hàng</h2>
        <div v-if="loading" class="text-center">
            <p>Đang tải danh sách đơn hàng...</p>
        </div>
        <div v-else-if="donHangs.length === 0" class="text-center">
            <p>Không có đơn hàng nào.</p>
        </div>
        <div v-else>
            <div v-for="donHang in donHangs" :key="donHang._id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Mã đơn hàng: {{ donHang._id }}</h5>
                    <p><strong>Ngày tạo:</strong> {{ formatDate(donHang.ngayTao) }}</p>
                    <p><strong>Tổng tiền:</strong> {{ donHang.tongTien }} VND</p>
                    <p><strong>Trạng thái hiện tại:</strong> {{ donHang.trangThai }}</p>

                    <!-- Dropdown để chọn trạng thái -->
                    <div v-if="donHang.trangThai !== 'Đã hoàn thành' && donHang.trangThai !== 'Đã hủy'">
                        <label for="status">Chọn trạng thái mới:</label>
                        <select v-model="selectedStatus[donHang._id]" class="form-select mb-3">
                            <option value="" disabled>Chọn trạng thái</option>
                            <option v-for="status in getValidStatuses(donHang.trangThai)" :key="status" :value="status">
                                {{ status }}</option>
                        </select>
                        <button class="btn btn-success" @click="capNhatTrangThai(donHang._id)">
                            Cập nhật trạng thái
                        </button>
                    </div>
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
        };
    },
    async mounted() {
        await this.fetchDonHangs();
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
            // Xác định trạng thái nào có thể chuyển đổi dựa trên trạng thái hiện tại
            switch (currentStatus) {
                case 'Chờ xử lý':
                    return ['Đang giao', 'Đã hủy'];
                case 'Đang giao':
                    return ['Đã hoàn thành'];
                default:
                    return [];
            }
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
</style>
