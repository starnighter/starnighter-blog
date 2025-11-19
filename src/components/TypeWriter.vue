<script setup>
import {ref, onMounted} from 'vue';
import {gsap} from 'gsap';
import {TextPlugin} from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const mottos = [
  "我爱着我所爱的，亦如山川爱着河流，繁星爱着夜空。",
  "试问岭南应不好，却道，此心安处是吾乡。"
];

const textRef = ref(null);
const cursorRef = ref(null);

onMounted(() => {
  const textEl = textRef.value;
  const cursorEl = cursorRef.value;

  // 光标闪烁动画
  gsap.to(cursorEl, {
    opacity: 0,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
    duration: 0.5
  });

  // 打字机主时间线
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.5,
  });

  mottos.forEach(text => {
    tl
      .to(textEl, {
        text: text,
        duration: text.length * 0.1,
        ease: "power1.in"
      })
      .to(textEl, {
        duration: 1.8
      })
      .to(textEl, {
        text: "",
        duration: text.length * 0.04,
        ease: "power1.out"
      })
      .to(textEl, {
        duration: 0.8
      });
  });
});
</script>

<template>
  <p class="typewriter-wrapper">
    <span class="text" ref="textRef"></span>
    <span class="cursor" ref="cursorRef"></span>
  </p>
</template>

<style scoped>
.typewriter-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  margin: 5px;
  height: 1.3em;
  font-family: 'MonoLisa', 'Fira Code', monospace;
}

.cursor {
  display: inline-block;
  width: 3px;
  height: 1.1em;
  background-color: currentColor;
  margin-left: 5px;
  border-radius: 1px;
}

.text {
  display: inline-block;
  line-height: 1.1em;
}
</style>