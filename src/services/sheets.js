/**
 * Serviço de integração com Google Sheets.
 *
 * - Busca CSV publicado das abas "categorias" e "produtos".
 * - Faz parsing de CSV (com suporte a campos entre aspas e vírgulas escapadas).
 * - Retorna dados normalizados em JSON.
 */

import { config } from '../config.js'

/* ------------------------------------------------------------------ *
 * Parser de CSV
 * Suporta: aspas duplas, vírgulas dentro de campos, "" como aspas escapadas,
 * quebras de linha em \r\n, \n ou \r.
 * ------------------------------------------------------------------ */
export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  // Remove BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)

  while (i < text.length) {
    const c = text[i]

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }

    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (c === '\r' || c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      if (c === '\r' && text[i + 1] === '\n') i += 2
      else i++
      continue
    }
    field += c
    i++
  }

  // último campo / linha
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  if (!rows.length) return []

  const headers = rows[0].map((h) => h.trim().toLowerCase())
  return rows.slice(1)
    .filter((r) => r.some((cell) => cell && cell.trim() !== ''))
    .map((r) => {
      const obj = {}
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] ?? '').trim()
      })
      return obj
    })
}

/* ------------------------------------------------------------------ *
 * Helpers de normalização
 * ------------------------------------------------------------------ */
function parsePrice(value) {
  if (value === undefined || value === null || value === '') return null
  // aceita formatos "49,90", "49.90", "R$ 49,90", "1.299,90"
  const cleaned = String(value)
    .replace(/[R$\s]/gi, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '') // remove pontos de milhar
    .replace(',', '.')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : null
}

function normalizeCategoria(raw) {
  return {
    id: String(raw.id ?? '').trim(),
    nome: String(raw.nome ?? raw.name ?? '').trim()
  }
}

function normalizeProduto(raw) {
  // Suporta `imagem_url` (legado) ou `imagem_1`, `imagem_2`, `imagem_3`
  const imagens = [
    raw.imagem_1 ?? raw.imagem1,
    raw.imagem_2 ?? raw.imagem2,
    raw.imagem_3 ?? raw.imagem3,
    raw.imagem_url ?? raw.imagem ?? raw.image
  ]
    .map((v) => String(v ?? '').trim())
    .filter(Boolean)

  // remove duplicatas mantendo a ordem
  const imagensUnicas = [...new Set(imagens)]

  return {
    id: String(raw.id ?? '').trim(),
    titulo: String(raw.titulo ?? raw.title ?? raw.nome ?? '').trim(),
    descricao: String(raw.descricao ?? raw.description ?? raw.desc ?? '').trim(),
    preco: parsePrice(raw.preco ?? raw.price),
    imagens: imagensUnicas,
    categoria_id: String(raw.categoria_id ?? raw.categoria ?? '').trim()
  }
}

/* ------------------------------------------------------------------ *
 * Fetch
 * ------------------------------------------------------------------ */
async function fetchCSV(url) {
  if (!url) {
    throw new Error(
      'URL da planilha não configurada. Edite src/config.js ou o arquivo .env.'
    )
  }
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Falha ao buscar planilha (${res.status} ${res.statusText})`)
  }
  return res.text()
}

export async function fetchCategorias() {
  const csv = await fetchCSV(config.sheets.categoriasUrl)
  return parseCSV(csv)
    .map(normalizeCategoria)
    .filter((c) => c.id && c.nome)
}

export async function fetchProdutos() {
  const csv = await fetchCSV(config.sheets.produtosUrl)
  return parseCSV(csv)
    .map(normalizeProduto)
    .filter((p) => p.id && p.titulo)
}

export async function fetchCatalog() {
  const [categorias, produtos] = await Promise.all([
    fetchCategorias(),
    fetchProdutos()
  ])
  return { categorias, produtos }
}
