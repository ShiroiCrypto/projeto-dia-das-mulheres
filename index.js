// Variáveis globais para armazenar as frases e o índice atual
let content = [];
let index = 0;
let previousIndex = -1;

// Modo TV: ativação única; ciclo de 90s; botão some; só F5 restaura
const TV_INTERVAL_MS = 90 * 1000;
let tvInterval = null;

// URL base oficial (QR Code sempre aponta para ela)
const BASE_URL = 'https://projeto-dia-das-mulheres-tan.vercel.app';

// Detecção de dispositivo: Desktop (TV/PC) = ciclo ativo; Mobile = apenas manual
const DESKTOP_BREAKPOINT = 1024;
function isDesktop() {
    return typeof window !== 'undefined' && window.innerWidth > DESKTOP_BREAKPOINT;
}

// URL da frase atual para pushState (mantém origem da página)
function getCurrentPhraseUrl() {
    const base = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin + window.location.pathname
        : BASE_URL;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}id=${index}`;
}

// URL completa oficial para o QR Code (celular abre sempre o site em produção)
function getQRCodeUrl() {
    return `${BASE_URL}/?id=${index}`;
}

// Lê o parâmetro id da URL (0-based)
function getIdFromUrl() {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id === null || id === '') return null;
    const num = parseInt(id, 10);
    return Number.isNaN(num) ? null : num;
}

// Atualiza a URL sem recarregar (deep linking)
function updateUrlWithId() {
    if (typeof window === 'undefined') return;
    const url = getCurrentPhraseUrl();
    window.history.pushState({ index }, '', url);
}

// Atualiza a imagem do QR Code (sempre URL oficial com ?id=INDEX)
function updateQRCode() {
    const img = document.getElementById('qrImage');
    const container = document.getElementById('qrContainer');
    if (!img || !content.length) return;
    const url = getQRCodeUrl();
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
    img.alt = `QR Code para a frase ${index + 1}`;
    if (container) {
        container.classList.add('ready');
        container.setAttribute('aria-label', `QR Code para esta frase: ${(content[index] && content[index].t) ? content[index].t.substring(0, 50) + '…' : ''}`);
    }
}

// Função para gerar um índice aleatório diferente do anterior
function getRandomIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * content.length);
    } while (randomIndex === previousIndex && content.length > 1);
    return randomIndex;
}

// Aplica uma frase pelo índice na UI (sem trocar URL; usado na inicialização e no ciclo)
function applyPhraseToUI(idx) {
    if (!content[idx]) return;
    const p = document.getElementById('phraseDisplay');
    const a = document.getElementById('authorDisplay');
    const icon = document.getElementById('iconDisplay');
    if (p) p.innerText = `"${content[idx].t}"`;
    if (a) a.innerText = `— ${content[idx].a}`;
    if (icon) icon.innerText = content[idx].icon || '';
}

// Carregar frases e decidir índice inicial; retorna true se veio de deep link (?id=)
async function loadPhrases() {
    try {
        const response = await fetch('frases.json');
        if (!response.ok) throw new Error('Erro na resposta da rede');
        content = await response.json();
        if (!content.length) return false;

        const urlId = getIdFromUrl();
        const fromDeepLink = urlId !== null && urlId >= 0 && urlId < content.length;

        if (fromDeepLink) {
            index = urlId;
        } else {
            index = getRandomIndex();
        }
        previousIndex = index;

        applyPhraseToUI(index);
        updateUrlWithId();
        updateQRCode();
        return fromDeepLink;
    } catch (error) {
        console.error('Erro ao carregar frases:', error);
        return false;
    }
}

// Ativa o Modo TV: adiciona .tv-mode, inicia ciclo de 90s, remove o botão. Só F5 restaura.
function activateTVMode() {
    document.body.classList.add('tv-mode');
    tvInterval = setInterval(() => changeContent(), TV_INTERVAL_MS);
    const controls = document.querySelector('.tv-controls');
    if (controls) controls.remove();
}

// Função para alterar o conteúdo da frase exibida (nova frase + URL + QR)
// No Modo TV usa transição de 1s; fora dele usa ~300ms
function changeContent() {
    if (content.length === 0) return;

    const p = document.getElementById('phraseDisplay');
    const a = document.getElementById('authorDisplay');
    const icon = document.getElementById('iconDisplay');
    const isTvMode = document.body.classList.contains('tv-mode');
    const delayOut = isTvMode ? 1000 : 300;
    const delayIn = isTvMode ? 1050 : 350;

    p.style.opacity = '0';
    p.style.transform = 'translateY(-20px)';
    a.style.opacity = '0';
    icon.style.opacity = '0';
    icon.style.transform = 'scale(0.5)';

    setTimeout(() => {
        previousIndex = index;
        index = getRandomIndex();

        if (p) p.innerText = `"${content[index].t}"`;
        if (a) a.innerText = `— ${content[index].a}`;
        if (icon) icon.innerText = content[index].icon || '';

        updateUrlWithId();
        updateQRCode();
    }, delayOut);

    setTimeout(() => {
        if (p) {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }
        if (a) a.style.opacity = '1';
        if (icon) {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }
    }, delayIn);
}

// Retorna o objeto da frase atual (sempre consistente com a UI)
function getCurrentPhrase() {
    if (!content.length || content[index] == null) return null;
    return content[index];
}

// Gera imagem da frase atual e faz download (usa dados atuais; créditos Shiroi_Crypto & Retr0)
function generateImageAndDownload() {
    const phrase = getCurrentPhrase();
    if (!phrase) {
        alert('Nenhuma frase carregada. Tente novamente em instantes.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    const phraseText = (phrase.t || '').replace(/"/g, '').trim();
    const authorText = phrase.a || 'Autora Desconhecida';
    const iconEmoji = phrase.icon || '🌹';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f0eb');
    gradient.addColorStop(0.5, '#f0e0e8');
    gradient.addColorStop(1, '#edd5e3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(150, 150, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(60, 250, canvas.width - 120, 720);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 250, canvas.width - 120, 720);

    let fontSize = 46;
    if (phraseText.length > 100) fontSize = 38;

    ctx.fillStyle = '#2d2d2d';
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxWidth = canvas.width - 200;
    const lineHeight = 55;
    const words = phraseText.split(' ');
    let lines = [];
    let currentLine = '';
    for (let word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    ctx.font = '70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconEmoji, canvas.width / 2, canvas.height * 0.28);

    const textBlockHeight = lines.length * lineHeight;
    const baseY = canvas.height * 0.52;
    const startY = baseY - (textBlockHeight / 2);

    ctx.fillStyle = '#2d2d2d';
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
    ctx.textAlign = 'center';
    lines.forEach((line, i) => {
        const y = startY + (i * lineHeight);
        ctx.fillText(line, canvas.width / 2, y);
    });

    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.75);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.75);
    ctx.stroke();

    ctx.font = 'bold 32px "Montserrat", sans-serif';
    ctx.fillStyle = '#ff4d6d';
    ctx.textAlign = 'center';
    ctx.fillText(authorText, canvas.width / 2, canvas.height * 0.83);

    ctx.font = '20px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Essência Feminina - 8 de Março ✨', canvas.width / 2, canvas.height - 70);

    // Créditos na base da imagem: texto simples (Shiroi_Crypto & Retr0)
    ctx.font = '16px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('Desenvolvido por Shiroi_Crypto & Retr0', canvas.width / 2, canvas.height - 25);

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `essencia-feminina-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('✨ Imagem pronta! ✨\n\nAbra seu Instagram e compartilhe!');
    });
}

function shareToInsta() {
    generateImageAndDownload();
}

// Inicialização: carregar frases; Modo TV só ativa ao clicar no botão (depois só F5 restaura)
window.addEventListener('load', () => {
    loadPhrases().then(() => {
        updateQRCode();
        const btnTvMode = document.getElementById('btnTvMode');
        if (btnTvMode) btnTvMode.addEventListener('click', activateTVMode);
    });

    // Popstate: quando o usuário volta/avança no histórico, aplicar o id da URL
    window.addEventListener('popstate', (e) => {
        if (e.state && typeof e.state.index === 'number' && content[e.state.index] != null) {
            index = e.state.index;
            previousIndex = index;
            applyPhraseToUI(index);
            updateQRCode();
        }
    });
});

// Inicializar partículas (DOM já disponível - script no final do body)
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80 },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 3, "random": true },
        "move": { "enable": true, "speed": 1, "direction": "top" }
    }
});
