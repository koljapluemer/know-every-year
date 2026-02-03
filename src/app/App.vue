<script setup lang="ts">
import { Database, Play } from 'lucide-vue-next';
import { RouterView } from 'vue-router';

</script>

<template>
    <header class="flex flex-row justify-center items-center p-4">
        <nav class="flex flex-row gap-2 justify-center">
            <router-link class="btn" :class="{ 'marked': $route.name === 'Practice' }" :to="{ name: 'Practice' }">
                <Play :size="12" />
            </router-link>
            <router-link class="btn" :class="{ 'marked': $route.name === 'Data' }" :to="{ name: 'Data' }">
                <Database :size="12" />
            </router-link>
        </nav>
    </header>
    <main class="max-w-2xl mx-auto grid grid-columns-12 gap-4">
        <RouterView></RouterView>
    </main>

</template>

<style>
@import 'tailwindcss';

@layer base {
    html {
        @apply text-gray-900;
    }

    h2 {
        @apply text-2xl font-semibold tracking-tight;
    }

    h3 {
        @apply text-xl font-semibold tracking-tight;
    }

    .tiny-label {
        @apply text-sm text-gray-500 uppercase font-bold tracking-widest;
    }

    .btn {
        @apply border-1 border-gray-900 p-2 text-sm flex gap-2 items-center;

    }

    .btn:hover {
        @apply bg-gray-900 text-white;

    }

    .marked {
        @apply border-b-3 border-gray-900;
    }


    label {
        @apply flex flex-col;
    }

    label span {
        @apply text-sm text-gray-500 uppercase font-bold tracking-widest;
    }

    input {
        @apply border-gray-900 border-b-1 p-2 bg-gray-100;
    }

}
</style>