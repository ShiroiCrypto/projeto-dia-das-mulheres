// Variáveis globais para armazenar as frases e o índice atual
let content = [];
let index = 6; // Começar com a sétima frase, que é a exibida inicialmente no HTML

// Função assíncrona para carregar frases do arquivo JSON
async function loadPhrases() {
    try {
        const response = await fetch('frases.json');
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        content = await response.json();
        // Inicializar com a frase atual (index 6)
        const p = document.getElementById('phraseDisplay');
        const a = document.getElementById('authorDisplay');
        p.innerText = `"${content[index].t}"`;
        a.innerText = `— ${content[index].a}`;
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

    // Animação de fade out com slide para cima
    p.style.opacity = '0';
    p.style.transform = 'translateY(-20px)';
    a.style.opacity = '0';

    // Delay orgânico para trocar o conteúdo
    setTimeout(() => {
        index = (index + 1) % content.length;
        p.innerText = `"${content[index].t}"`;
        a.innerText = `— ${content[index].a}`;
    }, 300);

    // Delay maior para animar a entrada
    setTimeout(() => {
        // Animação de fade in com slide de baixo
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
        a.style.opacity = '1';
    }, 350);
}

// Função para gerar uma imagem da frase atual e fazer o download
function generateImageAndDownload() {
    if (content.length === 0) return; // Ainda carregando

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Criar gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(0.5, '#fad0c4');
    gradient.addColorStop(1, '#ffd1ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adicionar círculos decorativos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(150, 150, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 180, 0, Math.PI * 2);
    ctx.fill();

    // Retângulo central para o texto
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(60, 280, canvas.width - 120, 650);

    // Borda do retângulo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 280, canvas.width - 120, 650);

    // Configurar fonte e estilo para o texto da frase
    ctx.fillStyle = '#2d2d2d';
    ctx.font = 'italic 46px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Quebrar o texto em linhas para caber na largura máxima
    const maxWidth = canvas.width - 200;
    const lineHeight = 65;
    const phraseText = content[index].t.replace(/"/g, '').trim();
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

    // Desenhar as linhas de texto centralizadas
    const startY = canvas.height * 0.42;
    lines.forEach((line, i) => {
        const y = startY + (i * lineHeight) - ((lines.length - 1) * lineHeight / 2);
        ctx.fillText(line, canvas.width / 2, y);
    });

    // Linha decorativa
    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.78);
    ctx.lineTo(canvas.width * 0.75, canvas.height * 0.78);
    ctx.stroke();

    // Texto do autor
    ctx.font = 'bold 36px "Montserrat", sans-serif';
    ctx.fillStyle = '#ff4d6d';
    ctx.fillText(content[index].a, canvas.width / 2, canvas.height * 0.85);

    // Texto inferior
    ctx.font = '22px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Essência Feminina - 8 de Março ✨', canvas.width / 2, canvas.height - 60);

    // Créditos
    ctx.font = '16px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillText('Desenvolvido por Shiroi_Crypto & Retr0', canvas.width / 2, canvas.height - 20);

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