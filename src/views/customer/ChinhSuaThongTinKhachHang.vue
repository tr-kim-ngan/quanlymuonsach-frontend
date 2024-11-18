<template>
    <div class="container">
        <h3>Chỉnh sửa thông tin của bạn</h3>
        <form @submit.prevent="updateProfile">

           
            <div class="mb-3">
                <label for="Ten" class="form-label">Tên:</label>
                <input type="text" class="form-control" id="Ten" v-model="Ten" />
            </div>
            <div class="mb-3">
                <label for="HoLot" class="form-label">Họ Lót:</label>
                <input type="text" class="form-control" id="HoLot" v-model="HoLot" />
            </div>
            <div class="mb-3">
                <label for="NgaySinh" class="form-label">Ngày Sinh:</label>
                <input type="date" class="form-control" id="NgaySinh" v-model="NgaySinh" />
            </div>
            <div class="mb-3">
                <label for="Phai" class="form-label">Phái:</label>
                <select class="form-select" id="Phai" v-model="Phai">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="DiaChi" class="form-label">Địa Chỉ:</label>
                <input type="text" class="form-control" id="DiaChi" v-model="DiaChi" />
            </div>
            <div class="mb-3">
                <label for="DienThoai" class="form-label">Điện Thoại:</label>
                <input type="text" class="form-control" id="DienThoai" v-model="DienThoai" />
            </div>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
            <button type="button" class="btn btn-secondary ms-2" @click="quayLai">Quay lại</button>
        </form>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import axios from "axios";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";



export default {
    name: "ChinhSuaThongTinKhachHang",
    data() {
        return {
            HoLot: "",
            Ten: "",
            NgaySinh: "",
            Phai: "",
            DiaChi: "",
            DienThoai: ""
        };
    },
    created() {
        console.log("Component created - gọi phương thức layThongTinKhachHang");
        this.layThongTinKhachHang(); // Kiểm tra `userId` khi component vừa được tạo
        const userId = localStorage.getItem('userId');
        console.log("User ID sau khi tạo component:", userId);
        if (!userId) {
            console.error("Không tìm thấy userId trong localStorage. Vui lòng đăng nhập lại.");
        }
    },
    mounted() {
         this.initFlatpickr();
    },
    watch: {
        NgaySinh(val) {
            if (val) {
                this.initFlatpickr();
            }
        }
    },
    methods: {
        layThongTinKhachHang() {
            this.HoLot = localStorage.getItem("userFirstName") || "";
            this.Ten = localStorage.getItem("userLastName") || "";
            const ngaySinh = localStorage.getItem("userBirthDate");
            this.NgaySinh = ngaySinh ? moment(ngaySinh, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
            this.Phai = localStorage.getItem("userGender") || "";
            this.DiaChi = localStorage.getItem("userAddress") || "";
            this.DienThoai = localStorage.getItem("userPhone") || "";
            const userId = localStorage.getItem("userId");
            console.log("User ID trong layThongTinKhachHang:", userId);
        },
       
        async updateProfile() {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || userId === "undefined") {
                    console.error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
                    alert('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
                    return;
                }
                const formattedNgaySinh = moment(this.NgaySinh, ["YYYY-MM-DD", "DD-MM-YYYY"]).format("DD-MM-YYYY");

                const response = await axios.put(`http://localhost:3000/api/docgia/${userId}`, {
                   username: this.username,
                    HoLot: this.HoLot,
                    Ten: this.Ten,
                    NgaySinh: formattedNgaySinh,
                    Phai: this.Phai,
                    DiaChi: this.DiaChi,
                    DienThoai: this.DienThoai
                });

                // Lưu lại thông tin cập nhật vào localStorage
                
                localStorage.setItem("userFirstName", this.HoLot);
                localStorage.setItem("userLastName", this.Ten);
                localStorage.setItem("userBirthDate", formattedNgaySinh);
                localStorage.setItem("userGender", this.Phai);
                localStorage.setItem("userAddress", this.DiaChi);
                localStorage.setItem("userPhone", this.DienThoai);

                alert('Cập nhật thành công!');
            } catch (error) {
                console.error("Lỗi cập nhật:", error);
                alert('Cập nhật thất bại. Vui lòng thử lại sau.');
            }
        }
,
        quayLai() {
            this.$router.push('/san-pham');
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin-top: 20px;
    margin-bottom: 20px;
}

body {
    overflow-y: auto;
}

html,
body {
    height: 100%;
}
</style>