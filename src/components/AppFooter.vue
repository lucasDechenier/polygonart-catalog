<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p>© {{ year }} PolygonArt_3D — Todos os direitos reservados.</p>
      <p class="footer__tag">Produção artesanal · Peças personalizadas · Alta qualidade</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 32px 0;
  background: var(--purple-900);
  color: rgba(255,255,255,.7);
  text-align: center;
  font-size: .9rem;
}
.footer__inner p { margin: 4px 0; }
.footer__tag { color: rgba(255,255,255,.5); font-size: .8rem; }
</style>
