// Variáveis globais para armazenar as frases e o índice atual
let content = [];
let index = 0; // Será atualizado aleatoriamente ao carregar as frases
let previousIndex = -1; // Rastreia o índice anterior para evitar repetição

// Função para gerar um índice aleatório diferente do anterior
function getRandomIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * content.length);
    } while (randomIndex === previousIndex && content.length > 1);
    return randomIndex;
}

// Função assíncrona para carregar frases do arquivo JSON
async function loadPhrases() {
    try {
        const response = await fetch('frases.json');
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        content = await response.json();
        // Selecionar uma frase aleatória para iniciar
        index = getRandomIndex();
        previousIndex = index;
        
        const p = document.getElementById('phraseDisplay');
        const a = document.getElementById('authorDisplay');
        const icon = document.getElementById('iconDisplay');
        
        p.innerText = `"${content[index].t}"`;
        a.innerText = `— ${content[index].a}`;
        // Exibir o ícone se existir, caso contrário deixar vazio
        icon.innerText = content[index].icon || '';
    } catch (error) {
        console.error('Erro ao carregar frases:', error);
    }
}

// Carregar frases assim que o script for executado
loadPhrases();

// Função para alterar o conteúdo da frase exibida
function changeContent() {
    if (content.length === 0) return; // Ainda carregando

    const p = document.getElementById('phraseDisplay');
    const a = document.getElementById('authorDisplay');
    const icon = document.getElementById('iconDisplay');

    // Animação de fade out com slide para cima
    p.style.opacity = '0';
    p.style.transform = 'translateY(-20px)';
    a.style.opacity = '0';
    icon.style.opacity = '0';
    icon.style.transform = 'scale(0.5)';

    // Delay orgânico para trocar o conteúdo
    setTimeout(() => {
        // Selecionar uma frase aleatória (diferente da anterior)
        previousIndex = index;
        index = getRandomIndex();
        
        p.innerText = `"${content[index].t}"`;
        a.innerText = `— ${content[index].a}`;
        // Exibir o ícone se existir, caso contrário deixar vazio
        icon.innerText = content[index].icon || '';
    }, 300);

    // Delay maior para animar a entrada
    setTimeout(() => {
        // Animação de fade in com slide de baixo
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
        a.style.opacity = '1';
        icon.style.opacity = '1';
        icon.style.transform = 'scale(1)';
    }, 350);
}

// Função para gerar uma imagem da frase atual e fazer o download
function generateImageAndDownload() {
    if (content.length === 0) return; // Ainda carregando

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Validação de dados com fallbacks
    const phraseText = (content[index].t || '').replace(/"/g, '').trim();
    const authorText = content[index].a || 'Autora Desconhecida';
    const iconEmoji = content[index].icon || '🌹';

    // Criar gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f0eb');
    gradient.addColorStop(0.5, '#f0e0e8');
    gradient.addColorStop(1, '#edd5e3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adicionar círculos decorativos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(150, 150, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 180, 0, Math.PI * 2);
    ctx.fill();

    // Retângulo central para o texto
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(60, 250, canvas.width - 120, 720);

    // Borda do retângulo com cor dourada sutil
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 250, canvas.width - 120, 720);

    // Determinar tamanho da fonte baseado no comprimento da frase
    let fontSize = 46;
    if (phraseText.length > 100) {
        fontSize = 38;
    }

    // Configurar fonte e estilo para o texto da frase
    ctx.fillStyle = '#2d2d2d';
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Quebrar o texto em linhas de forma inteligente
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

    // Desenhar o ícone centralizado acima do texto
    ctx.font = '70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconEmoji, canvas.width / 2, canvas.height * 0.28);

    // Calcular startY para centralizar verticalmente o bloco de texto
    const textBlockHeight = lines.length * lineHeight;
    const baseY = canvas.height * 0.52;
    const startY = baseY - (textBlockHeight / 2);

    // Desenhar as linhas de texto centralizadas
    ctx.fillStyle = '#2d2d2d';
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
    ctx.textAlign = 'center';
    lines.forEach((line, i) => {
        const y = startY + (i * lineHeight);
        ctx.fillText(line, canvas.width / 2, y);
    });

    // Linha decorativa
    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.75);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.75);
    ctx.stroke();

    // Texto do autor
    ctx.font = 'bold 32px "Montserrat", sans-serif';
    ctx.fillStyle = '#ff4d6d';
    ctx.textAlign = 'center';
    ctx.fillText(authorText, canvas.width / 2, canvas.height * 0.83);

    // Texto informativo
    ctx.font = '20px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Essência Feminina - 8 de Março ✨', canvas.width / 2, canvas.height - 70);

    // Créditos finais
    ctx.font = '16px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('Desenvolvido por Shiroi_Crypto & Retr0', canvas.width / 2, canvas.height - 25);

    // Converter canvas para blob e fazer download
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

// Função para compartilhar no Instagram (chama generateImageAndDownload)
function shareToInsta() {
    generateImageAndDownload();
}

// Inicializar o efeito de partículas usando a biblioteca particles.js
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