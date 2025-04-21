# Video Converter API

## Descrição

O **Video Converter API** é uma aplicação simples construída em **Node.js** usando **Express** para oferecer um serviço de conversão de vídeos. A API permite que usuários façam upload de arquivos de vídeo, convertam-nos para o formato `.mp4` e façam o download dos arquivos convertidos diretamente através de URLs geradas.

A API usa **ffmpeg** para realizar a conversão de vídeos e **Multer** para gerenciar uploads de arquivos. A conversão é realizada em segundo plano e, ao final, o usuário recebe links para baixar os vídeos convertidos.

### Funcionalidades

- **Conversão de múltiplos vídeos**: A API suporta conversão de até 10 arquivos simultaneamente.
- **Conversão para o formato MP4**: Utiliza o codec `libx264` para vídeo e `aac` para áudio.
- **Suporte a uploads grandes**: A aplicação permite uploads de vídeos de grande porte com um limite configurável.
- **Links para download**: Após a conversão, são gerados links de download para os arquivos convertidos.

[![License](https://img.shields.io/github/license/PedroMissola/video-converter-api)](LICENSE)
[![Commits](https://img.shields.io/github/commits-since/PedroMissola/video-converter-api/latest)](https://github.com/SeuUsuario/video-converter-api/commits)
[![Activity](https://img.shields.io/github/last-commit/PedroMissola/video-converter-api)](https://github.com/SeuUsuario/video-converter-api/commits)

---

## Requisitos

Antes de rodar a aplicação, você precisará ter o seguinte instalado:

- **Node.js** (versão 14 ou superior)
- **ffmpeg** (para realizar as conversões de vídeo)
- **npm** ou **yarn**

---

## Como Rodar

### 1. Clone o Repositório

Clone este repositório para a sua máquina local.

```bash
git clone https://github.com/SeuUsuario/video-converter-api.git
cd video-converter-api
```

### 2. Instale as Dependências

Instale as dependências necessárias.

```bash
npm install
```

### 3. Instale o FFmpeg

Certifique-se de que o **ffmpeg** esteja instalado em sua máquina. Caso não tenha, você pode seguir as instruções no site oficial: [FFmpeg Downloads](https://ffmpeg.org/download.html).

No Linux, você pode usar o comando:

```bash
sudo apt-get install ffmpeg
```

### 4. Inicie o Servidor

Após a instalação das dependências, inicie o servidor com o comando:

```bash
npm start
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

### 5. Enviar Vídeos para Conversão

Use a seguinte API para enviar arquivos de vídeo para conversão.

**Endpoint:** `POST /convert`

#### Exemplo de requisição com cURL

```bash
curl -X POST -F "files=@seuarquivo.mp4" http://localhost:3000/convert
```

#### Exemplo de resposta

```json
{
  "message": "Conversões concluídas",
  "fileUrls": [
    "http://localhost:3000/uploads/video_001.mp4",
    "http://localhost:3000/uploads/video_002.mp4"
  ]
}
```

### 6. Baixar os Arquivos Convertidos

Os links de download serão fornecidos na resposta da API. Clique no link para baixar os arquivos convertidos.

---

## Estrutura do Projeto

Abaixo está a estrutura de diretórios do projeto:

```
/video-converter-api
  /src
    /config
    /middlewares
    /routes
    /services
  /public
    /uploads
  app.js
  package.json
  README.md
```

---

## Códigos Relevantes

### 1. Configuração do Express e Upload de Arquivos

No arquivo `server.js`:

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertVideo } = require('./services/ffmpegService');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Definir o diretório para uploads
const outputDirectory = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, outputDirectory),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`);
    }
});

const upload = multer({ storage });

// Rota para conversão
app.post('/convert', upload.array('files', 10), async (req, res) => {
    // Conversão e resposta
});
```

### 2. Serviço de Conversão de Vídeo

No arquivo `ffmpegService.js`:

```javascript
const ffmpeg = require('fluent-ffmpeg');

const convertVideo = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1280x720')
            .outputOptions('-crf 23')
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .run();
    });
};

module.exports = { convertVideo };
```

---

## Linguagens e Tecnologias

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![FFmpeg](https://shields.io/badge/FFmpeg-%23171717.svg?logo=ffmpeg&style=for-the-badge&labelColor=171717&logoColor=5cb85c)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contribuição

Se você deseja contribuir para o projeto, siga os seguintes passos:

1. Faça um fork deste repositório.
2. Crie uma nova branch para a sua feature (`git checkout -b feature/nova-feature`).
3. Realize suas mudanças e faça o commit (`git commit -am 'Adicionando nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nova-feature`).
5. Abra um pull request.

---

## Agradecimentos

Este projeto foi desenvolvido para fornecer uma solução simples e eficiente para a conversão de vídeos usando tecnologias populares como **Node.js**, **Express**, e **FFmpeg**.
