<template>
    <div class="container mt-4">
        <h2 class="text-center text-danger">Danh sách sản phẩm</h2>
        <div class="row">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '../../components/user/ProductCard.vue'

const products = ref([])

onMounted(async () => {
    const res = await axios.get('http://localhost:3000/products') // Lấy dữ liệu từ JSON Server
    products.value = res.data
})
</script>
