<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref(null);
let scene, camera, renderer;
let nodes = [], lines = [], signals = []; // 节点、连线、信号
let animationId;
let mouseX = 0, mouseY = 0;

// 配置参数
const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 180;

const initThree = () => {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. 场景
  scene = new THREE.Scene();
  // 雾效：增加深邃感，颜色需适配 CSS 变量
  // 这里我们用代码动态获取 CSS 变量不太方便，先用通用的深色，依靠 canvas 透明度适配背景

  // 2. 相机
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
  camera.position.z = 600;

  // 3. 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 4. 创建节点 (六边形)
  const nodeGeometry = new THREE.CircleGeometry(5, 6); // 半径5，6边形
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });

  // 生成随机节点位置
  for (let i = 0; i < NODE_COUNT; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());

    // 随机分布，但偏向中心
    const r = 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    node.position.x = (Math.random() - 0.5) * 800;
    node.position.y = (Math.random() - 0.5) * 600;
    node.position.z = (Math.random() - 0.5) * 200; // 较扁平的 Z 轴，像一面墙

    // 为每个节点随机分配一个“脉冲”相位
    node.userData = {
      pulsePhase: Math.random() * Math.PI,
      connections: [] // 存储连接的邻居
    };

    scene.add(node);
    nodes.push(node);
  }

  // 5. 创建连线 (构建拓扑图)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.15
  });

  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dist = nodes[i].position.distanceTo(nodes[j].position);

      // 只连接一定距离内的节点，形成局部网络
      if (dist < CONNECTION_DISTANCE) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          nodes[i].position,
          nodes[j].position
        ]);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);

        // 记录连接关系，用于信号传输动画
        nodes[i].userData.connections.push(nodes[j]);
        nodes[j].userData.connections.push(nodes[i]);

        // 偶尔生成一个信号
        if (Math.random() > 0.8) {
          createSignal(nodes[i], nodes[j]);
        }
      }
    }
  }

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);
};

// 创建“信号”粒子
const createSignal = (startNode, endNode) => {
  const geometry = new THREE.CircleGeometry(2, 6);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 白色高亮信号
  const signal = new THREE.Mesh(geometry, material);

  signal.position.copy(startNode.position);
  scene.add(signal);

  signals.push({
    mesh: signal,
    start: startNode.position,
    end: endNode.position,
    progress: 0,
    speed: 0.01 + Math.random() * 0.02 // 随机速度
  });
};

const onMouseMove = (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
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
  const time = Date.now() * 0.002;

  // 1. 相机视差移动 (模拟观察情报板)
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // 2. 节点脉冲动画 (呼吸灯)
  nodes.forEach(node => {
    const scale = 1 + Math.sin(time + node.userData.pulsePhase) * 0.3;
    node.scale.set(scale, scale, 1);
  });

  // 3. 信号传输动画
  for (let i = signals.length - 1; i >= 0; i--) {
    const s = signals[i];
    s.progress += s.speed;

    if (s.progress >= 1) {
      // 到达终点，移除
      scene.remove(s.mesh);
      s.mesh.geometry.dispose();
      signals.splice(i, 1);

      // 有概率产生新信号，维持繁忙感
      const randomNodeIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[randomNodeIndex];
      if (startNode.userData.connections.length > 0) {
        const endNode = startNode.userData.connections[Math.floor(Math.random() * startNode.userData.connections.length)];
        createSignal(startNode, endNode);
      }
    } else {
      // 线性插值位置
      s.mesh.position.lerpVectors(s.start, s.end, s.progress);
    }
  }

  // 维持一定数量的信号
  if (signals.length < 5) {
    const randomNodeIndex = Math.floor(Math.random() * nodes.length);
    const startNode = nodes[randomNodeIndex];
    if (startNode.userData.connections.length > 0) {
      const endNode = startNode.userData.connections[Math.floor(Math.random() * startNode.userData.connections.length)];
      createSignal(startNode, endNode);
    }
  }

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  // 延迟初始化确保容器有尺寸
  setTimeout(() => {
    initThree();
    animate();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    if (containerRef.value) containerRef.value.removeChild(renderer.domElement);
  }
});
</script>

<template>
  <div ref="containerRef" class="analysis-bg"></div>
</template>

<style scoped>
.analysis-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  /* 动态渐变背景：模拟情报室屏幕的辉光 */
  background: var(--friend-bg-gradient);
  background-attachment: fixed;
  transition: background 0.5s ease;
}
</style>