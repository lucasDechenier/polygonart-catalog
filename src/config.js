/**
 * Configuração central do catálogo.
 *
 * Valores podem vir de variáveis de ambiente (`.env` na raiz) ou
 * ser editados diretamente neste arquivo.
 *
 * Para usar o Google Sheets:
 *  1. No Google Sheets: Arquivo > Compartilhar > Publicar na web
 *  2. Selecione a aba e o formato "Valores separados por vírgula (.csv)"
 *  3. Copie a URL gerada e cole abaixo (uma para cada aba).
 */

export const config = {
  sheets: {
    categoriasUrl:
      import.meta.env.VITE_SHEET_CATEGORIAS_URL ||
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvFXczpJ-0Xq4jxy7izyyvIuKI48uirDnljyxatrAGnXflTmMSFg_QrSDdeawOJZR5Y_9MfPsU4eiS/pub?gid=440715687&single=true&output=csv',
    produtosUrl:
      import.meta.env.VITE_SHEET_PRODUTOS_URL ||
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvFXczpJ-0Xq4jxy7izyyvIuKI48uirDnljyxatrAGnXflTmMSFg_QrSDdeawOJZR5Y_9MfPsU4eiS/pub?gid=0&single=true&output=csv'
  },

  contact: {
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '5583988592226',
    instagram: import.meta.env.VITE_INSTAGRAM_HANDLE || 'polygonart_3d',
    instagramUrl:
      import.meta.env.VITE_INSTAGRAM_URL ||
      'https://www.instagram.com/polygonart_3d?igsh=MWNiazFxMjNibnljaA%3D%3D'
  },

  brand: {
    name: 'PolygonArt_3D',
    tagline: 'Acessórios gamer em impressão 3D'
  }
}
