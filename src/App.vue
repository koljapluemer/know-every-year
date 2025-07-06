<template>
  <div class="min-h-screen flex flex-col">
    <header class="navbar bg-base-100 shadow-sm mb-4">
      <div class="navbar-start flex flex-col gap-1 items-start">
        <router-link :to="{ name: 'Home' }" class="text-xl link link-hover font-bold lg:text-2xl">Know Every
          Year</router-link>
        <small class="text-sm">by <a href="https://koljapluemer.com/" class="link">Kolja Sam</a></small>
      </div>

      <NavList :nav-items="navItems" />
    </header>
    
    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <aside>
        <ul class="flex flex-col gap-2">
          <li>
            Made with ❤️ by <a href="https://koljapluemer.com/" class="link">Kolja Sam</a>.
          </li>
          <li>
            Nothing tracked except page views (with the privacy-friendly <a href="https://goatcounter.com/"
              class="link">GoatCounter</a>).

          </li>
          <li>
            This app is <a href="https://github.com/koljapluemer/know-every-year" class="link">open source</a>.
          </li>
          <li class="flex justify-center">
            <a href='https://ko-fi.com/S6S81CWUVD' target='_blank'><img height='36' style='border:0px;height:36px;'
              src='https://storage.ko-fi.com/cdn/kofi4.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
          </li>
        </ul>
      </aside>
    </footer>
  </div>

  <ToastManager />
</template>

<script setup lang="ts">
import ToastManager from './ui/ToastManager.vue'
import NavList from '@/components/widgets/NavList.vue'

const navItems = [
  { name: 'Practice', label: 'Practice', isPrimary: true },
  { name: 'ManageDigitPegs', label: 'Digit Pegs' },
  { name: 'ListPegs', label: 'Number Pegs' },
  { name: 'YearAssociations', label: 'Years & Events' }
]
</script>

<style>
@import "tailwindcss";
@plugin "daisyui";

@layer components {
  .big-digit {
    @apply text-9xl text-primary font-bold;
  }

  .letter-wrap {
    @apply border-1 border-gray-300 rounded-md p-6;
  }

  .big-word {
    @apply text-7xl text-primary font-bold;
  }
}
</style>
