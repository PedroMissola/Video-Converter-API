const fs = require('fs');
const path = require('path');

const verificarEcriarPasta = (pasta) => {
    if (!fs.existsSync(pasta)) {
        console.log(`A pasta ${pasta} não existe. Criando...`);
        fs.mkdirSync(pasta, { recursive: true });
    }
};

const salvarArquivo = (inputPath, outputFolder) => {
    verificarEcriarPasta(outputFolder);

    const nomeArquivo = path.basename(inputPath);
    const outputPath = path.join(outputFolder, nomeArquivo);

    fs.copyFileSync(inputPath, outputPath);

    return outputPath;
};

module.exports = {
    verificarEcriarPasta,
    salvarArquivo
};
