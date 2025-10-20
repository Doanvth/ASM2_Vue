<template>
    <div>
        <h2 class="text-center text-primary mb-4">Quản lý sản phẩm</h2>

        <!-- Thanh tìm kiếm -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <input v-model="searchQuery" type="text" class="form-control w-50"
                placeholder="Nhập tên sản phẩm để tìm..." />
            <div>
                <button @click="resetSearch" class="btn btn-secondary me-2">Reset</button>
                <router-link to="/add-product" class="btn btn-success">Thêm sản phẩm</router-link>
            </div>
        </div>

        <!-- Bảng sản phẩm -->
        <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-primary">
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Hình ảnh</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in filteredProducts" :key="p.id">
                    <td>{{ p.id }}</td>
                    <td>{{ p.name }}</td>
                    <td>{{ p.price.toLocaleString() }} ₫</td>
                    <td>
                        <img :src="p.image" alt="Hình" class="img-thumbnail"
                            style="width:80px;height:80px;object-fit:cover;" />
                    </td>
                    <td>
                        <router-link :to="`/edit-product/${p.id}`" class="btn btn-warning btn-sm me-2">
                            Sửa
                        </router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteProduct(p.id)">Xóa</button>
                    </td>
                </tr>

                <!-- Khi không có kết quả -->
                <tr v-if="filteredProducts.length === 0">
                    <td colspan="5" class="text-muted text-center">
                        Không tìm thấy sản phẩm nào phù hợp
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const products = ref([]);

// Lấy danh sách sản phẩm từ json-server
const fetchProducts = async () => {
    try {
        const res = await axios.get("http://localhost:3000/products");
        products.value = res.data;
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
};

onMounted(fetchProducts);

// Xóa sản phẩm
const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
        await axios.delete(`http://localhost:3000/products/${id}`);
        fetchProducts();
    }
};

// @click(deleteProduct(id))

const searchQuery = ref("");
// tìm kiếm
const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return products.value;
    return products.value.filter((p) =>
        p.name.toLowerCase().includes(query)
    );
});

// Reset tìm kiếm
const resetSearch = () => {
    searchQuery.value = "";
};


</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}
</style>
