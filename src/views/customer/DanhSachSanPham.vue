<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Danh Sách Sản Phẩm</h2>
        <div class="row">
            <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
                <div class="card h-100">
                    <img :src="getAnhUrl(book.Anh)" class="card-img-top" alt="Ảnh sách"
                        style="height: auto; max-height: 350px; object-fit: contain;">
                    <div class="card-body">
                        <h5 class="card-title">{{ book.TenSach }}</h5>
                        <p class="card-text"><strong>Đơn Giá:</strong> {{ book.DonGia }} VND</p>
                        <p class="card-text"><strong>Số Quyển:</strong> {{ book.SoQuyen }}</p>
                        <button class="btn btn-primary w-100" @click="viewBookDetails(book._id)">Xem Chi Tiết</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "DanhSachSanPham",
    data() {
        return {
            books: [],
        };
    },
    mounted() {
        this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await axios.get("http://localhost:3000/api/sach");
                this.books = response.data; // Gán dữ liệu từ API vào biến books
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sách:", error);
            }
        },
        getAnhUrl(anhFileName) {
            if (anhFileName) {
                return `http://localhost:3000/uploads/${anhFileName}`;
            }
            return 'default-image-path.jpg'; // Đường dẫn tới ảnh mặc định nếu không có ảnh
        },
        viewBookDetails(bookId) {
            this.$router.push(`/san-pham/${bookId}`);
        },
    },
};
</script>

<style scoped>
.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.card:hover {
    transform: scale(1.05);
}
</style>
