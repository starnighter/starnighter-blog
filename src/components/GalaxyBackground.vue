<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as THREE from 'three';

const containerRef = ref(null);
let camera, scene, renderer;
let sun, sunGeometry;
let planets = [];
let animationFrameId;

const initThree = () => {
  const container = containerRef.value;
  if (!container) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffffff, 0.0015);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 120);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const systemGroup = new THREE.Group();

  const updateSystemPosition = () => {
    if (window.innerWidth > 900) {
      systemGroup.position.x = -35;
      systemGroup.position.y = 0;
    } else {
      systemGroup.position.x = 0;   // 手机端居中
      systemGroup.position.y = 20;  // 手机端向上移
    }
  };
  updateSystemPosition();
  scene.add(systemGroup);

  // 构建太阳
  const sunRadius = 13;
  sunGeometry = new THREE.IcosahedronGeometry(sunRadius, 1);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4500,
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  systemGroup.add(sun);

  const startRadius = 28;
  const spacing = 18;

  // 构建行星
  const planetData = [
    { color: 0x4a90e2, size: 2.0, speed: 0.008, angle: 4 }, // 蓝
    { color: 0x8b5a2b, size: 1.5, speed: 0.006, angle: 2 }, // 棕
    { color: 0xd4af37, size: 1.0, speed: 0.006, angle: 2.1 }, // 黄
    { color: 0x2ecc71, size: 2.2, speed: 0.004, angle: 5 }, // 绿
    { color: 0x5d6d7e, size: 1.8, speed: 0.003, angle: 0 }, // 灰
  ];

  // 倾斜角
  const orbitTiltX = Math.PI / 2.3;

  planetData.forEach((data, index) => {
    const dist = startRadius + index * spacing;

    // 绘制轨道
    const curve = new THREE.EllipseCurve(
      0, 0,
      dist, dist,
      0, 2 * Math.PI,
      false,
      0
    );
    const points = curve.getPoints(128);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.3
    });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -orbitTiltX;
    systemGroup.add(orbit);

    // 绘制行星
    const planetGeometry = new THREE.SphereGeometry(data.size, 16, 16);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    // pivot用于旋转
    const pivot = new THREE.Object3D();
    pivot.rotation.x = -orbitTiltX;
    pivot.rotation.z = data.angle;

    // 将行星推到轨道半径处
    planet.position.x = dist;

    pivot.add(planet);
    systemGroup.add(pivot);

    planets.push({ pivot: pivot, speed: data.speed });
  });

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateSystemPosition();
  });
};

const animate = () => {
  const time = Date.now() * 0.001;

  if (sun) {
    sun.rotation.y -= 0.002;
    sun.rotation.z += 0.001;
    // 呼吸
    const scale = 1 + Math.sin(time * 2) * 0.05;
    sun.scale.set(scale, scale, scale);
  }

  planets.forEach(p => {
    p.pivot.rotation.z -= p.speed;
  });

  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  nextTick(() => {
    initThree();
    animate();
  });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  if (renderer) {
    renderer.dispose();
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement);
    }
  }
  if(sunGeometry) sunGeometry.dispose();
});
</script>

<template>
  <div ref="containerRef" class="galaxy-fullscreen"></div>
</template>

<style scoped>
.galaxy-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>