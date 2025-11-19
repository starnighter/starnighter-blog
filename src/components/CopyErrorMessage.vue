<script setup>
import {onMounted, onUnmounted} from 'vue';
import {ElMessage} from 'element-plus';

const showErrorMessage = (event) => {
  const message = event.detail?.message || '操作失败，请重试';
  ElMessage.error(message);
};

onMounted(() => {
  document.addEventListener('show:copy-error', showErrorMessage);
});

onUnmounted(() => {
  document.removeEventListener('show:copy-error', showErrorMessage);
});
</script>

<template>
</template>