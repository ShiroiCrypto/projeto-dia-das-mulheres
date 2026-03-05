# 🌸 Essência Feminina - Dia das Mulheres

Site interativo para o **Dia Internacional da Mulher (08/03)**, exibido em TV no SENAI. SPA que consome frases de `frases.json`, permite gerar imagens para Instagram e oferece experiência diferenciada em Desktop (Modo TV) e Mobile.

![Essência Feminina](https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200)

**URL oficial:** [https://projeto-dia-das-mulheres-tan.vercel.app](https://projeto-dia-das-mulheres-tan.vercel.app)

---

## ✨ Funcionalidades

- **Citações inspiradoras** — Dezenas de frases de mulheres icônicas, carregadas de `frases.json`
- **Modo TV (Desktop)** — Ciclo automático a cada 90 segundos; botão Pausar/Retomar no topo
- **QR Code dinâmico** — Em telas grandes, QR no canto inferior apontando para a URL da frase atual (`?id=INDEX`), atualizado a cada troca
- **Deep linking** — Acesso direto por URL: `?id=0`, `?id=1`, etc. Ao escanear o QR na TV, o celular abre a mesma frase
- **Experiência por dispositivo** — Desktop: ciclo ativo + QR + botão Modo TV; Mobile: só card + botões, navegação manual
- **Compartilhamento no Instagram** — Geração e download de imagem da frase atual para postar
- **Design** — Glassmorphism, partículas, animações e tema em rosa/dourado

---

## 🚀 Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Variáveis, animações, media queries (Desktop vs Mobile)
- **JavaScript (ES6+)** — Carregamento de frases, ciclo automático, deep linking, QR dinâmico, html2canvas
- **Particles.js** — Partículas no fundo
- **html2canvas** — Geração da imagem para Instagram
- **API QR** — [api.qrserver.com](https://api.qrserver.com) para QR Code
- **Google Fonts** — Cinzel, Montserrat, Playfair Display
- **Font Awesome** — Ícones

---

## 📁 Estrutura

```
projeto-dia-das-mulheres/
├── index.html      # Página principal (card, botões, QR, controles TV)
├── style.css       # Estilos, responsivo, Modo TV e QR só em desktop
├── index.js        # Lógica: frases, ciclo 90s, deep link, QR, download Instagram
├── frases.json     # Citações (t, a, icon)
├── README.md
└── LICENSE
```

---

## 🎨 Como usar

- **Desktop (TV/PC):** O ciclo de 90s inicia sozinho. Use "Pausar ciclo" / "Retomar ciclo" no topo. O QR Code mostra o link da frase atual; ao escanear no celular, abre a mesma frase.
- **Mobile:** Sem ciclo automático. Use "Nova Inspiração" para trocar a frase e "Postar no Instagram" para gerar a imagem.
- **Link com ID:** Abrir `https://projeto-dia-das-mulheres-tan.vercel.app/?id=5` exibe a frase de índice 5 e não inicia o ciclo (ideal para quem veio do QR).

---

## 🌐 Deploy

Projeto hospedado na **Vercel**. A URL oficial é usada no QR Code para que o celular sempre abra o site em produção com o parâmetro `?id=INDEX`.

---

## 👩‍💻 Autores

- [**Shiroi_Crypto**](https://github.com/ShiroiCrypto)
- [**Retr0**](https://github.com/Retr0DedSec0)

---

## 📄 Licença

Este projeto está sob a licença MIT. Ver [LICENSE](LICENSE).

*Celebrando a essência feminina em cada linha de código! 💖*
