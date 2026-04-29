<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchCatalog } from './services/sheets.js'
import { config } from './config.js'

import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import CatalogSection from './components/CatalogSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'

const categorias = ref([])
const produtos = ref([])
const loading = ref(true)
const error = ref(null)

const isConfigured = computed(
  () => !!(config.sheets.categoriasUrl && config.sheets.produtosUrl)
)

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchCatalog()
    categorias.value = data.categorias
    produtos.value = data.produtos
  } catch (e) {
    error.value = e.message || 'Erro ao carregar catálogo'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isConfigured.value) load()
  else loading.value = false
})
</script>

<template>
  <AppHeader />
  <HeroSection />
  <AboutSection />

  <CatalogSection
    :categorias="categorias"
    :produtos="produtos"
    :loading="loading"
    :error="error"
    :configured="isConfigured"
    @retry="load"
  />

  <ContactSection />
  <AppFooter />
</template>
