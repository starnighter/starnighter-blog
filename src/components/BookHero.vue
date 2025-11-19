<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

const props = defineProps({
  allBooks: { type: Array, required: true }
});

const containerRef = ref(null);
const currentBook = ref(null);
const showCard = ref(false);

// 随机推荐书籍
const pickRandomBook = () => {
  let seen = JSON.parse(localStorage.getItem('seen_books') || '[]');
  let available = props.allBooks.filter(b => !seen.includes(b.slug));
  if (available.length === 0) {
    seen = [];
    available = props.allBooks;
    localStorage.setItem('seen_books', '[]');
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selected = available[randomIndex];
  seen.push(selected.slug);
  localStorage.setItem('seen_books', JSON.stringify(seen));
  return selected;
};

let scene, camera, renderer, bookGroup;
let leftWing, rightWing;
let animationId;

// 创建假文字行
const createTextLines = (width, height) => {
  const group = new THREE.Group();
  const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xbbbbbb,
    side: THREE.DoubleSide
  });

  const linesCount = 6;
  const startY = height / 2 - 0.6;
  const gap = 0.5;

  for (let i = 0; i < linesCount; i++) {
    const lineWidth = width * (0.7 + Math.random() * 0.25);
    const geo = new THREE.PlaneGeometry(lineWidth, 0.12);
    const mesh = new THREE.Mesh(geo, lineMaterial);

    mesh.position.set(0, startY - i * gap, 0.01);
    mesh.position.x = (Math.random() - 0.5) * 0.1;

    group.add(mesh);
  }
  group.rotation.x = -Math.PI / 2;
  return group;
};

const initThree = () => {
  const container = containerRef.value;
  if (!container) return;

  // 获取容器尺寸，提供兜底值
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 500;

  scene = new THREE.Scene();

  const isMobile = width < 600;
  const camDist = isMobile ? 14 : 11;
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 8, camDist);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  while (container.firstChild) container.removeChild(container.firstChild);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 稍微调亮环境光
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // 绘制书本
  bookGroup = new THREE.Group();

  // 材质
  const coverMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.6,
    metalness: 0.1
  });
  const pageMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffef0,
    roughness: 0.8
  });
  // 侧面材质
  const sidePageMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0dcca,
    roughness: 0.9
  });

  const bookWidth = 3.2;
  const bookHeight = 4.4;
  const coverThick = 0.15;
  const pageThick = 0.4;

  // 左半部分
  leftWing = new THREE.Group();
  // 左封面
  const lCoverGeo = new THREE.BoxGeometry(bookWidth, coverThick, bookHeight);
  lCoverGeo.translate(-bookWidth / 2, coverThick / 2, 0);
  const lCover = new THREE.Mesh(lCoverGeo, coverMaterial);

  // 左书页
  const lPageGeo = new THREE.BoxGeometry(bookWidth - 0.1, pageThick, bookHeight - 0.2);
  lPageGeo.translate(-(bookWidth - 0.1) / 2, coverThick + pageThick / 2, 0);
  const lPageMaterials = [sidePageMaterial, sidePageMaterial, pageMaterial, sidePageMaterial, sidePageMaterial, sidePageMaterial];
  const lPages = new THREE.Mesh(lPageGeo, lPageMaterials);

  // 左侧假文字
  const lText = createTextLines(bookWidth - 1.2, bookHeight - 1);
  // 定位文字：基于书页表面高度
  lText.position.set(-bookWidth/2 + 0.1, coverThick + pageThick + 0.01, 0);

  leftWing.add(lCover, lPages, lText);


  // 右半部分
  rightWing = new THREE.Group();
  // 右封面
  const rCoverGeo = new THREE.BoxGeometry(bookWidth, coverThick, bookHeight);
  rCoverGeo.translate(bookWidth / 2, coverThick / 2, 0);
  const rCover = new THREE.Mesh(rCoverGeo, coverMaterial);

  // 右书页
  const rPageGeo = new THREE.BoxGeometry(bookWidth - 0.1, pageThick, bookHeight - 0.2);
  rPageGeo.translate((bookWidth - 0.1) / 2, coverThick + pageThick / 2, 0);
  const rPages = new THREE.Mesh(rPageGeo, lPageMaterials); // 复用材质数组

  // 右侧假文字
  const rText = createTextLines(bookWidth - 1.2, bookHeight - 1);
  rText.position.set(bookWidth/2 - 0.1, coverThick + pageThick + 0.01, 0);

  rightWing.add(rCover, rPages, rText);

  // 书脊
  const spineGeo = new THREE.CylinderGeometry(0.25, 0.25, bookHeight, 16, 1, false, Math.PI, Math.PI * 2);
  const spine = new THREE.Mesh(spineGeo, coverMaterial);
  spine.rotation.x = Math.PI / 2;
  spine.position.set(0, 0, 0);

  const openAngle = -0.15;
  leftWing.rotation.z = openAngle;
  rightWing.rotation.z = -openAngle;

  bookGroup.add(leftWing, rightWing, spine);

  bookGroup.rotation.x = 0.4;
  scene.add(bookGroup);

  // 书本悬浮动画
  gsap.to(bookGroup.position, {
    y: 0.4,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  renderer.domElement.addEventListener('click', onBookClick);
};

const onWindowResize = () => {
  if (!containerRef.value || !camera || !renderer) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  if (width === 0 || height === 0) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const onBookClick = () => {
  if (showCard.value) return;
  currentBook.value = pickRandomBook();

  // 翻转动画
  gsap.to(bookGroup.rotation, {
    y: Math.PI * 2,
    duration: 0.8,
    ease: "back.out(1.5)",
    onComplete: () => {
      bookGroup.rotation.y = 0;
    }
  });

  // 开合细节动画
  const tl = gsap.timeline();
  tl.to([leftWing.rotation, rightWing.rotation], { z: 0, duration: 0.2, ease: "power2.in" })
    .to(leftWing.rotation, { z: -0.15, duration: 0.4, ease: "elastic.out(1, 0.5)" }, "+=0.1")
    .to(rightWing.rotation, { z: 0.15, duration: 0.4, ease: "elastic.out(1, 0.5)" }, "<");

  setTimeout(() => { showCard.value = true; }, 400);
};

const animate = () => {
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  animationId = requestAnimationFrame(animate);
};

const handleCardClick = () => {
  if (currentBook.value) {
    window.location.href = `/reading/${currentBook.value.slug}`;
  }
};

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initThree();
      animate();
      window.addEventListener('resize', onWindowResize);
    }, 50);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement);
    }
  }
});
</script>

