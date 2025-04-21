const fs = require('fs');
const path = require('path');

const gerarNomeArquivo = (pastaSaida) => {
    try {
        const arquivos = fs.readdirSync(pastaSaida)
            .filter(file => file.startsWith("video_") && file.endsWith(".mp4"));

        if (arquivos.length === 0) {
            return path.join(pastaSaida, "video_001.mp4");  // Retorna o caminho completo com o nome correto do arquivo
        }

        const numeros = arquivos.map(file => {
            const match = file.match(/video_(\d+)\.mp4/);
            return match ? parseInt(match[1]) : 0;
        });

        const proximoNumero = (Math.max(...numeros, 0) + 1).toString().padStart(3, '0');
        
        return path.join(pastaSaida, `video_${proximoNumero}.mp4`);
    } catch (err) {
        console.error("Erro ao gerar nome de arquivo:", err);
        return path.join(pastaSaida, "video_001.mp4");
    }
};

module.exports = gerarNomeArquivo;