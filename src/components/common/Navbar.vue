<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <!-- Logo -->
            <router-link class="navbar-brand" to="/">My Shop</router-link>

            <!-- Nút toggle khi màn hình nhỏ -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Danh sách menu -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">🏠 Trang chủ</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/checkout">🛒 Giỏ hàng</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/admin">⚙️ Admin</router-link>
                    </li>
                </ul>

                <!-- Phần bên phải -->
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/login">🔐 Đăng nhập</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>
