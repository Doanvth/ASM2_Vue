<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow-sm p-4">
            <h3 class="text-center text-primary mb-3">Đăng nhập hệ thống</h3>

            <!-- Thông báo Bootstrap -->
            <div v-if="message.text" :class="`alert alert-${message.type}`" role="alert">
                {{ message.text }}
            </div>

            <form @submit.prevent="login">
                <div class="mb-3">
                    <label class="form-label">Tên đăng nhập</label>
                    <input type="text" class="form-control" v-model="username" placeholder="Nhập tên đăng nhập..."
                        required />
                </div>

                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control" v-model="password" placeholder="Nhập mật khẩu..."
                        required />
                </div>

                <button class="btn btn-primary w-100">Đăng nhập</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const username = ref("");
const password = ref("");

// Biến chứa thông báo
const message = ref({ text: "", type: "" });

const showMessage = (text, type = "info", duration = 3000) => {
    message.value = { text, type };
    setTimeout(() => {
        message.value.text = "";
    }, duration);
};

const login = async () => {
    try {
        const res = await axios.get("http://localhost:3000/users", {
            params: {
                username: username.value,
                password: password.value,
            },
        });

        if (res.data.length > 0) {
            const user = res.data[0];
            localStorage.setItem("user", JSON.stringify(user));

            showMessage("Đăng nhập thành công!", "success");

            // Chờ 1.5 giây trước khi chuyển trang
            setTimeout(() => {
                const redirect = localStorage.getItem("redirectAfterLogin");
                if (redirect) {
                    localStorage.removeItem("redirectAfterLogin");
                    router.push(redirect);
                } else {
                    router.push(user.role === "admin" ? "/admin" : "/");
                }
            }, 1500);
        } else {
            showMessage("Sai tên đăng nhập hoặc mật khẩu!", "danger");
        }
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        showMessage("Không thể kết nối đến server!", "warning");
    }
};
</script>
