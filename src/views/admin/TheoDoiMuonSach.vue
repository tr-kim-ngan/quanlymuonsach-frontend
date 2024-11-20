<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Theo Dõi Mượn Sách</h2>

    <!-- Bộ lọc và tìm kiếm -->
    <div
      class="mb-4 d-flex justify-content-center align-items-center filter-search-container"
    >
      <div class="mr-3">
        <label for="filter" class="mr-2">Lọc theo trạng thái:</label>
        <!-- <select id="filter" v-model="filter" @change="applyFilter"
                    class="form-control short-select d-inline-block">
                    <option value="all">Tất cả</option>
                    <option value="Đang mượn">Đang mượn</option>
                    <option value="Đã trả">Đã trả</option>
                </select> -->
        <select
          id="filter"
          v-model="filter"
          @change="applyFilter"
          class="form-control short-select d-inline-block"
        >
          <option value="all">Tất cả</option>
          <option value="Đang mượn">Đang mượn</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã trả">Đã trả</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên độc giả hoặc sách..."
          v-model="searchTerm"
          @input="applySearch"
          class="form-control short-select search-input d-inline-block"
        />
      </div>
    </div>

    <!-- Bảng hiển thị dữ liệu -->
    <div v-if="filteredRecords.length === 0" class="text-center">
      <p>Không có dữ liệu theo dõi mượn sách.</p>
    </div>
    <div v-else>
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>#</th>
            <th>Tên Độc Giả</th>
            <th>Số Điện Thoại</th>
            <th>Tên Sách</th>
            <th>Hạn mượn sách</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Số Lượng Sách Mượn</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredRecords" :key="record._id">
            <td>{{ index + 1 }}</td>
            <td>{{ record.HoTen }}</td>
            <td>{{ record.DienThoai }}</td>
            <td>{{ record.TenSach }}</td>
            <td>
              {{
                record.NgayHanMuon !== "Không có hạn"
                  ? formatDate(
                      calculateHanMuon(record.NgayMuon, record.NgayHanMuon)
                    )
                  : "Không có hạn"
              }}
            </td>

            <td>{{ formatDate(record.NgayMuon) }}</td>
            <td>
              {{ record.NgayTra ? formatDate(record.NgayTra) : "Chưa trả" }}
            </td>
            <td>{{ record.soLuong }}</td>
            <!-- <td>
                            <span :class="record.TrangThai === 'Đang mượn' ? 'text-warning' : 'text-success'">
                                {{ record.TrangThai }}
                            </span>
                        </td> -->
            <td>
              <span
                :class="{
                  'text-warning': record.TrangThai === 'Đang mượn',
                  'text-primary': record.TrangThai === 'Chờ xác nhận',
                  'text-success': record.TrangThai === 'Đã trả',
                }"
              >
                {{ record.TrangThai }}
              </span>
            </td>
            <td>
              <button
                v-if="record.TrangThai === 'Chờ xác nhận'"
                class="btn btn-success btn-sm"
                @click="xacNhanTraSach(record._id)"
              >
                Xác nhận trả sách
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TheoDoiMuonSachService from "@/services/theoDoiMuonSach.service";

export default {
  data() {
    return {
      records: [], // Dữ liệu theo dõi mượn sách từ API
      filteredRecords: [], // Dữ liệu sau khi áp dụng bộ lọc hoặc tìm kiếm
      filter: "all", // Bộ lọc trạng thái
      searchTerm: "", // Tìm kiếm
    };
  },
  async mounted() {
    await this.fetchRecords();
  },
  methods: {
    // Lấy danh sách theo dõi mượn sách từ API
    async fetchRecords() {
      try {
        const response =
        await TheoDoiMuonSachService.layDanhSachTheoDoiMuonSach();
        console.log(response);

        this.records = response;
        this.filteredRecords = response; // Hiển thị đầy đủ ban đầu
      } catch (error) {
        console.error("Lỗi khi lấy danh sách TheoDoiMuonSach:", error);
        alert(
          "Không thể tải dữ liệu theo dõi mượn sách. Vui lòng thử lại sau."
        );
      }
    },
    // Cập nhật trạng thái trả sách thành "Đã trả"
    // Xử lý xác nhận trả sách
    async xacNhanTraSach(id) {
      try {
        if (confirm("Bạn có chắc chắn muốn xác nhận trả sách này?")) {
          await TheoDoiMuonSachService.xacNhanTraSach(id);
          alert("Xác nhận trả sách thành công!");
          await this.fetchRecords(); // Làm mới danh sách
        }
      } catch (error) {
        console.error("Lỗi khi xác nhận trả sách:", error);
        alert("Không thể xác nhận trả sách. Vui lòng thử lại sau.");
      }
    },
    removeAccents(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    },
    // Tính toán hạn mượn (Ngày hết hạn mượn)
    calculateHanMuon(ngayMuon, ngayHanMuon) {
      if (!ngayMuon || !ngayHanMuon) return "Không có hạn";
      const ngayMuonDate = new Date(ngayMuon);
      const ngayHetHan = new Date(
        ngayMuonDate.getTime() + ngayHanMuon * 24 * 60 * 60 * 1000
      );
      return ngayHetHan;
    },

    // Lọc dữ liệu theo trạng thái
    applyFilter() {
      this.filteredRecords = this.records.filter((record) => {
        if (this.filter === "all") return true;
        return record.TrangThai === this.filter;
      });
      this.applySearch(); // Áp dụng tìm kiếm sau khi lọc
    },
    // Tìm kiếm dữ liệu
    applySearch() {
      const term = this.removeAccents(this.searchTerm);
      this.filteredRecords = this.records.filter((record) => {
        const matchesFilter =
          this.filter === "all" || record.TrangThai === this.filter;
        const matchesSearch =
          this.removeAccents(record.HoTen).includes(term) ||
          this.removeAccents(record.TenSach).includes(term);
        return matchesFilter && matchesSearch;
      });
    },
    // Định dạng ngày
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 50px auto;
  background-color: #f0f8ff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.table {
  margin-top: 20px;
}

.text-warning {
  color: #ffc107;
  font-weight: bold;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.filter-search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.short-select {
  width: 200px;
  margin: 0 auto;
  display: block;
}
.search-input {
  width: 350px;
  margin: 0 auto;
  display: block;
}
</style>
