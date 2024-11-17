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
                <p><strong>Nhà Xuất Bản:</strong> {{ sach.MaNXB.TenNXB }}</p>
                <p>
                    <strong>Ngày Hạn Mượn:</strong> {{ sach.NgayHanMuon }} ngày
                </p>
                <p><strong>Số lượng còn lại:</strong> {{ sach.SoQuyen }}</p>

                <!-- Nhập số lượng -->
                <div class="input-group mb-3">
                    <input type="number" class="form-control" v-model.number="soLuong" min="1" :max="sach.SoQuyen"
                        placeholder="Nhập số lượng" />
                </div>

                <!-- Nút thêm vào giỏ hàng -->
                <button class="btn btn-primary mt-3" @click="themVaoGioHang">
                    Thêm vào giỏ hàng
                </button>
                <router-link to="/san-pham" class="btn btn-secondary mt-3 ml-2">Quay Lại</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import GioHangService from "@/services/giohang.service";
import SachService from "@/services/sach.service";

export default {
    data() {
        return {
            sach: null, // Chi tiết sản phẩm
            soLuong: 1, // Số lượng mặc định khi thêm vào giỏ hàng
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
        async themVaoGioHang() {
            if (this.soLuong <= 0) {
                alert("Số lượng không hợp lệ! Vui lòng nhập số lượng lớn hơn 0.");
                return;
            }

            if (this.soLuong > this.sach.SoQuyen) {
                alert("Số lượng yêu cầu vượt quá số lượng còn lại!");
                return;
            }

            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
                    return;
                }

                const data = {
                    MaDocGia: userId,
                    MaSach: this.sach._id,
                    soLuong: this.soLuong,
                };

                const response = await GioHangService.themVaoGioHang(data);
                if (response) {
                    alert(`Sản phẩm "${this.sach.TenSach}" đã được thêm vào giỏ hàng!`);
                }
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
                alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.");
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
