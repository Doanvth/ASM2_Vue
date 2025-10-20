import { createRouter, createWebHistory } from "vue-router";

// Layouts
import UserLayout from "@/layouts/UserLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// User Views
import HomeView from "@/views/user/HomeView.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";

// Admin Views
import Dashboard from "@/views/admin/Dashboard.vue";
import ProductManager from "@/views/admin/ProductManager.vue";
import ProductForm from "@/components/pages/ProductForm.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", component: HomeView },
      { path: "product/:id", component: ProductDetail },
      {
        path: "/login",
        name: "login",
        component: LoginView,
        props: { isEdit: false }, // chế độ thêm
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "", component: Dashboard },
      { path: "products", component: ProductManager },
      {
        path: "/add-product",
        name: "add-product",
        component: ProductForm,
        props: { isEdit: false }, // chế độ thêm
      },
      {
        path: "/edit-product/:id",
        name: "edit-product",
        component: ProductForm,
        props: (route) => ({
          isEdit: true,
          id: route.params.id,
        }), // truyền id vào component
      },
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

  if (to.path === "/login") {
    return next();
  }

  if (to.meta.requiresAuth && !user) {
    alert("Vui lòng đăng nhập để tiếp tục!");
    localStorage.setItem("redirectAfterLogin", to.fullPath);
    return next("/login");
  }

  if (to.meta.requiresAdmin && user?.role !== "admin") {
    alert("Bạn không có quyền truy cập trang này!");
    return next("/");
  }

  next();
});

export default router;
