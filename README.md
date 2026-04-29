# PolygonArt_3D — Catálogo Vue 3 + Vite

Catálogo de produtos em impressão 3D, com dados vindos de uma planilha do Google Sheets publicada como CSV.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (dev server + build)
- **Vanilla CSS** (sem framework — variáveis CSS + componentes)
- Sem backend: dados consumidos direto do Google Sheets via CSV público

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Configuração da planilha

### 1. Criar a planilha

No Google Sheets, crie **uma planilha com duas abas**:

**Aba `categorias`:**

| id | nome |
|----|------|
| 1  | Suportes PS5 |
| 2  | PS4 |
| 3  | Nintendo |
| 4  | PC / Setup |
| 5  | Colecionáveis |
| 6  | Chaveiros |
| 7  | Personalizados |

**Aba `produtos`:**

| id | titulo | descricao | preco | imagem_url | categoria_id |
|----|--------|-----------|-------|------------|--------------|
| 1  | Suporte para Controle PS5 | Suporte com gravação PS5... | 49,90 | https://res.cloudinary.com/.../suporte.jpg | 1 |
| 2  | Suporte Duplo PS5 | Acomoda dois controles... | 79,90 | https://res.cloudinary.com/.../duplo.jpg | 1 |

Observações:
- `preco` aceita formatos `49,90`, `49.90`, `R$ 49,90`. Deixe vazio para "Sob consulta".
- `imagem_url` é uma URL pública (Cloudinary, Imgur, Drive público, etc.).
- `categoria_id` deve bater com algum `id` da aba `categorias`.

### 2. Publicar como CSV

Para **cada aba**:

1. Em cima, vá em **Arquivo > Compartilhar > Publicar na Web**
2. Em "Conteúdo publicado e configurações", escolha a aba (ex.: `categorias`)
3. Em formato, selecione **Valores separados por vírgula (.csv)**
4. Clique em **Publicar** e copie a URL

Repita para a aba `produtos`.

### 3. Configurar no projeto

Crie um arquivo `.env` na raiz (copie de `.env.example`):

```bash
cp .env.example .env
```

E preencha:

```env
VITE_SHEET_CATEGORIAS_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv
VITE_SHEET_PRODUTOS_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=12345&single=true&output=csv
VITE_WHATSAPP_NUMBER=5583988592226
VITE_INSTAGRAM_HANDLE=PolygonArt_3D
```

> Alternativa: editar diretamente as URLs em [`src/config.js`](src/config.js).

## Estrutura

```
site_ryanne/
├── index.html              # entry HTML
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.js             # bootstrap Vue
    ├── App.vue             # root component (carrega o catálogo)
    ├── config.js           # ⚙️ URLs da planilha + contato
    ├── assets/
    │   └── styles.css      # estilos globais
    ├── services/
    │   └── sheets.js       # fetch + parsing de CSV
    └── components/
        ├── AppHeader.vue
        ├── HeroSection.vue
        ├── AboutSection.vue
        ├── CatalogSection.vue
        ├── ProductCard.vue
        ├── ContactSection.vue
        └── AppFooter.vue
```

## Como funciona o serviço de planilha

[`src/services/sheets.js`](src/services/sheets.js):

1. `fetchCSV(url)` — baixa o CSV via `fetch`.
2. `parseCSV(text)` — converte CSV em array de objetos (suporta aspas, vírgulas dentro de campos, BOM, `\r\n`).
3. `fetchCategorias()` / `fetchProdutos()` — normalizam os dados (parse de preço com `,`/`.`, fallback de campos em inglês).
4. `fetchCatalog()` — busca as duas abas em paralelo.

## Deploy

O projeto é totalmente estático após `npm run build`. Pode ser hospedado em:

- **Vercel** / **Netlify** — conecte o repositório, build command `npm run build`, output `dist`.
- **GitHub Pages** — sirva a pasta `dist`.
- **Cloudflare Pages** — mesmas configurações.

Lembre de configurar as variáveis `VITE_SHEET_*` no painel do provedor.
