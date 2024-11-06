
<template>
    <div class="container">
        <div class="header-container">
            <h2>Danh Sách Sách</h2>
            <button @click="$router.push('/them-sach')" class="add-button">Thêm Sách</button>
        </div>
        <div class="list-container">
            <div class="header-row">
                <span class="header-name">Tên Sách</span>
                <span class="header-image">Ảnh</span>
                <span class="header-price">Đơn Giá</span>
                <span class="header-quantity">Số Quyển</span>
                <span class="header-year">Năm Xuất Bản</span>
                <span class="header-publisher">Nhà Xuất Bản</span>
                <span class="header-action">Thao Tác</span>
            </div>
            <ul class="book-list">
                <li v-for="sach in danhSachSach" :key="sach._id" class="book-item">
                    <span class="book-name">{{ sach.TenSach }}</span>
                    <img :src="'http://localhost:3000/uploads/' + sach.Anh" alt="Ảnh sách" class="book-image"
                        v-if="sach.Anh" />
                    <span class="book-price">{{ sach.DonGia }} VNĐ</span>
                    <span class="book-quantity">{{ sach.SoQuyen }}</span>
                    <span class="book-year">{{ sach.NamXuatBan }}</span>
                    <span class="book-publisher">{{ sach.MaNXB ? sach.MaNXB.TenNXB : 'Không có nhà xuất bản' }}</span>
                    <div class="action-buttons">
                        <button @click="xemChiTiet(sach)" class="detail-button">Xem Chi Tiết</button>
                        <button @click="xoaSach(sach._id)" class="delete-button">Xóa</button>
                    </div>
                </li>
            </ul>
        </div>


        <!-- Modal chi tiết sách -->
        <!-- <div v-if="chiTietSach" class="modal-overlay" @click="dongChiTiet">
            <div class="modal-content" @click.stop>
                <h2>Thông Tin Chi Tiết</h2>
                <div class="modal-body">
                    <img :src="anhMoi ? URL.createObjectURL(anhMoi) : 'http://localhost:3000/uploads/' + chiTietSach.Anh"
                        alt="Ảnh sách" class="modal-image" />
                    <div class="modal-details">
                        <div v-if="!isEditing">
                            <p><strong>Tên Sách:</strong> {{ chiTietSach.TenSach }}</p>
                            <p><strong>Đơn Giá:</strong> {{ chiTietSach.DonGia }} VNĐ</p>
                            <p><strong>Số Quyển:</strong> {{ chiTietSach.SoQuyen }}</p>
                            <p><strong>Năm Xuất Bản:</strong> {{ chiTietSach.NamXuatBan }}</p>
                            <p><strong>Nhà Xuất Bản:</strong> {{ chiTietSach.MaNXB.TenNXB }}</p>
                            <p><strong>Nguồn Gốc/Tác Giả:</strong> {{ chiTietSach.NguonGoc }}</p>
                            <p><strong>Mô Tả:</strong> {{ chiTietSach.MoTa }}</p>
                        </div>
                        <div v-else>
                            <div class="form-group">
                                <label for="tenSach">Tên Sách:</label>
                                <input type="text" v-model="chiTietSach.TenSach" id="tenSach" required />
                            </div>
                            <div class="form-group">
                                <label for="donGia">Đơn Giá:</label>
                                <input type="number" v-model="chiTietSach.DonGia" id="donGia" required />
                            </div>
                            <div class="form-group">
                                <label for="soQuyen">Số Quyển:</label>
                                <input type="number" v-model="chiTietSach.SoQuyen" id="soQuyen" required />
                            </div>
                            <div class="form-group">
                                <label for="namXuatBan">Năm Xuất Bản:</label>
                                <input type="number" v-model="chiTietSach.NamXuatBan" id="namXuatBan" required />
                            </div>
                            <div class="form-group">
                                <label for="maNXB">Nhà Xuất Bản:</label>
                                <select v-model="chiTietSach.MaNXB" id="maNXB" required>
                                    <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
                                        {{ nxb.TenNXB }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="nguonGoc">Nguồn Gốc/Tác Giả:</label>
                                <input type="text" v-model="chiTietSach.NguonGoc" id="nguonGoc" />
                            </div>
                            <div class="form-group">
                                <label for="moTa">Mô Tả:</label>
                                <textarea v-model="chiTietSach.MoTa" id="moTa" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="anh">Thay Đổi Ảnh:</label>
                                <input type="file" @change="chonAnh" id="anh" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button @click="dongChiTiet" class="close-button">Đóng</button>
                    <button v-if="!isEditing" @click="batDauSua" class="edit-button">Sửa</button>
                    <button v-if="isEditing" @click="luuSua" class="save-button">Lưu</button>
                </div>
            </div>
        </div> -->
        <div v-if="chiTietSach" class="modal-overlay" @click="dongChiTiet">
            <div class="modal-content" @click.stop>
                <h2>Thông Tin Chi Tiết</h2>
                <div class="modal-body">
                    <img :src="anhMoi ? URL.createObjectURL(anhMoi) : 'http://localhost:3000/uploads/' + chiTietSach.Anh"
                        alt="Ảnh sách" class="modal-image" />
                    <div class="modal-details">
                        <div v-if="!isEditing">
                            <p><strong>Tên Sách:</strong> {{ chiTietSach.TenSach }}</p>
                            <p><strong>Đơn Giá:</strong> {{ chiTietSach.DonGia }} VNĐ</p>
                            <p><strong>Số Quyển:</strong> {{ chiTietSach.SoQuyen }}</p>
                            <p><strong>Năm Xuất Bản:</strong> {{ chiTietSach.NamXuatBan }}</p>
                            <p><strong>Nhà Xuất Bản:</strong> {{ chiTietSach.MaNXB.TenNXB }}</p>
                            <p><strong>Nguồn Gốc/Tác Giả:</strong> {{ chiTietSach.NguonGoc }}</p>
                            <p><strong>Mô Tả:</strong> {{ chiTietSach.MoTa }}</p>
                        </div>
                        <div v-else>
                            <div class="form-group">
                                <label for="tenSach">Tên Sách:</label>
                                <input type="text" v-model="chiTietSach.TenSach" id="tenSach" required />
                            </div>
                            <div class="form-group">
                                <label for="donGia">Đơn Giá:</label>
                                <input type="number" v-model="chiTietSach.DonGia" id="donGia" required />
                            </div>
                            <div class="form-group">
                                <label for="soQuyen">Số Quyển:</label>
                                <input type="number" v-model="chiTietSach.SoQuyen" id="soQuyen" required />
                            </div>
                            <div class="form-group">
                                <label for="namXuatBan">Năm Xuất Bản:</label>
                                <input type="number" v-model="chiTietSach.NamXuatBan" id="namXuatBan" required />
                            </div>
                            <div class="form-group">
                                <label for="maNXB">Nhà Xuất Bản:</label>
                                <select v-model="chiTietSach.MaNXB" id="maNXB" required>
                                    <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb">
                                        {{ nxb.TenNXB }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="nguonGoc">Nguồn Gốc/Tác Giả:</label>
                                <input type="text" v-model="chiTietSach.NguonGoc" id="nguonGoc" />
                            </div>
                            <div class="form-group">
                                <label for="moTa">Mô Tả:</label>
                                <textarea v-model="chiTietSach.MoTa" id="moTa" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="anh">Thay Đổi Ảnh:</label>
                                <input type="file" @change="chonAnh" id="anh" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button @click="dongChiTiet" class="close-button">Đóng</button>
                    <button v-if="!isEditing" @click="batDauSua" class="edit-button">Sửa</button>
                    <button v-if="isEditing" @click="luuSua" class="save-button">Lưu</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    data() {
        return {
            danhSachSach: [],
            danhSachNXB: [], // Thêm danh sách nhà xuất bản vào data
            thongBao: "",
            chiTietSach: null,
            isEditing: false,
            anhMoi: null,
        };
    },
    async created() {
        await this.layDanhSachSach();
        await this.layDanhSachNXB();
    },
    methods: {
        async layDanhSachSach() {
            try {
                this.danhSachSach = await SachService.layTatCa();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sách:", error);
            }
        },


        async layDanhSachNXB() {
            try {
                this.danhSachNXB = await NhaXuatBanService.layTatCa();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            }
        },
        async xoaSach(id) {
            try {
                await SachService.xoa(id);
                this.thongBao = "Xóa sách thành công!";
                await this.layDanhSachSach();
            } catch (error) {
                console.error("Lỗi khi xóa sách:", error);
                this.thongBao = "Có lỗi xảy ra khi xóa sách.";
            }
        },
        xemChiTiet(sach) {
            this.chiTietSach = { ...sach };
            this.isEditing = false;
            this.anhMoi = null;
        },
        dongChiTiet() {
            this.chiTietSach = null;
            this.isEditing = false;
            this.anhMoi = null; 
        },
        batDauSua() {
            this.isEditing = true;
        },
        chonAnh(event) {
            this.anhMoi = event.target.files[0];
        },
        async luuSua() {
            try {
                const formData = new FormData();
                formData.append("TenSach", this.chiTietSach.TenSach);
                formData.append("DonGia", this.chiTietSach.DonGia);
                formData.append("SoQuyen", this.chiTietSach.SoQuyen);
                formData.append("NamXuatBan", this.chiTietSach.NamXuatBan);
                formData.append("MaNXB", this.chiTietSach.MaNXB._id); // Sử dụng _id của nhà xuất bản
                formData.append("NguonGoc", this.chiTietSach.NguonGoc);
                formData.append("MoTa", this.chiTietSach.MoTa);
                // Kiểm tra nếu có ảnh mới
                if (this.anhMoi) {
                    formData.append("Anh", this.anhMoi);
                }

                await SachService.capNhat(this.chiTietSach._id, formData);
                this.thongBao = "Cập nhật sách thành công!";
                await this.layDanhSachSach();
                this.dongChiTiet();
            } catch (error) {
                console.error("Lỗi khi cập nhật sách:", error);
                this.thongBao = "Có lỗi xảy ra khi cập nhật sách.";
            }
        }
    }
};
</script>

<style scoped>
            .container {
                max-width: 1200px;
                margin: 50px auto;
                background-color: #f0f8ff;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .add-button {
                background-color: #4169e1;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s;
            }

            .add-button:hover {
                background-color: #27408b;
            }

            .header-row,
            .book-item {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
                align-items: center;
                padding: 10px 15px;
                text-align: center;
            }

            .book-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .book-item {
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s;
            }

            .book-item:hover {
                background-color: #e6f7ff;
            }

            .book-name,
            .book-price,
            .book-quantity,
            .book-year,
            .book-publisher {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1em;
            }

            .book-image {
                width: 60px;
                height: 80px;
                border-radius: 5px;
                object-fit: cover;
                display: block;
                margin: 0 auto;
            }

            .action-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            .detail-button {
                background-color: #4caf50;
                color: #ffffff;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .detail-button:hover {
                background-color: #388e3c;
            }

            .delete-button {
                background-color: #ff6b6b;
                color: #ffffff;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .delete-button:hover {
                background-color: #ff3b3b;
            }

            
                         /* Modal styles */
                         .modal-overlay {
                             position: fixed;
                             top: 0;
                             left: 0;
                             right: 0;
                             bottom: 0;
                             background: rgba(0, 0, 0, 0.6);
                             display: flex;
                             justify-content: center;
                             align-items: center;
                         }
            
                         .modal-content {
                             background-color: #fff;
                             padding: 20px;
                             border-radius: 10px;
                             max-width: 800px;
                             width: 100%;
                             box-shadow: none;
                             border: none;
                         }
            
                         .modal-body {
                             display: flex;
                             flex-direction: row;
                             gap: 20px;
                             align-items: flex-start;
                         }
            
                         .modal-image {
                             width: 300px;
                             height: auto;
                             border-radius: 8px;
                             object-fit: cover;
                         }
            
                         .modal-details {
                             display: flex;
                             flex-direction: column;
                             gap: 15px;
                             width: 100%;
                         }
            
                         .form-group {
                             display: flex;
                             flex-direction: column;
                             gap: 5px;
                         }
            
                         .form-group label {
                             font-weight: bold;
                             font-size: 0.9em;
                             color: #333;
                         }
            
                         .form-group input,
                         .form-group textarea,
                         .form-group select {
                             padding: 8px;
                             border: 1px solid #ccc;
                             border-radius: 5px;
                             font-size: 0.9em;
                             width: 100%;
                             max-width: 300px;
                             box-sizing: border-box;
                         }
            
                         /* Style adjustments for select dropdown */
                         .form-group select {
                             appearance: none;
                             -webkit-appearance: none;
                             -moz-appearance: none;
                             background-color: #fff;
                             cursor: pointer;
                         }
            
                         .modal-buttons {
                             display: flex;
                             justify-content: space-between;
                             gap: 10px;
                             margin-top: 20px;
                         }
            
                         .close-button,
                         .edit-button,
                         .save-button {
                             padding: 10px 20px;
                             border-radius: 5px;
                             cursor: pointer;
                             width: 48%;
                             font-size: 1em;
                             text-align: center;
                             border: none;
                             box-shadow: none;
                         }
            
                         .close-button {
                             background-color: #ff6b6b;
                             color: white;
                         }
            
                         .close-button:hover {
                             background-color: #ff3b3b;
                         }
            
                         .edit-button {
                             background-color: #4caf50;
                             color: white;
                         }
            
                         .edit-button:hover {
                             background-color: #388e3c;
                         }
            
                         .save-button {
                             background-color: #2196f3;
                             color: white;
                         }
            
                         .save-button:hover {
                             background-color: #0b7dda;
                         }
</style>


  

