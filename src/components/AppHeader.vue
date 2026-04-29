<script setup>
import { ref } from 'vue'
import { config } from '../config.js'

const open = ref(false)
const whatsappUrl = `https://wa.me/${config.contact.whatsapp}`

function close() { open.value = false }
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#home" class="brand" @click="close">
        <span class="brand__logo">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <polygon points="32,6 58,20 58,44 32,58 6,44 6,20" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <polygon points="32,18 46,26 46,42 32,50 18,42 18,26" fill="currentColor" opacity=".25"/>
            <path d="M22 28 L32 22 L42 28 L42 40 L32 46 L22 40 Z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </span>
        <span class="brand__name">Polygon<strong>Art</strong>_3D</span>
      </a>

      <nav class="nav" :class="{ 'is-open': open }" aria-label="Navegação principal">
        <a href="#home" @click="close">Início</a>
        <a href="#sobre" @click="close">Sobre</a>
        <a href="#catalogo" @click="close">Catálogo</a>
        <a href="#contato" @click="close">Contato</a>
      </nav>

      <a class="btn btn--primary header__cta" :href="whatsappUrl" target="_blank" rel="noopener">
        Fazer pedido
      </a>

      <button
        class="nav__toggle"
        :aria-expanded="open"
        aria-label="Abrir menu"
        @click="open = !open"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,.85);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: 1px solid var(--border);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 72px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: var(--purple-800);
}
.brand__logo svg { width: 32px; height: 32px; }
.brand__name { font-size: 1.05rem; letter-spacing: -.02em; }
.brand__name strong { color: var(--accent-pink); font-weight: 800; }

.nav {
  display: flex;
  gap: 28px;
  font-weight: 500;
  font-size: .95rem;
}
.nav a { color: var(--text); position: relative; padding: 6px 0; }
.nav a::after {
  content: "";
  position: absolute; left: 0; bottom: 0;
  height: 2px; width: 0;
  background: var(--purple-600);
  transition: width .25s ease;
}
.nav a:hover::after { width: 100%; }

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 0;
  padding: 8px;
  cursor: pointer;
}
.nav__toggle span {
  width: 24px; height: 2px;
  background: var(--text);
  border-radius: 2px;
}

@media (max-width: 860px) {
  .nav, .header__cta { display: none; }
  .nav__toggle { display: flex; }
  .nav.is-open {
    display: flex;
    position: absolute;
    top: 72px; left: 0; right: 0;
    flex-direction: column;
    background: #fff;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
}
</style>
