<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow-sm p-4">
            <h3 class="text-center text-primary mb-3">Đăng nhập hệ thống</h3>

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

const login = async () => {
    try {
        // Gọi dữ liệu user từ fb.json (qua json-server)
        const res = await axios.get("http://localhost:3000/users", {
            params: {
                username: username.value,
                password: password.value
            }
        });

        // Nếu có user hợp lệ
        if (res.data.length > 0) {
            const user = res.data[0];
            localStorage.setItem("user", JSON.stringify(user));
            alert("Đăng nhập thành công!");

            // Kiểm tra nếu có trang redirect sau khi login
            const redirect = localStorage.getItem("redirectAfterLogin");
            if (redirect) {
                localStorage.removeItem("redirectAfterLogin");
                router.push(redirect);
            } else {
                router.push(user.role === "admin" ? "/admin" : "/");
            }
        } else {
            alert("Sai tên đăng nhập hoặc mật khẩu!");
        }
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        alert("Không thể kết nối đến server!");
    }
};
</script>
