<template>
    <div class="form-container">
        <h2>Thêm Nhà Xuất Bản</h2>
        <form @submit.prevent="themNhaXuatBan">
            <div class="form-group">
                <label for="TenNXB">Tên NXB:</label>
                <input type="text" v-model="nxb.TenNXB" id="TenNXB" required />
            </div>
            <div class="form-group">
                <label for="Gmail">Gmail:</label>
                <input type="email" v-model="nxb.Gmail" id="Gmail" required />
            </div>
            <div class="form-group">
                <label for="DiaChi">Địa Chỉ:</label>
                <input type="text" v-model="nxb.DiaChi" id="DiaChi" required />
            </div>
            <div class="button-group">
                <button type="submit" class="submit-btn">Thêm Nhà Xuất Bản</button>
                <button type="button" class="view-list-btn" @click="$router.push('/danh-sach-nha-xuat-ban')">
                    Xem Danh Sách Nhà Xuất Bản
                </button>
            </div>
        </form>
        <p v-if="thongBao" class="message">{{ thongBao }}</p>
    </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    data() {
        return {
            nxb: {
                TenNXB: "",
                Gmail: "",
                DiaChi: ""
            },
            thongBao: ""
        };
    },
    methods: {
        async themNhaXuatBan() {
            try {
                await NhaXuatBanService.themMoi(this.nxb);
                this.thongBao = "Thêm nhà xuất bản thành công!";
                this.nxb = { TenNXB: "", DiaChi: "", Gmail: "" };
            } catch (error) {
                console.error("Lỗi khi thêm nhà xuất bản:", error);
                if (error.response && error.response.status === 400 && error.response.data.message.includes("Gmail")) {
                    this.thongBao = "Gmail này đã được thêm.";
                } else {
                    this.thongBao = "Có lỗi xảy ra khi thêm nhà xuất bản.";
                }
            }
        }
    }
};
</script>

<style scoped>
.form-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
    background: linear-gradient(145deg, #f3f4f6, #e2e6ea);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.08);
    text-align: center;
}

h2 {
    color: #4c6ef5;
    font-size: 1.8rem;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
    text-align: left;
}

label {
    display: block;
    font-weight: bold;
    color: #495057;
    margin-bottom: 5px;
}

input[type="text"],
input[type="email"] {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: background 0.3s, transform 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus {
    background: #edf2f7;
    outline: none;
    transform: scale(1.02);
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

.submit-btn,
.view-list-btn {
    padding: 12px 20px;
    background: linear-gradient(145deg, #4c6ef5, #5a73ff);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0px 5px 15px rgba(72, 97, 244, 0.4);
    transition: background 0.3s, transform 0.2s;
}

.submit-btn:hover,
.view-list-btn:hover {
    background: #4256c3;
    transform: scale(1.05);
}

.message {
    margin-top: 15px;
    color: #28a745;
    font-weight: bold;
}
</style>
