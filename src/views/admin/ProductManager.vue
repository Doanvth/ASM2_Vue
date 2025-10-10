<template>
    <div>
        <h2 class="text-center text-primary">Quản lý sản phẩm</h2>

        <form @submit.prevent="addProduct" class="mb-3">
            <div class="row">
                <div class="col-lg-4">
                    <input v-model="newProduct.name" placeholder="Tên sản phẩm" class="form-control" />
                </div>
                <div class="col-lg-4">
                    <input v-model.number="newProduct.price" placeholder="Giá" type="number" class="form-control" />
                </div>
                <div class="col-lg-4">
                    <input v-model="newProduct.image" placeholder="Link hình ảnh" class="form-control" />
                </div>
            </div>

            <button type="submit" class="btn btn-success mt-3">Thêm</button>
        </form>

        <table class="table table-striped table-hover align-middle text-center">
            <thead class="table-primary">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Tên</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in products" :key="p.id">
                    <td>{{ p.id }}</td>
                    <td>{{ p.name }}</td>
                    <td>{{ p.price.toLocaleString() }} ₫</td>
                    <td>
                        <img :src="p.image" alt="Sản phẩm" class="img-thumbnail"
                            style="width:80px; height:80px; object-fit:cover;">
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" @click="deleteProduct(p.id)">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const newProduct = ref({ name: '', price: 0, image: '' })

const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data
}

const addProduct = async () => {
    await axios.post('http://localhost:3000/products', newProduct.value)
    newProduct.value = { name: '', price: 0, image: '' }
    fetchProducts()
}

const deleteProduct = async (id) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        alert("Xóa sản phẩm thành công!");
        fetchProducts();
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Đã xảy ra lỗi khi xóa sản phẩm!");
    }
};

onMounted(fetchProducts)
</script>
