<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Sách Đã Mượn</h2>
        <div v-if="sachDangMuon.length === 0" class="text-center">
            <p>Không có sách nào đang mượn.</p>
        </div>
        <div v-else>
            <table class="table table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Tên Sách</th>
                        <th>Ngày Mượn</th>
                        <th>Hạn Mượn</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in sachDangMuon" :key="record._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ record.TenSach || 'N/A' }}</td>
                        <td>{{ formatDate(record.NgayMuon) }}</td>
                        <td>{{ record.HanMuon ? `${record.HanMuon} ngày` : 'Không có hạn' }}</td>
                        <td>
                            <span :class="record.TrangThai === 'Đang mượn' ? 'text-warning' : 'text-success'">
                                {{ record.TrangThai }}
                            </span>
                        </td>
                        <td>
                            <button v-if="record.TrangThai === 'Đang mượn'" class="btn btn-danger btn-sm"
                                @click="traSach(record._id)">
                                Trả sách
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TheoDoiMuonSachService from '@/services/theodoiMuonSach.service';

export default {
    data() {
        return {
            sachDangMuon: [], // Danh sách sách đang mượn
        };
    },
    async mounted() {
        await this.fetchSachDangMuon();
    },
    methods: {
        // Lấy danh sách sách đang mượn
        async fetchSachDangMuon() {
            try {
                const response = await TheoDoiMuonSachService.laySachDangMuon(
                    localStorage.getItem('userId')
                );
                this.sachDangMuon = response;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sách đang mượn:', error);
                alert('Không thể tải dữ liệu sách đang mượn. Vui lòng thử lại sau.');
            }
        },
        // Xử lý trả sách
        async traSach(id) {
            try {
                if (confirm('Bạn có chắc chắn muốn trả sách này?')) {
                    await TheoDoiMuonSachService.traSach(id);
                    alert('Trả sách thành công!');
                    await this.fetchSachDangMuon(); // Làm mới danh sách
                }
            } catch (error) {
                console.error('Lỗi khi trả sách:', error);
                alert('Không thể trả sách. Vui lòng thử lại sau.');
            }
        },
        // Format ngày tháng
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
    },
};
</script>

<style scoped>
.text-warning {
    color: orange;
    font-weight: bold;
}

.text-success {
    color: green;
    font-weight: bold;
}

.btn-danger {
    font-size: 0.875rem;
}
</style>
