<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  alt: { type: String, default: '' },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  showArrows: { type: Boolean, default: true },
  showDots: { type: Boolean, default: true },
  rounded: { type: Boolean, default: false },
  fit: { type: String, default: 'cover' }, // 'cover' | 'contain'
  mediaPadding: { type: Number, default: 0 },
  background: { type: String, default: '' }
})

const index = ref(0)
const failed = ref(new Set())
let timer = null

const validImages = computed(() =>
  props.images.filter((src) => !failed.value.has(src))
)
const hasMultiple = computed(() => validImages.value.length > 1)

function next() {
  if (!hasMultiple.value) return
  index.value = (index.value + 1) % validImages.value.length
}
function prev() {
  if (!hasMultiple.value) return
  index.value =
    (index.value - 1 + validImages.value.length) % validImages.value.length
}
function go(i) { index.value = i }

function onError(src) {
  failed.value = new Set([...failed.value, src])
  if (index.value >= validImages.value.length) index.value = 0
}

function startAutoplay() {
  stopAutoplay()
  if (props.autoplay && hasMultiple.value) {
    timer = setInterval(next, props.interval)
  }
}
function stopAutoplay() {
  if (timer) { clearInterval(timer); timer = null }
}

/* Touch / swipe support */
let touchStartX = 0
let touchStartY = 0
let isSwiping = false

function onTouchStart(e) {
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  isSwiping = false
  stopAutoplay()
}
function onTouchMove(e) {
  if (!hasMultiple.value) return
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  // Only consider horizontal swipe if |dx| > |dy|
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
    isSwiping = true
    e.preventDefault()
  }
}
function onTouchEnd(e) {
  if (!isSwiping) {
    startAutoplay()
    return
  }
  const dx = e.changedTouches[0].clientX - touchStartX
  if (dx < -40) next()
  else if (dx > 40) prev()
  startAutoplay()
}

watch(() => [props.autoplay, props.interval, hasMultiple.value], startAutoplay)
onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)

defineExpose({ next, prev, go })

const carouselStyle = computed(() =>
  props.background ? { background: props.background } : {}
)
const trackStyle = computed(() =>
  props.mediaPadding ? { inset: `${props.mediaPadding}px` } : {}
)
const imgStyle = computed(() => ({ objectFit: props.fit }))
</script>

<template>
  <div
    class="carousel"
    :class="{
      'carousel--rounded': rounded,
      'carousel--contain': fit === 'contain'
    }"
    :style="carouselStyle"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend.passive="onTouchEnd"
  >
    <div v-if="!validImages.length" class="carousel__placeholder" aria-hidden="true">
      <slot name="placeholder">{{ alt.charAt(0) || '?' }}</slot>
    </div>

    <transition-group v-else name="fade" tag="div" class="carousel__track" :style="trackStyle">
      <img
        v-for="(src, i) in validImages"
        v-show="i === index"
        :key="src"
        :src="src"
        :alt="alt"
        loading="lazy"
        class="carousel__img"
        :style="imgStyle"
        @error="onError(src)"
      />
    </transition-group>

    <template v-if="hasMultiple">
      <button
        v-if="showArrows"
        type="button"
        class="carousel__arrow carousel__arrow--prev"
        aria-label="Imagem anterior"
        @click.stop="prev"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button
        type="button"
        class="carousel__arrow carousel__arrow--next"
        aria-label="Próxima imagem"
        @click.stop="next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <div v-if="showDots" class="carousel__dots" role="tablist">
        <button
          v-for="(src, i) in validImages"
          :key="src"
          type="button"
          class="carousel__dot"
          :class="{ 'is-active': i === index }"
          :aria-label="`Ir para imagem ${i + 1}`"
          :aria-selected="i === index"
          @click.stop="go(i)"
        ></button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--purple-700), var(--purple-900));
  overflow: hidden;
}
.carousel--rounded { border-radius: var(--radius); }

.carousel__track { position: absolute; inset: 0; }
.carousel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Modo "contain": imagem com respiro, centralizada, sem cortes */
.carousel--contain .carousel__track {
  box-sizing: border-box;
}
.carousel--contain .carousel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 12px 30px rgba(15, 12, 56, 0.18));
}

.carousel__placeholder {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.4);
  font-weight: 700;
  font-size: 2.5rem;
}

.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 0;
  background: rgba(255,255,255,.92);
  color: var(--purple-800);
  display: inline-flex;
  align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.18);
  transition: transform .2s ease, background .2s ease;
  opacity: 0;
}
.carousel:hover .carousel__arrow { opacity: 1; }
.carousel__arrow:hover { background: #fff; transform: translateY(-50%) scale(1.06); }
.carousel__arrow svg { width: 18px; height: 18px; }
.carousel__arrow--prev { left: 10px; }
.carousel__arrow--next { right: 10px; }

.carousel__dots {
  position: absolute;
  bottom: 12px;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
}
.carousel__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  border: 0;
  background: rgba(255,255,255,.55);
  cursor: pointer;
  pointer-events: auto;
  transition: background .2s ease, width .2s ease;
  padding: 0;
}
.carousel__dot.is-active { background: #fff; width: 22px; border-radius: 4px; }

.fade-enter-active, .fade-leave-active {
  transition: opacity .6s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .carousel__arrow { opacity: 1; width: 32px; height: 32px; }
}
</style>
