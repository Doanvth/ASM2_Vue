<template>
    <div>
        <h2 class="text-center text-primary mb-4">Quản lý sản phẩm</h2>

        <div v-if="alertMessage" class="alert alert-dismissible fade show text-center" :class="alertType" role="alert">
            {{ alertMessage }}
            <button type="button" class="btn-close" @click="alertMessage = ''" aria-label="Close"></button>
        </div>

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
                <tr v-for="p in paginatedProducts" :key="p.id">
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
                        <button class="btn btn-danger btn-sm" @click="openDeleteModal(p)" data-bs-toggle="modal"
                            data-bs-target="#confirmDeleteModal">
                            Xóa
                        </button>
                    </td>
                </tr>

                <!-- Khi không có kết quả -->
                <tr v-if="paginatedProducts.length === 0">
                    <td colspan="5" class="text-muted text-center">
                        Không tìm thấy sản phẩm nào phù hợp
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="prevPage">Trước</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                    <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage">Sau</button>
                </li>
            </ul>
        </nav>

        <!-- Modal xác nhận xóa -->
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="confirmDeleteLabel">
                            Xác nhận xóa sản phẩm
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>
                            Bạn có chắc muốn xóa sản phẩm:
                            <strong class="text-danger">{{ selectedProduct?.name }}</strong> không?
                        </p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete" data-bs-dismiss="modal">
                            Xác nhận xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import axios from "axios";

const products = ref([]);
const currentPage = ref(1);
const perPage = 5;

// Modal quản lý
const selectedProduct = ref(null);

// Alert Bootstrap
const alertMessage = ref("");
const alertType = ref("alert-success");

const showAlert = (message, type = "alert-success") => {
    alertMessage.value = message;
    alertType.value = type;
    setTimeout(() => (alertMessage.value = ""), 3000);
};

// Lấy danh sách sản phẩm
const fetchProducts = async () => {
    try {
        const res = await axios.get("http://localhost:3000/products");
        products.value = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        currentPage.value = 1;
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        showAlert("Không thể tải danh sách sản phẩm!", "alert-danger");
    }
};

// Mở modal xác nhận
const openDeleteModal = (product) => {
    selectedProduct.value = product;
};

// Xác nhận xóa
const confirmDelete = async () => {
    if (!selectedProduct.value) return;

    try {
        await axios.delete(`http://localhost:3000/products/${selectedProduct.value.id}`);
        showAlert("Đã xóa sản phẩm thành công!", "alert-success");
        fetchProducts();
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        showAlert("Xóa sản phẩm thất bại!", "alert-danger");
    } finally {
        selectedProduct.value = null;
    }
};

// Tìm kiếm
const searchQuery = ref("");
const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return products.value;
    return products.value.filter((p) =>
        p.name.toLowerCase().includes(query)
    );
});

const resetSearch = () => {
    searchQuery.value = "";
    currentPage.value = 1;
};

// Phân trang
const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage)
);

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredProducts.value.slice(start, start + perPage);
});

const goToPage = (page) => {
    currentPage.value = page;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(fetchProducts);
onActivated(fetchProducts);
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
}

.modal-content {
    border-radius: 1rem;
}
</style>
