const express = require('express');
const { errorHandler } = require('./middlewares/errorHandler');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const app = express();

app.use(express.json());
app.use(usuarioRoutes);
app.use(authRoutes);
app.use(agendamentoRoutes);
app.use(errorHandler);

module.exports = app;
