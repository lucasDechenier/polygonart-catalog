<script setup>
import logoUrl from '../assets/images/logo-polygonart.jpeg'
</script>

<template>
  <section class="about" id="sobre">
    <div class="container about__grid">
      <div class="about__logo">
        <div class="logo-card">
          <img :src="logoUrl" alt="PolygonArt_3D" class="logo-card__img" />
        </div>
      </div>

      <div class="about__text">
        <h2>Sobre a PolygonArt_3D</h2>
        <p>
          A <strong>PolygonArt_3D</strong> é uma empresa especializada na criação de produtos
          em impressão 3D, oferecendo soluções criativas e funcionais para diversos públicos.
          Trabalhamos com acessórios gamer, itens personalizados, miniaturas colecionáveis,
          chaveiros e muito mais.
        </p>
        <p class="about__mission">
          Nosso objetivo é unir qualidade, design e inovação
          para transformar ideias em peças únicas.
        </p>

        <ul class="features">
          <li><span>✓</span> Alta durabilidade</li>
          <li><span>✓</span> Design exclusivo</li>
          <li><span>✓</span> Personalização sob medida</li>
          <li><span>✓</span> Produção artesanal</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about { padding: 100px 0; background: var(--surface); }
.about__grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 56px;
  align-items: center;
}
.logo-card {
  background: linear-gradient(180deg, #fafaff, #eeecff);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.logo-card__img {
  width: 100%;
  max-width: 280px;
  height: auto;
  display: block;
  border-radius: var(--radius-sm);
}

.about__text p { color: var(--text-soft); font-size: 1.05rem; }
.about__mission { font-size: 1.1rem !important; color: var(--text) !important; }
.features {
  list-style: none;
  padding: 24px 28px;
  margin: 1.6rem 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  background: linear-gradient(135deg, var(--purple-800), var(--purple-700));
  color: #fff;
  border-radius: var(--radius);
}
.features li {
  display: flex; align-items: center; gap: 10px;
  font-weight: 600;
  font-size: .98rem;
}
.features li span {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--accent-cyan);
  color: var(--purple-900);
  display: inline-flex;
  align-items: center; justify-content: center;
  font-size: .8rem;
  font-weight: 800;
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .about__grid { grid-template-columns: 1fr; gap: 32px; }
  .logo-card { max-width: 320px; margin: 0 auto; }
  .features { grid-template-columns: 1fr; }
}
</style>
