<template>
    <div class="container mt-5" v-if="product">
        <div class="row">
            <div class="col-md-5">
                <img :src="product.image" class="img-fluid rounded shadow-sm" alt="Sản phẩm" />
            </div>
            <div class="col-md-7">
                <h3 class="text-primary">{{ product.name }}</h3>
                <h4 class="text-danger mt-2">{{ product.price.toLocaleString() }} đ</h4>
                <p class="mt-3">{{ product.description }}</p>

                <router-link to="/" class="btn btn-outline-secondary mt-3">
                    ← Quay lại danh sách
                </router-link>
            </div>
        </div>
    </div>

    <div v-else class="text-center mt-5 text-muted">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Đang tải sản phẩm...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const product = ref(null);

onMounted(async () => {
    try {
        const id = route.params.id;
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        product.value = res.data;
    } catch (error) {
        console.error("Không tìm thấy sản phẩm", error);
    }
});
</script>