<template>
  <div class="hero-wrapper">
    <div ref="containerRef" class="three-container"></div>

    <p class="hint-text" v-if="!showCard">点击书本，获取今日灵感</p>

    <Transition name="card-fly">
      <div v-if="showCard" class="book-card-overlay" @click="handleCardClick">
        <div class="card-inner">
          <div class="card-badge">每日推荐</div>
          <h3>{{ currentBook.data.title }}</h3>
          <div class="meta">
            <span>{{ currentBook.data.author }}</span> | <span>{{ currentBook.data.genre }}</span>
          </div>
          <p class="comment">“ {{ currentBook.data.comment }} ”</p>
          <div class="click-hint">点击查看详情 →</div>
        </div>
        <button class="close-btn" @click.stop="showCard = false">×</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hero-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  min-height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(var(--color-accent-rgb), 0.08) 0%, transparent 70%);
}

.three-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}

.hint-text {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  opacity: 0.7;
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
}

/* 卡片样式 */
.book-card-overlay {
  position: absolute;
  z-index: 10;
  background: rgba(var(--color-bg-rgb), 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.book-card-overlay:hover {
  transform: scale(1.02);
  border-color: var(--color-accent);
}

.card-badge {
  background: var(--color-accent);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  display: inline-block;
  margin-bottom: 1rem;
}

.card-inner h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.meta {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.comment {
  font-style: italic;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.click-hint {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-weight: bold;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}

/* 卡片动画 */
.card-fly-enter-active {
  animation: fly-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card-fly-leave-active {
  transition: opacity 0.3s;
}
.card-fly-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.5) rotateX(20deg);
}
.card-fly-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes fly-in {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.2) rotateX(40deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0);
  }
}
</style>