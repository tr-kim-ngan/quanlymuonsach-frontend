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
                    <!-- <p><strong>Trạng thái hiện tại:</strong> {{ donHang.trangThai }}</p> -->
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
/* Định dạng card */
.card {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #fff;
    margin-bottom: 1rem;
    padding: 1rem;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

/* Định dạng tiêu đề */
.card-title {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
}

/* Căn chỉnh nội dung */
.card-body p {
    font-size: 0.875rem;
    /* Giảm kích thước chữ */
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
    /* Giảm kích thước chữ */
}

.trang-thai.cho-xu-ly {
    color: #ffffff;
    background-color: #FF9800;
    /* Cam */
}

.trang-thai.dang-giao {
    color: #ffffff;
    background-color: #2196F3;
    /* Xanh dương */
}

.trang-thai.da-hoan-thanh {
    color: #ffffff;
    background-color: #4CAF50;
    /* Xanh lá */
}

.trang-thai.da-huy {
    color: #ffffff;
    background-color: #F44336;
    /* Đỏ */
}

/* Nút cập nhật trạng thái */
.btn-success {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    /* Giảm kích thước chữ */
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
    /* Giảm kích thước chữ */
    color: #333;
}

/* Hiệu ứng loading */
.text-center p {
    font-size: 1rem;
    font-style: italic;
    color: #888;
}
</style>
