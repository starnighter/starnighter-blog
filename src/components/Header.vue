<script>
import ThemeToggle from "./ThemeToggle.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {ThemeToggle}
})

</script>

<template>
  <header class="site-header">
    <nav class="navbar">
      <div class="nav-left">
        <p>Starnighter's Blog</p>
      </div>
      <div class="nav-center">
        <a href="/" class="nav-link">首页</a>
        <a href="/articles" class="nav-link">文章</a>
        <a href="/essays" class="nav-link">随笔</a>
        <a href="/reading" class="nav-link">阅读</a>
        <a href="/friend" class="nav-link">朋友</a>
        <a href="/about" class="nav-link">关于</a>
      </div>
      <div class="nav-right">
        <a href="https://github.com/starnighter" target="_blank" rel="noopener noreferrer" class="github-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6.1 0-1.3-.5-2.4-1.3-3.2.1-.3.5-1.5-.1-3.2 0 0-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.1 2.8 5 3.1 5 3.1c-.6 1.7-.2 2.9-.1 3.2-.8.8-1.3 1.9-1.3 3.2 0 4.7 2.7 5.8 5.5 6.1-.6.5-.9 1.4-.9 2.8v3.5"></path>
          </svg>
        </a>
        <img
          src="/avatars/avatar1.jpg"
          alt="用户头像"
          class="avatar"
          onerror="this.src='https://placehold.co/40x40/eee/aaa?text=Avatar'"
        />

        <ThemeToggle client:load/>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  width: 100%;

  /* (毛玻璃效果) */
  background-color: rgba(var(--color-bg-rgb), 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* --- MODIFIED: 移除了分割线 --- */
  /* border-bottom: 1px solid var(--color-border); */

  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.2s, border-color 0.2s;
}

.navbar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: auto;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: wrap;
}

.nav-center {
  flex: 2;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.github-link {
  color: var(--color-text-secondary);
  line-height: 0;
  transition: color 0.2s;
}

.github-link:hover {
  color: var(--color-text-primary);
}

/* ... (省略媒体查询，无需更改) ... */
@media (max-width: 900px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .nav-center {
    gap: 1rem;
    flex: 3;
  }

  .nav-right {
    gap: 0.5rem;
    flex: 1;
  }
}

@media (max-width: 640px) {
  .nav-center {
    gap: 0.5rem;
    justify-content: flex-start;
    flex: 2;
    overflow-x: auto;
  }

  .nav-left {
    flex: 0;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem 0.25rem;
  }
}
</style>