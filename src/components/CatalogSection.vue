<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'
import ProductModal from './ProductModal.vue'

const props = defineProps({
  categorias: { type: Array, default: () => [] },
  produtos:   { type: Array, default: () => [] },
  loading:    { type: Boolean, default: false },
  error:      { type: String, default: null },
  configured: { type: Boolean, default: true }
})

const emit = defineEmits(['retry'])

const activeCategory = ref('todos')
const selectedProduct = ref(null)

const allCategories = computed(() => [
  { id: 'todos', nome: 'Todos' },
  ...props.categorias
])

const visibleProducts = computed(() => {
  if (activeCategory.value === 'todos') return props.produtos
  return props.produtos.filter(
    (p) => String(p.categoria_id) === String(activeCategory.value)
  )
})

const selectedCategoryLabel = computed(() => {
  if (!selectedProduct.value) return ''
  const cat = props.categorias.find(
    (c) => String(c.id) === String(selectedProduct.value.categoria_id)
  )
  return cat ? cat.nome : ''
})

function openProduct(p) { selectedProduct.value = p }
function closeProduct() { selectedProduct.value = null }
</script>

<template>
  <section class="catalog" id="catalogo">
    <div class="container">
      <header class="section-header">
        <span class="eyebrow">Catálogo</span>
        <h2>Nossos produtos</h2>
        <p>Filtre por categoria e clique no produto para pedir pelo WhatsApp.</p>
      </header>

      <!-- Estado: não configurado -->
      <div v-if="!configured" class="state">
        <p class="state__title">Configure sua planilha</p>
        <p>
          Adicione as URLs CSV das abas <strong>categorias</strong> e
          <strong>produtos</strong> em <code>src/config.js</code> ou no arquivo
          <code>.env</code> (veja <code>.env.example</code>).
        </p>
      </div>

      <!-- Estado: carregando -->
      <div v-else-if="loading" class="state">
        <div class="spinner" aria-hidden="true"></div>
        <p>Carregando catálogo…</p>
      </div>

      <!-- Estado: erro -->
      <div v-else-if="error" class="state">
        <p class="state__title">Não foi possível carregar o catálogo</p>
        <p>{{ error }}</p>
        <button class="btn btn--primary" @click="emit('retry')">Tentar novamente</button>
      </div>

      <!-- Conteúdo -->
      <template v-else>
        <div class="filters" role="tablist" aria-label="Filtros de categoria">
          <button
            v-for="cat in allCategories"
            :key="cat.id"
            type="button"
            role="tab"
            class="filter-btn"
            :class="{ 'is-active': activeCategory === cat.id }"
            :aria-selected="activeCategory === cat.id"
            @click="activeCategory = cat.id"
          >
            {{ cat.nome }}
          </button>
        </div>

        <div v-if="visibleProducts.length" class="products">
          <ProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            :product="product"
            :categorias="categorias"
            @open="openProduct"
          />
        </div>

        <p v-else class="state">
          Nenhum produto nesta categoria ainda. Em breve!
        </p>
      </template>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <ProductModal
          v-if="selectedProduct"
          :product="selectedProduct"
          :category-label="selectedCategoryLabel"
          @close="closeProduct"
        />
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.catalog { padding: 100px 0; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-header p { color: var(--text-soft); }

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
}
.filter-btn {
  padding: 10px 20px;
  border: 1.5px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  font-weight: 600;
  font-size: .9rem;
  cursor: pointer;
  color: var(--text-soft);
  transition: all .2s ease;
}
.filter-btn:hover { border-color: var(--purple-500); color: var(--purple-700); }
.filter-btn.is-active {
  background: var(--purple-700);
  color: #fff;
  border-color: var(--purple-700);
  box-shadow: var(--shadow);
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

code {
  background: var(--border);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: .9em;
}

@media (max-width: 480px) {
  .products { grid-template-columns: 1fr 1fr; gap: 14px; }
}
</style>
