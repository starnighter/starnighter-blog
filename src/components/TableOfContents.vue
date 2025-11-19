<template>
  <aside :class="['toc-container', { collapsed: isCollapsed }]">
    <button @click="toggleToc" class="toggle-btn" :title="isCollapsed ? '展开目录' : '折叠目录'">
      <span class="icon" :class="{ 'is-collapsed-icon': isCollapsed }">
        &gt;
      </span>
    </button>
    <div class="toc-content">
      <h4>在本页</h4>
      <ul class="toc-list" ref="tocListRef">
        <li
          v-for="heading in headings"
          :key="heading.slug"
          :class="['toc-item', `depth-${heading.depth}`]"
        >
          <a :href="'#' + heading.slug">{{ heading.text }}</a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import {ref} from 'vue';

defineProps({
  headings: {type: Array, default: () => []}
});

const isCollapsed = ref(false);
const toggleToc = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.toc-container {
  width: 220px;
  flex-shrink: 0;
  padding: 1.5rem 0 1.5rem 1.5rem;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  font-size: 0.9rem;
  border-left: 1px solid var(--color-border);
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
  background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
  border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-container.collapsed {
  /* --- MODIFIED: 移除了 width: 10px; 和 padding: 0; --- */
  background-color: transparent;
  border-color: transparent;
}

.toggle-btn {
  position: absolute;
  top: 1.5rem;
  left: -12px;
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
  opacity: 1;
  transition: opacity 0.2s ease-in-out, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-container.collapsed .toggle-btn {
  left: 50%;
  transform: translateX(-50%);
  opacity: 0; /* 默认隐藏 */
}

/* 当悬停在“空白区域” (即 .toc-container.collapsed) 时显示按钮 */
.toc-container.collapsed:hover .toggle-btn {
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

.toc-content {
  flex: 1;
  overflow-y: auto;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.2s ease-out,
  transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-container.collapsed .toc-content {
  opacity: 0;
  transform: translateX(20px);
  pointer-events: none;
  position: absolute;
}

h4 {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item a {
  display: block;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.4rem 0;
  transition: color 0.2s, font-weight 0.2s;
  white-space: nowrap;
}

.toc-item a:hover {
  color: var(--color-accent);
}

.toc-item.depth-3 {
  padding-left: 1rem;
}

.toc-item.depth-4 {
  padding-left: 2rem;
}
</style>