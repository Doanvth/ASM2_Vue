<template>
    <header style="background:#34495e;color:white;padding:10px;">
        <h2>👋 Xin chào, {{ user?.username || 'Admin' }}</h2>
    </header>
</template>

<script setup>
const user = JSON.parse(localStorage.getItem('user')) || {}
</script>
