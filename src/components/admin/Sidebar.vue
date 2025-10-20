<template>
    <aside class="bg-dark text-white p-3 vh-100 d-flex flex-column" style="width: 220px;">
        <!-- Tiêu đề -->
        <h4 class="text-center mb-4 border-bottom pb-2">
            <i class="bi bi-gear"></i> Admin
        </h4>

        <!-- Menu -->
        <nav class="nav flex-column">
            <router-link to="/admin" class="nav-link text-white mb-2" active-class="active-link">
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
            </router-link>
            <router-link to="/admin/products" class="nav-link text-white mb-2" active-class="active-link">
                <i class="bi bi-box-seam me-2"></i> Quản lý sản phẩm
            </router-link>
            <router-link to="/user" class="nav-link text-white mb-2" active-class="active-link">
                <i class="bi bi-box-seam me-2"></i> Quản lý người dùng
            </router-link>
        </nav>

        <!-- Nút đăng xuất -->
        <button @click="logout" class="btn btn-outline-light mt-auto w-100">
            <i class="bi bi-box-arrow-right"></i> Đăng xuất
        </button>
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
}
</script>

<style scoped>
.active-link {
    background-color: rgba(88, 167, 227, 0.2);
    border-radius: 8px;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}
</style>
