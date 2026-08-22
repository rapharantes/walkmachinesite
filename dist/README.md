# Site Banda Walkmachine

Site estático. Para publicar:

    vercel deploy --prod

Estrutura:
- `index.html` — página (formato Claude Design `.dc.html`, roda no navegador via `support.js`)
- `assets/` — fotos dos músicos, logos de clientes, fotos de show
- `vendor/` — React + Babel servidos localmente (sem CDN externo)
- `support.js`, `image-slot.js`, `prism-background.js`, `gsap.min.js` — runtime

Os vídeos vêm da playlist do YouTube `PL9vMcH7Da0ZBAPhJgGoynAlzgNT56qkUK`.
Para trocar os vídeos, edite o array `videos` no final do `index.html`.
