<template>
    <div class="col-md-4 mb-3">
        <div class="card">
            <img :src="product.image" class="card-img-top" alt="">
            <div class="card-body">
                <h5>{{ product.name }}</h5>
                <p>{{ product.price }} đ</p>
                <router-link :to="`/product/${product.id}`" class="btn btn-primary">Xem chi tiết</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    product: Object
})
</script>
