<script setup>
import { computed } from 'vue'
import ProductImageCarousel from './ProductImageCarousel.vue'
import { config } from '../config.js'

const props = defineProps({
  product: { type: Object, required: true },
  categorias: { type: Array, default: () => [] }
})
const emit = defineEmits(['open'])

const categoryLabel = computed(() => {
  const cat = props.categorias.find(
    (c) => String(c.id) === String(props.product.categoria_id)
  )
  return cat ? cat.nome : ''
})

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
</script>

<template>
  <article
    class="product"
    role="button"
    tabindex="0"
    :aria-label="`Ver detalhes de ${product.titulo}`"
    @click="emit('open', product)"
    @keydown.enter.prevent="emit('open', product)"
    @keydown.space.prevent="emit('open', product)"
  >
    <div class="product__media">
      <ProductImageCarousel
        :images="product.imagens"
        :alt="product.titulo"
        :autoplay="true"
        :interval="4500"
        :show-arrows="product.imagens.length > 1"
        :show-dots="product.imagens.length > 1"
      >
        <template #placeholder>{{ product.titulo.charAt(0) }}</template>
      </ProductImageCarousel>

      <span v-if="categoryLabel" class="product__category">{{ categoryLabel }}</span>
      <span v-if="product.imagens.length > 1" class="product__badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L5 22"/>
        </svg>
        {{ product.imagens.length }}
      </span>
    </div>

    <div class="product__body">
      <h3 class="product__name">{{ product.titulo }}</h3>
      <p v-if="product.descricao" class="product__desc">{{ product.descricao }}</p>
      <div class="product__footer">
        <span
          class="product__price"
          :class="{ 'product__price--soft': product.preco == null }"
        >
          {{ formattedPrice }}
        </span>
        <a
          class="product__cta"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          :aria-label="`Pedir ${product.titulo} pelo WhatsApp`"
          @click.stop
        >
          Pedir
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product {
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: transform .25s ease, box-shadow .25s ease;
  border: 1px solid var(--border);
  cursor: pointer;
  outline: none;
}
.product:hover,
.product:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.product:focus-visible {
  box-shadow: 0 0 0 3px rgba(89, 73, 224, .35), var(--shadow-lg);
}

.product__media {
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
}
.product__category {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(255,255,255,.95);
  color: var(--purple-800);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  z-index: 2;
}
.product__badge {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(15, 12, 56, .65);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
  backdrop-filter: blur(4px);
}
.product__badge svg { width: 12px; height: 12px; }

.product__body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  min-height: 140px;
}
.product__name {
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product__desc {
  color: var(--text-soft);
  font-size: .9rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  gap: 8px;
}
.product__price {
  font-weight: 800;
  color: var(--purple-700);
  font-size: 1.1rem;
}
.product__price--soft { color: var(--text-soft); font-size: .85rem; font-weight: 600; }
.product__cta {
  background: var(--purple-700);
  color: #fff;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: .8rem;
  font-weight: 600;
  transition: background .2s ease;
}
.product__cta:hover { background: var(--purple-800); }

@media (max-width: 480px) {
  .product__body { padding: 12px; min-height: auto; gap: 4px; }
  .product__name { font-size: .85rem; text-align: center; }
  .product__desc { display: none; }
  .product__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  .product__price { font-size: .95rem; text-align: center; }
  .product__cta {
    text-align: center;
    padding: 8px 10px;
    font-size: .75rem;
  }
}
</style>
