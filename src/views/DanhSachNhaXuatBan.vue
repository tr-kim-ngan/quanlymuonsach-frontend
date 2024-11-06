<template>
    <div class="container">
        <h2>Danh Sách Nhà Xuất Bản</h2>
        <div class="add-button-container">
            <router-link to="/them-nha-xuat-ban" class="add-button">Thêm Nhà Xuất Bản</router-link>
        </div>
        <div class="list-container">
            <div class="header-row">
                <span class="header-name">Tên Nhà Xuất Bản</span>
                <span class="header-gmail">Gmail</span>
                <span class="header-address">Địa Chỉ</span>
                <span class="header-action">Thao Tác</span>
            </div>
            <ul class="publisher-list">
                <li v-for="nxb in danhSachNXB" :key="nxb._id" class="publisher-item">
                    <span class="publisher-name">{{ nxb.TenNXB }}</span>
                    <span class="publisher-gmail">{{ nxb.Gmail }}</span>
                    <span class="publisher-address">{{ nxb.DiaChi }}</span>
                    <div class="action-buttons">
                        <button @click="hienFormSua(nxb)" class="edit-button">Sửa</button>
                        <button @click="xoaNhaXuatBan(nxb._id)" class="delete-button">Xóa</button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="dangSua" class="edit-container">
            <h2>Sửa thông tin nhà xuất bản</h2>
            <form @submit.prevent="suaNhaXuatBan">
                <div class="form-group">
                    <label for="tenNXB">Tên NXB:</label>
                    <input type="text" v-model="nxbCanSua.TenNXB" id="tenNXB" required />
                </div>
                <div class="form-group">
                    <label for="gmail">Gmail:</label>
                    <input type="email" v-model="nxbCanSua.Gmail" id="gmail" required />
                </div>
                <div class="form-group">
                    <label for="diaChi">Địa Chỉ:</label>
                    <input type="text" v-model="nxbCanSua.DiaChi" id="diaChi" required />
                </div>
                <div class="edit-buttons">
                    <button type="submit" class="save-button">Lưu Thay Đổi</button>
                    <button @click="huySua" type="button" class="cancel-button">Hủy</button>
                </div>
            </form>
        </div>

        <p v-if="thongBao" class="notification">{{ thongBao }}</p>
    </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    data() {
        return {
            danhSachNXB: [],
            thongBao: "",
            dangSua: false,
            nxbCanSua: {
                _id: "",
                TenNXB: "",
                Gmail: "",
                DiaChi: ""
            }
        };
    },
    async created() {
        await this.layDanhSachNhaXuatBan();
    },
    methods: {
        async layDanhSachNhaXuatBan() {
            try {
                this.danhSachNXB = await NhaXuatBanService.layTatCa();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            }
        },
        
       

        async xoaNhaXuatBan(id) {
            try {
                await NhaXuatBanService.xoa(id);
                this.thongBao = "Xóa nhà xuất bản thành công!";
                await this.layDanhSachNhaXuatBan();
            } catch (error) {
                console.error("Lỗi khi xóa nhà xuất bản:", error);
                if (error.response && error.response.data && error.response.data.message) {
                    this.thongBao = error.response.data.message; // Thông báo từ backend
                } else {
                    this.thongBao = "Có lỗi xảy ra khi xóa nhà xuất bản.";
                }
                alert(this.thongBao); // Hiển thị thông báo lỗi
            }
        },





        hienFormSua(nxb) {
            this.dangSua = true;
            this.nxbCanSua = { ...nxb };
        },
        async suaNhaXuatBan() {
            try {
                const { _id, TenNXB, DiaChi, Gmail } = this.nxbCanSua;
                await NhaXuatBanService.capNhat(_id, { TenNXB, DiaChi, Gmail });
                this.thongBao = "Sửa nhà xuất bản thành công!";
                this.dangSua = false;
                await this.layDanhSachNhaXuatBan();
            } catch (error) {
                console.error("Lỗi khi sửa nhà xuất bản:", error);
                this.thongBao = "Có lỗi xảy ra khi sửa nhà xuất bản.";
            }
        },
        huySua() {
            this.dangSua = false;
            this.nxbCanSua = {
                _id: "",
                TenNXB: "",
                Gmail: "",
                DiaChi: ""
            };
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 50px auto;
    background-color: #f0f8ff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h2 {
    font-size: 2em;
    color: #4169e1;
    margin-bottom: 20px;
}

.list-container {
    text-align: left;
}

.header-row,
.publisher-item {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr;
    align-items: center;
    padding: 10px 15px;
}

.header-row {
    font-weight: bold;
    color: #2c3e50;
    background-color: #e6f7ff;
    border-radius: 10px;
    margin-bottom: 10px;
}

.publisher-list {
    list-style-type: none;
    padding: 0;
}

.publisher-item {
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.3s;
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr;
}

.publisher-item:hover {
    background-color: #e6f7ff;
    transform: translateY(-2px);
}

.publisher-name,
.publisher-gmail,
.publisher-address,
.header-name,
.header-gmail,
.header-address,
.header-action {
    text-align: center;
    font-size: 1em;
    color: #2c3e50;
}
.add-button-container {
    text-align: right;
    margin-bottom: 20px;
}

.add-button {
    background-color: #28a745;
    color: #ffffff;
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease-in-out;
}

.add-button:hover {
    background-color: #218838;
}

.action-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.edit-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.edit-button:hover {
    background-color: #388e3c;
}

.delete-button {
    background-color: #ff6b6b;
    color: #ffffff;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #ff3b3b;
}

.edit-container {
    margin-top: 30px;
    background-color: #f0f8ff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

label {
    width: 100px;
    font-weight: bold;
    color: #495057;
}

input[type="text"],
input[type="email"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.edit-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
}

.save-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.save-button {
    background-color: #4caf50;
    color: white;
}

.save-button:hover {
    background-color: #388e3c;
}

.cancel-button {
    background-color: #ff6b6b;
    color: white;
}

.cancel-button:hover {
    background-color: #ff3b3b;
}

.notification {
    margin-top: 15px;
    color: #28a745;
    font-weight: bold;
}
</style>
