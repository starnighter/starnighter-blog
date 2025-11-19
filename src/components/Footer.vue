<script setup>
import {ref} from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="site-footer">
    <p>© {{ currentYear }} starnighter. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.site-footer {
  text-align: center;
  padding: 2rem 1.5rem;

  background-color: rgba(var(--color-bg-rgb), 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-top: auto;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.site-footer p {
  margin: 0.25rem 0;
}
</style>