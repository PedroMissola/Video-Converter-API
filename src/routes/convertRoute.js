const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertVideo } = require('../services/ffmpegService');
const logger = require('../config/logger');

const router = express.Router();

const outputDirectory = path.resolve('public/uploads');

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, outputDirectory);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Gera um nome de saída sequencial
function gerarNomeDeSaida(index) {
    const arquivos = fs.readdirSync(outputDirectory)
        .filter(file => file.startsWith('video_') && file.endsWith('.mp4'));

    const numeros = arquivos.map(file => {
        const match = file.match(/video_(\d+)\.mp4/);
        return match ? parseInt(match[1]) : 0;
    });

    const baseNumero = Math.max(...numeros, 0);
    const numeroAtual = (baseNumero + index + 1).toString().padStart(3, '0');
    return `video_${numeroAtual}.mp4`;
}

router.post("/convert", upload.array("files", 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const inputPath = file.path;
            const outputName = gerarNomeDeSaida(i);
            const outputPath = path.join(outputDirectory, outputName);

            logger.info(`Arquivo recebido: ${inputPath}`);
            logger.info(`Iniciando conversão para: ${outputPath}`);

            if (!fs.existsSync(inputPath)) {
                throw new Error(`Arquivo de entrada não encontrado: ${inputPath}`);
            }

            await convertVideo(inputPath, outputPath, logger);

            results.push({
                original: file.originalname,
                fileUrl: `http://localhost:3030/uploads/${outputName}`,
                nome: outputName
            });
        }

        res.json({
            message: "Conversões concluídas",
            fileUrls: results.map(result => result.fileUrl)
        });        

    } catch (error) {
        logger.error('Erro durante a conversão múltipla', error);
        res.status(500).json({ error: "Erro durante a conversão", details: error.message });
    }
});

module.exports = router;
