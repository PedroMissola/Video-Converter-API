const cors = require('cors');

// Middleware para configurar CORS
const configureCors = cors({
    origin: "*",  // Permitir todas as origens
    methods: ['GET', 'POST'],  // Permitir apenas métodos GET e POST
});

module.exports = configureCors;
