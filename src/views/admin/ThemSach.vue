<template>
    <div class="container">
        <!-- <h2>{{ isEdit ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới' }}</h2> -->
        <h2>Thêm Sách Mới</h2>
        <form @submit.prevent="themSach" enctype="multipart/form-data">
            <div class="form-group">
                <label for="tenSach">Tên Sách:</label>
                <input type="text" v-model="sach.TenSach" id="tenSach" required />
            </div>
            <div class="form-group">
                <label for="donGia">Đơn Giá:</label>
                <input type="number" v-model="sach.DonGia" id="donGia" required />
            </div>
            <div class="form-group">
                <label for="soQuyen">Số Quyển:</label>
                <input type="number" v-model="sach.SoQuyen" id="soQuyen" required />
            </div>
            <div class="form-group">
                <label for="namXuatBan">Năm Xuất Bản:</label>
                <input type="number" v-model="sach.NamXuatBan" id="namXuatBan" required />
            </div>
            <div class="form-group">
                <label for="tacGia">Tác Giả:</label>
                <input type="text" v-model="sach.TacGia" id="tacGia" required />
            </div>
            
            <div class="form-group">
                <label for="moTa">Mô Tả:</label>
                <textarea v-model="sach.MoTa" id="moTa" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="maNXB">Nhà Xuất Bản:</label>
                <select v-model="sach.MaNXB" id="maNXB" required>
                    <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
                        {{ nxb.TenNXB }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="anh">Ảnh (Chọn Từ Máy):</label>
                <input type="file" @change="chonAnh" id="anh" required />
            </div>
            <div class="button-group">
                <button type="submit" class="btn-submit">Thêm Sách</button>
                <button type="button" @click="quayLaiDanhSach" class="btn-back">Quay Lại Danh Sách</button>
            </div>
        </form>
    </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";
import SachService from "@/services/sach.service";

export default {
    data() {
        return {
            sach: {
                TenSach: "",
                DonGia: 0,
                SoQuyen: 0,
                NamXuatBan: 0,
                MaNXB: "",
                TacGia: "",
                MoTa: ""
            },
            danhSachNXB: [],
            fileAnh: null,
        };
    },
    async created() {
        try {
            this.danhSachNXB = await NhaXuatBanService.layTatCa();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
        }
    },
    methods: {
        chonAnh(event) {
            this.fileAnh = event.target.files[0];
        },
        async themSach() {
            try {
                const formData = new FormData();
                formData.append("TenSach", this.sach.TenSach);
                formData.append("DonGia", this.sach.DonGia);
                formData.append("SoQuyen", this.sach.SoQuyen);
                formData.append("NamXuatBan", this.sach.NamXuatBan);
                formData.append("MaNXB", this.sach.MaNXB);
                formData.append("TacGia", this.sach.TacGia);

                formData.append("MoTa", this.sach.MoTa);
                if (this.fileAnh) {
                    formData.append("Anh", this.fileAnh);
                }

                await SachService.themMoi(formData);
                alert("Thêm sách thành công!");
            } catch (error) {
                console.error("Lỗi khi thêm sách:", error);
                alert("Có lỗi xảy ra khi thêm sách.");
            }
        },
        quayLaiDanhSach() {
            this.$router.push('/danh-sach-sach'); // Điều hướng về trang danh sách sách
        }
    },
};
</script>

<style scoped>
.container {
    max-width: 700px;
    margin: 40px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 600;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: border 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
    border: 1px solid #4c9bfb;
    box-shadow: 0px 0px 6px rgba(76, 155, 251, 0.5);
    outline: none;
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
}

.btn-submit,
.btn-back {
    width: 48%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-submit {
    background-color: #4c9bfb;
    color: white;
}

.btn-submit:hover {
    background-color: #357ae8;
}

.btn-back {
    background-color: #ccc;
    color: #333;
}

.btn-back:hover {
    background-color: #999;
}
</style>
