<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Sách Đã Mượn</h2>
        <!-- Ô nhập tìm kiếm và nút tìm kiếm -->
        <div class="mb-4 text-center">
            <div class="input-group w-50 mx-auto">
                <input type="text" v-model="timKiem" class="form-control" placeholder="Tìm kiếm theo tên sách..." />
                <button class="btn btn-primary ml-2" @click="thucHienTimKiem">Tìm kiếm</button>
            </div>
        </div>
        <div v-if="filteredSachDangMuon.length === 0" class="text-center">
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
                        <th>Hạn Trả Sách</th>
                        <th>Số Lượng Mượn</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in filteredSachDangMuon" :key="record._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ record.TenSach || 'N/A' }}</td>
                        <td>{{ formatDate(record.NgayMuon) }}</td>
                        <td>{{ record.HanMuon ? `${record.HanMuon} ngày` : 'Không có hạn' }}</td>
                        <td>{{ tinhHanTraSach(record.NgayMuon, record.HanMuon) }}</td>
                        <td>{{ record.soLuong }}</td>
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
import TheoDoiMuonSachService from '@/services/theoDoiMuonSach.service';

export default {
    data() {
        return {
            sachDangMuon: [], // Danh sách sách đang mượn
            timKiem: "",
        };
    },
    async mounted() {
        await this.fetchSachDangMuon();
    },
    computed: {
        filteredSachDangMuon() {
            if (!this.timKiem) {
                return this.sachDangMuon;
            }
            const tuKhoa = this.timKiem.toLowerCase();
            return this.sachDangMuon.filter((record) => {
                return record.TenSach && record.TenSach.toLowerCase().includes(tuKhoa);
            });
        },
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
                    alert('Trả sách thành công! Xin cảm ơn bạn 😚');
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
        // Tính hạn trả sách
        tinhHanTraSach(ngayMuon, hanMuon) {
            const ngayMuonDate = new Date(ngayMuon);
            ngayMuonDate.setDate(ngayMuonDate.getDate() + parseInt(hanMuon));
            return ngayMuonDate.toLocaleString(); // Hiển thị đầy đủ ngày và giờ cụ thể
        },
        thucHienTimKiem() {
            // Bạn có thể thêm logic để xử lý sự kiện tìm kiếm tại đây nếu cần
            console.log('Tìm kiếm với từ khóa:', this.timKiem);
        },
    },
};
</script>


<style scoped>
/* Nền trắng cho bảng */
.table {
    background-color: #ffffff; /* Màu nền trắng */
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 10px; /* Bo góc cho bảng */
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

/* Header của bảng */
.thead-dark th {
    background-color: #343a40; /* Màu nền đậm */
    color: #ffffff; /* Màu chữ trắng */
    text-align: center;
    font-weight: bold;
}

/* Dòng trong bảng */
tbody tr {
    background-color: #ffffff; /* Nền trắng cho các hàng */
    transition: background-color 0.3s ease;
}

tbody tr:hover {
    background-color: #f1f1f1; /* Nền xám nhạt khi hover */
}

/* Căn giữa các nội dung */
td, th {
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    border: 1px solid #ddd; /* Viền nhẹ */
}

/* Nút "Trả sách" */
.btn-danger {
    font-size: 0.875rem;
    background-color: #dc3545; /* Đỏ */
    color: #ffffff;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn-danger:hover {
    background-color: #c82333; /* Đỏ đậm hơn khi hover */
}

/* Nền input tìm kiếm */
.input-group .form-control {
    border: 1px solid #ccc;
    border-radius: 5px;
}

.input-group .btn-primary {
    border-radius: 5px;
    background-color: #007bff;
    border: none;
    transition: background-color 0.3s ease;
}

.input-group .btn-primary:hover {
    background-color: #0056b3;
}

/* Nền bảng không tràn */


</style>

