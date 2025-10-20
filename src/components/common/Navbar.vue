<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <!-- BÊN TRÁI: Tên website -->
            <router-link to="/" class="navbar-brand fw-bold text-white">
                MyShop
            </router-link>

            <!-- BÊN PHẢI: Cài đặt + Email -->
            <div class="d-flex align-items-center gap-3">
                <!-- Hiển thị email user nếu có -->
                <span class="text-white">
                    {{ user?.email || "Chưa đăng nhập" }}
                </span>

                <!-- Dropdown nút ⚙️ -->
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        ⚙️
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li v-if="!user">
                            <router-link class="dropdown-item" to="/login">Đăng nhập</router-link>
                        </li>
                        <li v-else>
                            <router-link class="dropdown-item" to="/admin">Trang quản trị</router-link>
                            <button class="dropdown-item text-danger" @click="logout">Đăng xuất</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

// Lấy thông tin user từ localStorage khi tải trang
onMounted(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        user.value = JSON.parse(savedUser);
    }
});

// Hàm đăng xuất
const logout = () => {
    localStorage.removeItem("user");
    user.value = null;
    window.location.href = "/";
};
</script>

<style scoped>
.navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
