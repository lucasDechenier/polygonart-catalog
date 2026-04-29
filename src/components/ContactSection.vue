<script setup>
import { computed } from 'vue'
import { config } from '../config.js'

const whatsappUrl = computed(() => `https://wa.me/${config.contact.whatsapp}`)
const instagramUrl = computed(() => config.contact.instagramUrl)
const whatsappDisplay = computed(() => {
  // formata 5583988592226 -> (83) 9 8859 2226 (assumindo BR + DDD 2 dígitos)
  const n = config.contact.whatsapp.replace(/\D/g, '')
  if (n.length < 12) return config.contact.whatsapp
  const ddd = n.slice(2, 4)
  const part1 = n.slice(4, 5)
  const part2 = n.slice(5, 9)
  const part3 = n.slice(9)
  return `(${ddd}) ${part1} ${part2} ${part3}`
})
</script>

<template>
  <section class="contact" id="contato">
    <div class="container contact__card">
      <div>
        <span class="eyebrow eyebrow--light">Contato</span>
        <h2>Entre em contato e personalize o seu</h2>
        <p>Atendemos pedidos personalizados e enviamos para todo o Brasil.</p>
      </div>

      <ul class="contact__list">
        <li>
          <a :href="instagramUrl" target="_blank" rel="noopener">
            <span class="contact__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </span>
            <span>
              <strong>Instagram</strong>
              <em>@{{ config.contact.instagram }}</em>
            </span>
          </a>
        </li>
        <li>
          <a :href="whatsappUrl" target="_blank" rel="noopener">
            <span class="contact__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.2A8.5 8.5 0 1 1 21 11.5Z"/>
                <path d="M8.5 9.5c.4 2.5 2.5 4.6 5 5l1.6-1.4 2.4 1.1c-.3 1.4-1.7 2.3-3.1 2.2-3.4-.2-6.1-2.9-6.3-6.3-.1-1.4.8-2.8 2.2-3.1l1.1 2.4-1.4 1.6Z" fill="currentColor"/>
              </svg>
            </span>
            <span>
              <strong>WhatsApp</strong>
              <em>{{ whatsappDisplay }}</em>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact { padding: 80px 0; }
.contact__card {
  background: linear-gradient(135deg, var(--purple-800), var(--purple-900));
  color: #fff;
  border-radius: 28px;
  padding: 56px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}
.contact__card::before {
  content: "";
  position: absolute;
  top: -50%; right: -20%;
  width: 60%; aspect-ratio: 1;
  background: radial-gradient(circle, rgba(255,95,162,.25), transparent 70%);
  pointer-events: none;
}
.contact__card h2 { color: #fff; }
.contact__card p { color: rgba(255,255,255,.8); margin: 0; }
.contact__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}
.contact__list a {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: var(--radius);
  transition: background .2s ease, transform .2s ease;
}
.contact__list a:hover {
  background: rgba(255,255,255,.16);
  transform: translateX(4px);
}
.contact__icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,.12);
  display: inline-flex;
  align-items: center; justify-content: center;
  color: var(--accent-cyan);
  flex-shrink: 0;
}
.contact__icon svg { width: 22px; height: 22px; }
.contact__list strong { display: block; font-weight: 700; }
.contact__list em { font-style: normal; color: rgba(255,255,255,.7); font-size: .9rem; }

@media (max-width: 860px) {
  .contact__card { grid-template-columns: 1fr; padding: 36px 28px; }
}
</style>
