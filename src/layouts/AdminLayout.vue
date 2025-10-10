<template>
    <div style="display:flex;">
        <Sidebar />
        <div style="flex:1;">
            <AdminHeader />
            <main style="padding:20px;">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>
