<template>
    <div>
        <Navbar></Navbar>
        <main style="padding:20px;">
            <router-view />
        </main>
        <Footer></Footer>
    </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
</script>
