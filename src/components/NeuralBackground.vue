<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref(null);
let scene, camera, renderer;
let particlesData = [];
let particlePositions;
let linesMesh;
let pointCloud;

const particleCount = 120; // 粒子数量
const r = 1000; // 活动半径
const rHalf = r / 2;
const maxDistance = 150; // 连线距离最大值

const initThree = () => {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf0f8ff, 0.0003);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
  camera.position.z = 1500;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 创建粒子
  particlePositions = new Float32Array(particleCount * 3);

  const pMaterial = new THREE.PointsMaterial({
    color: 0x007acc,
    size: 3,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false
  });

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * r - rHalf;
    const y = Math.random() * r - rHalf;
    const z = Math.random() * r - rHalf;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particlesData.push({
      velocity: new THREE.Vector3(
        -0.5 + Math.random(),
        -0.5 + Math.random(),
        -0.5 + Math.random()
      ),
      numConnections: 0
    });
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setDrawRange(0, particleCount);
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

  pointCloud = new THREE.Points(particlesGeometry, pMaterial);
  scene.add(pointCloud);

  // 创建连线
  const linesGeometry = new THREE.BufferGeometry();
  // 连线顶点数组最大值 = 粒子数 * (粒子数 - 1) / 2 * 2 (每条线两个点) * 3 (XYZ)
  const maxLines = particleCount * (particleCount - 1) / 2;
  const linePositions = new Float32Array(maxLines * 2 * 3);

  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));

  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x007acc,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(linesMesh);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onDocumentMouseMove);
};

let mouseX = 0;
let mouseY = 0;
const targetX = ref(0);
const targetY = ref(0);

const onDocumentMouseMove = (event) => {
  mouseX = event.clientX - window.innerWidth / 2;
  mouseY = event.clientY - window.innerHeight / 2;

  gsap.to(targetX, { value: mouseX * 0.5, duration: 1, ease: "power2.out" });
  gsap.to(targetY, { value: mouseY * 0.5, duration: 1, ease: "power2.out" });
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
  let vertexpos = 0;
  let numConnected = 0;

  // 粒子受鼠标影响
  camera.position.x += (targetX.value - camera.position.x) * 0.05;
  camera.position.y += (-targetY.value - camera.position.y) * 0.05;
  camera.lookAt(scene.position);


  // 重置连接数
  for (let i = 0; i < particleCount; i++)
    particlesData[i].numConnections = 0;

  // 更新粒子位置
  for (let i = 0; i < particleCount; i++) {
    const particleData = particlesData[i];

    // 减慢粒子速度
    particlePositions[i * 3] += particleData.velocity.x * 0.3;
    particlePositions[i * 3 + 1] += particleData.velocity.y * 0.3;
    particlePositions[i * 3 + 2] += particleData.velocity.z * 0.3;

    // 边界反弹
    if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
      particleData.velocity.x = -particleData.velocity.x;

    if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
      particleData.velocity.y = -particleData.velocity.y;

    if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
      particleData.velocity.z = -particleData.velocity.z;

    // 检测连线
    for (let j = i + 1; j < particleCount; j++) {
      const particleDataB = particlesData[j];

      const dx = particlePositions[i * 3] - particlePositions[j * 3];
      const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < maxDistance) {
        particleData.numConnections++;
        particleDataB.numConnections++;

        // 更新线段顶点
        const linePos = linesMesh.geometry.attributes.position.array;

        linePos[vertexpos++] = particlePositions[i * 3];
        linePos[vertexpos++] = particlePositions[i * 3 + 1];
        linePos[vertexpos++] = particlePositions[i * 3 + 2];

        linePos[vertexpos++] = particlePositions[j * 3];
        linePos[vertexpos++] = particlePositions[j * 3 + 1];
        linePos[vertexpos++] = particlePositions[j * 3 + 2];

        numConnected++;
      }
    }
  }

  // 更新几何体
  linesMesh.geometry.setDrawRange(0, numConnected * 2);
  linesMesh.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    initThree();
    animate();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
  if (renderer) {
    renderer.dispose();
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement);
    }
  }
});
</script>

<template>
  <div ref="containerRef" class="neural-bg"></div>
</template>

<style scoped>
.neural-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-image: linear-gradient(to bottom, var(--essay-bg-grad-1), var(--essay-bg-grad-2));
  background-attachment: fixed;
  transition: background-image 0.5s ease;
}
</style>