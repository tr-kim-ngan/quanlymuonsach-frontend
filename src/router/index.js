import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";

import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";


// Import các component cho admin
import ThemNhaXuatBan from "@/views/admin/ThemNhaXuatBan.vue";
import DanhSachNhaXuatBan from "@/views/admin/DanhSachNhaXuatBan.vue";
import DanhSachSach from "@/views/admin/DanhSachSach.vue";
import ThemSach from "@/views/admin/ThemSach.vue";
import DanhSachDonHang from "@/views/admin/DanhSachDonHang.vue";
import QuanLyHoaDon from "@/views/admin/QuanLyHoaDon.vue";
import TheoDoiMuonSach from "@/views/admin/TheoDoiMuonSach.vue";


// Import thêm các component cho độc giả
import DanhSachSanPham from "@/views/customer/DanhSachSanPham.vue";
import ChiTietSanPham from "@/views/customer/ChiTietSanPham.vue";
import GioHang from "@/views/customer/GioHang.vue";
import DonHang from "@/views/customer/DonHang.vue";
import SachDaMuon from "@/views/customer/SachDaMuon.vue";
import ChinhSuaThongTinKhachHang from "@/views/customer/ChinhSuaThongTinKhachHang.vue";
import HoaDon from "@/views/customer/HoaDon.vue";


const routes = [
  {
    path: "/",
    redirect: () => {
      const role = AuthService.getRole();
      if (role === "admin") {
        return "/danh-sach-nha-xuat-ban";
      } else if (role === "customer") {
        return "/san-pham";
      } else {
        return "/san-pham"; // Trang mặc định cho khách chưa đăng nhập
      }
    },
  },
  // Route cho đăng nhập
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  

  // Thêm route cho admin
  {
    path: "/them-nha-xuat-ban",
    name: "ThemNhaXuatBan",
    component: ThemNhaXuatBan,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/danh-sach-nha-xuat-ban",
    name: "DanhSachNhaXuatBan",
    component: DanhSachNhaXuatBan,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/danh-sach-sach",
    name: "DanhSachSach",
    component: DanhSachSach,
     meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/them-sach",
    name: "ThemSach",
    component: ThemSach,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path:"/duyet-don-hang",
    name:"DanhSachDonHang",
    component:DanhSachDonHang,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/quan-ly-hoa-don",
    name: "QuanLyHoaDon",
    component: QuanLyHoaDon,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
      path: "/theo-doi-muon-sach",
      name: "TheoDoiMuonSach",
      component: TheoDoiMuonSach,
      meta: { requiresAuth: true, role: "admin" },
    },




  // Thêm route cho khách hàng
  {
    path: "/san-pham",
    name: "DanhSachSanPham",
    component: DanhSachSanPham,
    
  },
  {
    path: "/san-pham/:id",
    name: "ChiTietSanPham",
    component: ChiTietSanPham,
    props: true,
    
  },
  

 // Route yêu cầu đăng nhập cho khách hàng
  {
    path: "/gio-hang",
    name: "GioHang",
    component: GioHang,
    meta: { requiresAuth: true, role: "customer" },
  },
  {
    path: "/don-hang",
    name: "DonHang",
    component: DonHang,
    meta: { requiresAuth: true, role: "customer" },
  },
  {
    path: "/sach-da-muon",
    name: "SachDaMuon",
    component: SachDaMuon,
    meta: { requiresAuth: true, role: "customer" },
  },
  {
    path: "/sua-thong-tin",
    name: "SuaThongTin",
    component: ChinhSuaThongTinKhachHang,
    meta: { requiresAuth: true, role: "customer" }
  },
  {
    path: "/hoa-don",
    name: "HoaDon",
    component: HoaDon,
    meta: { requiresAuth: true, role: "customer" },
  },


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// Thêm Navigation Guard
router.beforeEach((to, from, next) => {
  const role = AuthService.getRole();
  const isAuthenticated = !!role; // Kiểm tra xem có vai trò (tức là đã đăng nhập) hay không
  if (to.path === "/gio-hang" || to.path === "/don-hang" || to.path === "/sach-da-muon") {
    // Nếu người dùng truy cập vào giỏ hàng, đơn hàng, sách đã mượn mà chưa đăng nhập, thì chuyển hướng tới trang đăng nhập
    if (!isAuthenticated) {
      return next({ name: "Login" });
    }
  }
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({ name: "Login" });
    } else if (to.meta.role && to.meta.role !== role) {
      // Kiểm tra vai trò người dùng có phù hợp với route hay không
      next({
        name: role === "admin" ? "DanhSachNhaXuatBan" : "DanhSachSanPham",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
