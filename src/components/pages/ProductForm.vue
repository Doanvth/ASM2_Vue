<template>
    <div class="card p-4 shadow-sm">
        <h4 class="text-success mb-3">
            {{ isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới" }}
        </h4>

        <form @submit.prevent="saveProduct">
            <!-- Tên sản phẩm -->
            <div class="mb-3">
                <label class="form-label">Tên sản phẩm</label>
                <input v-model.trim="product.name" class="form-control" />
                <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
            </div>

            <!-- Giá -->
            <div class="mb-3">
                <label class="form-label">Giá</label>
                <input v-model.number="product.price" type="number" class="form-control" />
                <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
            </div>

            <!-- Upload hình -->
            <div class="mb-3">
                <label class="form-label">Hình ảnh</label>
                <input type="file" class="form-control" @change="uploadImage" accept="image/*" />
                <small v-if="errors.image" class="text-danger">{{ errors.image }}</small>
            </div>

            <!-- Hiển thị hình đã upload -->
            <div v-if="product.image" class="mb-3 text-center">
                <img :src="product.image" alt="preview" class="img-thumbnail"
                    style="width:150px; height:150px; object-fit:cover;" />
            </div>

            <button type="submit" class="btn btn-success me-2">
                {{ isEdit ? "Cập nhật" : "Thêm" }}
            </button>
            <router-link to="/admin/products" class="btn btn-secondary">Quay lại</router-link>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
    isEdit: Boolean,
    id: String,
});

// const name = ref("")
const product = ref({ name: "", price: 0, image: "" });

onMounted(async () => {
    if (props.isEdit && props.id) {
        const res = await axios.get(`http://localhost:3000/products/${props.id}`);
        product.value = res.data;
    }
});

const loading = ref(false);

// Upload ảnh lên Cloudinary
const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loading.value = true;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo_vue3"); // preset của bạn
    formData.append("cloud_name", "dqqtiwfnw"); // cloud_name của bạn

    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dqqtiwfnw/image/upload",
            formData
        );
        product.value.image = res.data.secure_url;
        // image.value= res.data.secure_url;
        errors.value.image = ""; // xóa lỗi nếu có
    } catch (err) {
        errors.value.image = "Lỗi upload ảnh!";
    } finally {
        loading.value = false;
    }
};

// Lưu sản phẩm
const saveProduct = async () => {
    if (!validateForm()) return; // dừng lại nếu có lỗi

    try {
        if (props.isEdit) {
            // const newProduct = {name: name.value}
            await axios.put(`http://localhost:3000/products/${props.id}`, product.value);
            alert("Cập nhật thành công!");
        } else {
            await axios.post("http://localhost:3000/products", product.value);
            alert("Thêm sản phẩm thành công!");
        }
        router.push("/admin/products");
    } catch (error) {
        alert("Có lỗi khi lưu sản phẩm!");
        console.error(error);
    }
};

// const addProduct = async()=>{
//       await axios.post("http://localhost:3000/products", product.value);
//             alert("Thêm sản phẩm thành công!");
// }

// const editProduct = async()=>{
//       if (props.isEdit) {
//             await axios.put(`http://localhost:3000/products/${props.id}`, product.value);
//             alert("Cập nhật thành công!");
//       }
// }

const errors = ref({ name: "", price: "", image: "" });
//chứa thông báo lỗi
// Hàm kiểm tra lỗi
const validateForm = () => {
    let valid = true;
    errors.value = { name: "", price: "", image: "" };

    if (!product.value.name.trim()) {
        errors.value.name = "Vui lòng nhập tên sản phẩm!";
        valid = false;
    }
    if (!product.value.price || product.value.price <= 0) {
        errors.value.price = "Giá phải lớn hơn 0!";
        valid = false;
    }
    if (!product.value.image) {
        errors.value.image = "Vui lòng chọn hình ảnh!";
        valid = false;
    }

    return valid;
};
</script>
