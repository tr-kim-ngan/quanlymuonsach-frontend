import { createRouter, createWebHistory } from 'vue-router';
import ThemNhaXuatBan from '@/views/ThemNhaXuatBan.vue';
import DanhSachNhaXuatBan from '@/views/DanhSachNhaXuatBan.vue';
import DanhSachSach from '@/views/DanhSachSach.vue';
import ThemSach from '@/views/ThemSach.vue';

const routes = [
    {
    path: '/',
    redirect: '/danh-sach-nha-xuat-ban', // Đặt trang mặc định
  },
  {
    path: '/them-nha-xuat-ban',
    name: 'ThemNhaXuatBan',
    component: ThemNhaXuatBan,
  },
  {
    path: '/danh-sach-nha-xuat-ban',
    name: 'DanhSachNhaXuatBan',
    component: DanhSachNhaXuatBan,
  },
  {
    path: '/danh-sach-sach',
    name: 'DanhSachSach',
    component: DanhSachSach,
  },
  {
    path: '/them-sach',
    name: 'ThemSach',
    component: ThemSach,
  },
  // Các router khác có thể thêm vào đây
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
