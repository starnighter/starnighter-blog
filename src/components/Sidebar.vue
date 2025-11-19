<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <button @click="toggleSidebar" class="toggle-btn" :title="isCollapsed ? '展开导览' : '折叠导览'">
      <span class="icon" :class="{ 'is-collapsed-icon': isCollapsed }">
        &lt;
      </span>
    </button>

    <div class="sidebar-content">
      <!-- 插槽内容 (文章导览等) -->
      <slot></slot>
    </div>
  </aside>
</template>

<script setup>
  import {ref} from 'vue';

  const isCollapsed = ref(false);
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  display: flex;
  flex-direction: column;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
  background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
  border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  /* --- MODIFIED: 移除了 width: 10px; --- */
  background-color: transparent;
  border-color: transparent;
}

.toggle-btn {
  position: absolute;
  top: 1.5rem;
  right: -12px;
  left: auto;
  z-index: 10;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  color: var(--color-text-secondary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s ease-in-out, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s cubic-bezier(0.4, 0, 0.2, 1), right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
}

.sidebar.collapsed .toggle-btn {
  right: auto;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0; /* 默认隐藏 */
}

/* 当悬停在“空白区域” (即 .sidebar.collapsed) 时显示按钮 */
.sidebar.collapsed:hover .toggle-btn {
  opacity: 1;
}

.icon {
  display: inline-block;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(0deg);
}

.icon.is-collapsed-icon {
  transform: rotate(180deg);
}


.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.2s ease-out,
  transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed .sidebar-content {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
  position: absolute;
}

/* ... :deep() 样式 (不变) ... */
.sidebar-content :deep(h3) {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.sidebar-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-content :deep(li a) {
  display: block;
  padding: 0.5rem 0;
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 0.95rem;
  white-space: nowrap;
}

.sidebar-content :deep(li a:hover) {
  color: var(--color-accent);
}
</style>