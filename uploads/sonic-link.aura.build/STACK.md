# Stack

- **Tailwind CSS 3.4.17** — framework CSS utility-first carregado via runtime CDN, responsável por todo o layout e estilização das classes.
- **Lucide** — biblioteca de ícones; os ícones de interface (menu, sparkles, cpu, layers, music, etc.) são renderizados via `<i data-lucide>`.
- **Iconify** (`iconify-icon` web component) — segunda biblioteca de ícones; usada para os ícones do conjunto `solar:*` (headphones, soundwave, check-circle, chat-round-line e outros).
- **GSAP 3.12.5** — motor de animação que orquestra a timeline cinematográfica do filme de introdução Pulsewave na seção hero.
- **OGL** — biblioteca WebGL minimalista (importada como módulo ES de esm.sh) que renderiza o fundo animado em formato de prisma raymarcheado.
- **WebGL** — usado diretamente (fora do OGL) para o shader de formas de onda do `#webglLayer` na seção hero.
- **Canvas 2D API** — desenha as animações decorativas dos cards de arquitetura (anéis hexagonais, traços de circuito e fragmentos orbitais).
- **Inter** — fonte principal do corpo do texto (Google Fonts).
- **JetBrains Mono** — fonte monoespaçada aplicada à classe utilitária `.font-mono`.
- **Barlow Condensed** — fonte condensada usada nos títulos cinematográficos da seção hero (referenciada via CSS inline, com fallback para Impact).
