// app.js
// Servidor Express ta imitando a funçaõ do (app.py), pronto fiz isso pra ajudar vcs seus bostas.
'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json()); // para requisições JSON
app.use(express.urlencoded({ extended: true })); // para formulários
app.use(express.static(path.join(__dirname, 'public'))); // arquivos estáticos

// Rota principal (equivalente a rota raiz do app.py)
app.get('/', (req, res) => {
  res.type('text/plain').send('Olá, mundo!');
});

// Rota de status
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Exemplo de rota POST que ecoa dados enviados (formulário ou JSON)
app.post('/submit', (req, res) => {
  const payload = {
    body: req.body,
    params: req.params,
    query: req.query,
    receivedAt: new Date().toISOString(),
  };
  res.json(payload);
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Inicialização do servidor
const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

module.exports = app;