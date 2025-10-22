<template>
    <div class="card p-4 shadow-sm">
        <h4 class="text-success mb-3">
            {{ isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới" }}
        </h4>

        <!-- Alert thông báo -->
        <div v-if="alertMessage" class="alert alert-dismissible fade show" :class="alertType" role="alert">
            {{ alertMessage }}
            <button type="button" class="btn-close" @click="alertMessage = ''" aria-label="Close"></button>
        </div>

        <!-- Form Vee-Validate -->
        <Form :validation-schema="schema" :initial-values="initialValues" @submit="handleSubmitForm">
            <!-- Tên -->
            <div class="mb-3">
                <label class="form-label">Tên sản phẩm</label>
                <Field name="name" type="text" class="form-control" v-model="product.name" />
                <ErrorMessage name="name" class="text-danger" />
            </div>

            <!-- Giá -->
            <div class="mb-3">
                <label class="form-label">Giá</label>
                <Field name="price" type="number" class="form-control" v-model="product.price" />
                <ErrorMessage name="price" class="text-danger" />
            </div>

            <!-- Ảnh -->
            <div class="mb-3">
                <label class="form-label">Hình ảnh</label>
                <input type="file" class="form-control" @change="uploadImage" accept="image/*" />
                <small v-if="errors.image" class="text-danger">{{ errors.image }}</small>
            </div>

            <!-- Xem trước ảnh -->
            <div v-if="product.image" class="mb-3 text-center">
                <img :src="product.image" alt="preview" class="img-thumbnail"
                    style="width:150px; height:150px; object-fit:cover;" />
            </div>

            <button type="submit" class="btn btn-success me-2">
                {{ isEdit ? "Cập nhật" : "Thêm" }}
            </button>
            <router-link to="/admin/products" class="btn btn-secondary">Quay lại</router-link>
        </Form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const router = useRouter();

const props = defineProps({
    isEdit: Boolean,
    id: String,
});

const product = ref({ name: "", price: 0, image: "", imagePublicId: "", createdAt: new Date().toISOString() });
const errors = ref({ image: "" });
const loading = ref(false);

// Alert
const alertMessage = ref("");
const alertType = ref("alert-success");

// Schema VeeValidate
const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên sản phẩm"),
    price: yup.number().typeError("Giá phải là số").positive("Giá phải lớn hơn 0").required("Vui lòng nhập giá"),
});

const initialValues = ref({
    name: "",
    price: 0,
});

// Lấy sản phẩm cũ khi edit
onMounted(async () => {
    if (props.isEdit && props.id) {
        try {
            const res = await axios.get(`http://localhost:3000/products/${props.id}`);
            product.value = res.data;
            initialValues.value = {
                name: res.data.name,
                price: res.data.price,
            };
        } catch (err) {
            showAlert("Không tải được sản phẩm!", "alert-danger");
        }
    }
});


// Hàm uploadImage cũ
// const uploadImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     loading.value = true;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "demo_vue3");
//     formData.append("cloud_name", "dqqtiwfnw");

//     try {
//         const res = await axios.post(
//             "https://api.cloudinary.com/v1_1/dqqtiwfnw/image/upload",
//             formData
//         );
//         product.value.image = res.data.secure_url;
//         errors.value.image = "";
//     } catch (err) {
//         errors.value.image = "Lỗi upload ảnh!";
//     } finally {
//         loading.value = false;
//     }
// };

//Upload ảnh Cloudinary tối ưu (xóa cũ trước khi up mới)
const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loading.value = true;
    errors.value.image = "";

    // Nếu có ảnh cũ -> xóa ảnh trên Cloudinary (dựa vào public_id)
    if (product.value.imagePublicId) {
        try {
            await axios.post(`https://api.cloudinary.com/v1_1/dqqtiwfnw/delete_by_token`, {
                token: product.value.deleteToken,
            });
        } catch {
            console.warn("Không thể xóa ảnh cũ, có thể token đã hết hạn.");
        }
    }

    // Tạo FormData upload mới
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo_vue3");
    formData.append("cloud_name", "dqqtiwfnw");

    try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/dqqtiwfnw/image/upload`, formData);

        // Lưu lại URL + public_id + delete_token
        product.value.image = res.data.secure_url;
        product.value.imagePublicId = res.data.public_id;
        product.value.deleteToken = res.data.delete_token;
        errors.value.image = "";
    } catch (err) {
        console.error(err);
        errors.value.image = "Lỗi upload ảnh!";
    } finally {
        loading.value = false;
    }
};

// Submit form
const handleSubmitForm = async (values) => {
    if (!product.value.image) {
        errors.value.image = "Vui lòng chọn hình ảnh!";
        return;
    }

    const data = {
        name: values.name,
        price: values.price,
        image: product.value.image,
        imagePublicId: product.value.imagePublicId,
        deleteToken: product.value.deleteToken,
        createdAt: props.isEdit ? product.value.createdAt : new Date().toISOString(),
    };

    try {
        if (props.isEdit) {
            await axios.put(`http://localhost:3000/products/${props.id}`, data);
            showAlert("Cập nhật sản phẩm thành công!", "alert-success");
            setTimeout(() => router.push("/admin/products"), 1000);
        } else {
            await axios.post("http://localhost:3000/products", data);
            showAlert("Thêm sản phẩm thành công!", "alert-success");
            setTimeout(() => router.push("/admin/products"), 1000);
        }
    } catch (err) {
        console.error(err);
        showAlert("Có lỗi khi lưu sản phẩm!", "alert-danger");
    }
};

// Alert
const showAlert = (message, type = "alert-success") => {
    alertMessage.value = message;
    alertType.value = type;
    setTimeout(() => (alertMessage.value = ""), 3000);
};
</script>

<style scoped>
.img-thumbnail {
    max-width: 150px;
    max-height: 150px;
}
</style>
