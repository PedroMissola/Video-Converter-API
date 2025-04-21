const pino = require('pino');

// Criando o logger com cores e estilo personalizado
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,  // Colorir os logs
            translateTime: 'SYS:standard',  // Data e hora no formato mais legível
            ignore: 'pid,hostname',  // Ignorar pid e hostname nos logs
            messageKey: 'message',  // A chave principal para o log
        }
    }
});

module.exports = logger;
