<script setup>
import { config } from '../config.js'
const whatsappUrl = `https://wa.me/${config.contact.whatsapp}`
</script>

<template>
  <section class="hero" id="home">
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="container hero__inner">
      <p class="hero__brand-vertical">PolygonArt_3D</p>
      <div class="hero__content">
        <span class="eyebrow hero__eyebrow">Impressão 3D artesanal</span>
        <h1>Acessórios gamer<br/>em impressão 3D</h1>
        <p class="hero__platforms">PS4 · PS5 · Nintendo · PC — seu setup, seu estilo</p>

        <ul class="hero__highlights">
          <li>Produção artesanal</li>
          <li>Peças personalizadas</li>
          <li>Alta qualidade em impressão 3D</li>
        </ul>

        <div class="hero__actions">
          <a href="#catalogo" class="btn btn--primary">Ver catálogo</a>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="btn btn--ghost">
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  color: #fff;
  overflow: hidden;
  padding: 100px 0 120px;
}
.hero__bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 80% 20%, rgba(255,95,162,.25), transparent 50%),
    radial-gradient(ellipse at 10% 90%, rgba(62,224,214,.18), transparent 50%),
    linear-gradient(135deg, var(--purple-900), var(--purple-700));
  z-index: -1;
}
.hero__bg::after {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, #000 40%, transparent 80%);
}
.hero__inner {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
  min-height: 460px;
}
.hero__brand-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: 700;
  letter-spacing: .04em;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  margin: 0;
  color: rgba(255,255,255,.95);
}
.hero__content { max-width: 720px; }
.hero__eyebrow { color: var(--accent-cyan) !important; }
.hero__platforms {
  font-weight: 500;
  margin-top: .4rem;
  margin-bottom: 2rem;
  color: rgba(255,255,255,.85);
}
.hero__highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 2.4rem;
  display: grid;
  gap: 8px;
}
.hero__highlights li {
  position: relative;
  padding-left: 22px;
  color: rgba(255,255,255,.9);
  font-weight: 500;
}
.hero__highlights li::before {
  content: "";
  position: absolute; left: 0; top: 10px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--accent-pink);
  box-shadow: 0 0 12px var(--accent-pink);
}
.hero__actions { display: flex; gap: 12px; flex-wrap: wrap; }

@media (max-width: 860px) {
  .hero { padding: 70px 0 90px; }
  .hero__inner { grid-template-columns: 1fr; gap: 24px; min-height: 0; }
  .hero__brand-vertical { writing-mode: horizontal-tb; transform: none; opacity: .6; }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 2.1rem; }
}
</style>
