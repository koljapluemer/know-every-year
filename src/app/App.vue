<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
    <RouterView></RouterView>

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

    button {
        @apply border-1 border-gray-900 p-2 text-sm;

    }

    button:hover  {
        @apply  bg-gray-900 text-white;

    }


    label {
        @apply flex flex-col;
    }

    label span {
        @apply text-sm text-gray-500 uppercase font-bold tracking-widest;
    }

    input {
        @apply border-gray-900 border-b-2 p-2;
    }

}
</style>