<template>
    <div class="container my-5">
        <div v-if="sach" class="row">
            <div class="col-md-6">
                <img :src="`http://localhost:3000/uploads/${sach.Anh}`" class="img-fluid" alt="Ảnh sách"
                    v-if="sach.Anh" />
            </div>
            <div class="col-md-6">
                <h2>{{ sach.TenSach }}</h2>
                <p><strong>Tác Giả:</strong> {{ sach.TacGia }}</p>
                <p><strong>Năm Xuất Bản:</strong> {{ sach.NamXuatBan }}</p>
                <p><strong>Giá:</strong> {{ sach.DonGia }} VNĐ</p>
                <p><strong>Mô Tả:</strong> {{ sach.MoTa }}</p>
                <router-link to="/san-pham" class="btn btn-secondary mt-3">Quay Lại</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
    data() {
        return {
            sach: null,
        };
    },
    async created() {
        const { id } = this.$route.params;
        await this.layChiTietSanPham(id);
    },
    methods: {
        async layChiTietSanPham(id) {
            try {
                this.sach = await SachService.layTheoId(id); // Gọi API để lấy chi tiết sách
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết sách:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Thêm các style cho component nếu cần */
.container {
    margin-top: 20px;
}
</style>
