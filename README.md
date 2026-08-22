# Banda Walkmachine — Website Oficial

Repositório oficial do site da **Banda Walkmachine** (Rock & Pop em Belo Horizonte - MG).

## 🎸 Sobre o Projeto

Site oficial com design moderno, dinâmico e responsivo, incluindo:
- Apresentação da banda, histórico e repertório.
- Formatos de show: Duo Acústico, Trio e Banda Completa.
- Galeria de fotos e shows.
- Integração com vídeos e playlists do YouTube.
- Contato direto para orçamentos e eventos.

## 📁 Estrutura do Projeto

- **`dist/`**: Pasta de publicação / produção (pronta para deploy no Vercel ou qualquer servidor estático).
  - `index.html`: Página principal da banda.
  - `assets/`: Imagens otimizadas (shows, músicos, logos de clientes).
  - `vendor/`: Dependências locais (React, ReactDOM, Babel).
  - `vercel.json`: Configurações de rotas e headers para a Vercel.
- **`assets/`**: Materiais gráficos e banners em alta definição.
- **`uploads/`**: Documentos de apoio, riders e materiais de design.

## 🚀 Como Publicar / Fazer Deploy

O deploy da pasta de produção pode ser feito via Vercel CLI:

```bash
cd dist
vercel --prod
```
