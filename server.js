const express = require('express');
const path = require('path');
const logger = require('./src/config/logger');
const cors = require('./src/middlewares/cors');
const convertRoute = require('./src/routes/convertRoute');

const app = express();
const port = 3030;

// Configuração do CORS
app.use(cors);

app.use('/javascript', express.static(path.join(__dirname, 'public/javascript'), (req, res, next) => {
    // Definir header MIME type correto para módulos JavaScript
    if (path.extname(req.path) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para '/uploads' se os arquivos estiverem na pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(convertRoute);

// Rota principal para servir o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    logger.info(`Servidor rodando em http://127.0.0.1:${port}`);
});