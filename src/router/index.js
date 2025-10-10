import { createRouter, createWebHistory } from "vue-router";

// Layouts
import UserLayout from "@/layouts/UserLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// User Views
import Home from "@/views/user/Home.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";

// Admin Views
import Dashboard from "@/views/admin/Dashboard.vue";
import ProductManager from "@/views/admin/ProductManager.vue";

const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", component: Home },
      { path: "product/:id", component: ProductDetail },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "", component: Dashboard },
      { path: "products", component: ProductManager },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth && !user) {
    alert("Vui lòng đăng nhập!");
    return next("/");
  }

  if (to.meta.requiresAdmin && user?.role !== "admin") {
    alert("Bạn không có quyền truy cập!");
    return next("/");
  }

  next();
});

export default router;
