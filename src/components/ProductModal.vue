<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import ProductImageCarousel from './ProductImageCarousel.vue'
import { config } from '../config.js'

const props = defineProps({
  product: { type: Object, required: true },
  categoryLabel: { type: String, default: '' }
})
const emit = defineEmits(['close'])

const formattedPrice = computed(() => {
  if (props.product.preco === null || props.product.preco === undefined) {
    return 'Sob consulta'
  }
  return props.product.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
})

const whatsappUrl = computed(() => {
  const lines = [
    `Olá! Tenho interesse no produto: *${props.product.titulo}*.`,
    'Pode me passar mais informações?'
  ]
  if (props.product.imagens && props.product.imagens.length) {
    lines.push('')
    lines.push('Imagem(ns):')
    props.product.imagens.forEach((url) => lines.push(url))
  }
  return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
})

function handleKey(e) {
  if (e.key === 'Escape') emit('close')
}

function handlePopState() {
  emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKey)
  // Push a fake history entry so the mobile back button closes the modal
  window.history.pushState({ modal: true }, '')
  window.addEventListener('popstate', handlePopState)
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('popstate', handlePopState)
  // If modal is closing from X/overlay (not from back button), remove the fake entry
  if (window.history.state && window.history.state.modal) {
    window.history.back()
  }
})
</script>

<template>
  <div class="modal" role="dialog" aria-modal="true" :aria-label="product.titulo" @click.self="emit('close')">
    <div class="modal__content" @click.stop>
      <button class="modal__close" type="button" aria-label="Fechar" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="18" y1="6" x2="6" y2="18"/>
        </svg>
      </button>
      <div class="modal__media">
        <ProductImageCarousel
          :images="product.imagens"
          :alt="product.titulo"
          :autoplay="true"
          :interval="5000"
          fit="contain"
          :media-padding="48"
          background="linear-gradient(160deg, #f6f5ff, #eceaff)"
        />
      </div>

      <div class="modal__body">
        <span v-if="categoryLabel" class="modal__category">{{ categoryLabel }}</span>
        <h2 class="modal__title">{{ product.titulo }}</h2>

        <p v-if="product.descricao" class="modal__desc">{{ product.descricao }}</p>
        <p v-else class="modal__desc modal__desc--empty">
          Quer saber mais sobre este produto? Fale com a gente pelo WhatsApp.
        </p>

        <div class="modal__footer">
          <span
            class="modal__price"
            :class="{ 'modal__price--soft': product.preco == null }"
          >
            {{ formattedPrice }}
          </span>
          <a
            class="btn btn--primary"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener"
          >
            Pedir pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 12, 56, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn .25s ease;
}

.modal__close {
  position: absolute;
  top: 16px; right: 16px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(15, 12, 56, .55);
  border: 1px solid rgba(255,255,255,.2);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center; justify-content: center;
  transition: background .2s ease, transform .2s ease;
  z-index: 10;
}
.modal__close:hover { background: rgba(15, 12, 56, .75); transform: rotate(90deg); }
.modal__close svg { width: 20px; height: 20px; }

.modal__content {
  position: relative;
  width: min(1280px, 100%);
  height: min(90vh, 820px);
  background: var(--surface);
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,.6);
  animation: pop .3s cubic-bezier(.2, .8, .2, 1);
}

.modal__media {
  position: relative;
  background: linear-gradient(160deg, #f6f5ff, #eceaff);
  min-height: 0;
  height: 100%;
}
.modal__media :deep(.carousel) { height: 100%; }

.modal__body {
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.modal__category {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(58, 47, 196, .1);
  color: var(--purple-700);
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 12px;
  align-self: flex-start;
}
.modal__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  margin: 0 0 16px;
  color: var(--text);
}
.modal__desc {
  color: var(--text-soft);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}
.modal__desc--empty { font-style: italic; }

.modal__footer {
  margin-top: auto;
  padding-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.modal__price {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--purple-700);
}
.modal__price--soft { font-size: 1.1rem; color: var(--text-soft); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pop {
  from { transform: scale(.94); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

@media (max-width: 960px) {
  .modal { padding: 0; }
  .modal__content {
    grid-template-columns: 1fr;
    border-radius: 0;
    width: 100%; height: 100%;
    max-height: 100vh;
    grid-template-rows: auto 1fr;
    overflow-y: auto;
  }
  .modal__media { min-height: 0; height: 55vw; max-height: 50vh; flex-shrink: 0; }
  .modal__body { padding: 24px 20px 32px; }
  .modal__close {
    top: 12px; right: 12px;
    width: 40px; height: 40px;
    background: rgba(15, 12, 56, .65);
  }
  .modal__footer {
    flex-direction: column;
    align-items: stretch;
  }
  .modal__footer .btn { text-align: center; }
  .modal__price { font-size: 1.4rem; }
}
</style>
