const ffmpeg = require('fluent-ffmpeg'); // IMPORTANTE!

const convertVideo = (inputPath, outputPath, logger) => {
    return new Promise((resolve, reject) => {
        logger.info(`Iniciando conversão do arquivo ${inputPath} para ${outputPath}`);

        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1280x720')
            .outputOptions('-crf 23')
            .output(outputPath)
            .on('end', () => {
                logger.info(`Conversão finalizada com sucesso: ${outputPath}`);
                resolve(outputPath);
            })
            .on('error', (err) => {
                logger.error(`Erro no ffmpeg: ${err.message}`);
                reject(err);
            })
            .run();
    });
};

module.exports = { convertVideo };
