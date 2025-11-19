<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref(null);
let scene, camera, renderer;
let planeMesh, gridTop;
let animationId;

const initThree = () => {
  const container = containerRef.value;
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. 场景
  scene = new THREE.Scene();
  // 雾效：营造深邃感，颜色根据 CSS 变量动态调整不太容易，这里用通用的深紫色/蓝色
  // 在深色模式下会很酷，浅色模式下可以是淡紫
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  // 2. 相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 50, 200); // 放在高处
  camera.lookAt(0, 0, 0);

  // 3. 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 4. 移动的地面网格 (Synthwave 风格)
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 40, 40);

  // 材质：线框模式
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xbd00ff, // 霓虹紫
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.x = -Math.PI / 2; // 水平放置
  scene.add(planeMesh);

  // 5. 顶部流光 (模拟数据传输)
  const particlesGeo = new THREE.BufferGeometry();
  const count = 50;
  const posArray = new Float32Array(count * 3);
  for(let i=0; i<count; i++) {
    posArray[i*3] = (Math.random() - 0.5) * 1000; // x
    posArray[i*3+1] = Math.random() * 200 + 50;   // y (天空)
    posArray[i*3+2] = (Math.random() - 0.5) * 1000; // z
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMat = new THREE.PointsMaterial({
    size: 3,
    color: 0x00ffff, // 霓虹蓝
    transparent: true,
    opacity: 0.8
  });
  gridTop = new THREE.Points(particlesGeo, particlesMat);
  scene.add(gridTop);

  window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
  if (!containerRef.value || !camera || !renderer) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const animate = () => {
  // 地面移动效果
  if (planeMesh) {
    // 只需要移动贴图或者改变位置，这里简单地移动 Z 轴然后重置
    planeMesh.position.z += 1;
    if (planeMesh.position.z > 50) {
      planeMesh.position.z = 0;
    }
  }

  // 顶部粒子飞过
  if (gridTop) {
    gridTop.position.z += 2;
    if (gridTop.position.z > 200) {
      gridTop.position.z = -500;
    }
  }

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    initThree();
    animate();
  }, 50);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    if (containerRef.value) containerRef.value.removeChild(renderer.domElement);
  }
});
</script>

<template>
  <div ref="containerRef" class="grid-bg"></div>
</template>

<style scoped>
.grid-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  /* 动态背景渐变：适应明暗模式 */
  background: var(--friend-bg-gradient);
  transition: background 0.5s;
}
</style>