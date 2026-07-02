require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const authController = require('./controllers/authController');
const extratoController = require('./controllers/extratoController');
const gastosController = require('./controllers/gastosController');
const perfilController = require('./controllers/perfilController');
const relatorioController = require('./controllers/relatorioController');
const upload = require('./middleware/upload');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API rodando',
        version: '1.0.0'
    });
});

app.get('/auth/me', authController.me);
app.post('/auth/register', authController.register);
app.post('/auth/token', authController.token);
app.post('/auth/token/refresh', authController.refresh);
app.post('/auth/token/revoke', authController.revoke);
app.post('/auth/change-password', authController.changePassword);
app.post('/auth/reset-password', authController.resetPassword);

app.get('/perfil', perfilController.getPerfil);
app.post('/perfil/confirmar-codigos', perfilController.confirmarCodigos);
app.put('/perfil/atualizar', perfilController.updatePerfil);
app.put('/perfil/desativar', perfilController.deactivatePerfil);

app.get('/gastos/mes-atual', gastosController.getGastosMesAtual);
app.get('/gastos', gastosController.listGastos);
app.post('/gastos', gastosController.createGastoManual);
app.post('/gastos/ia', gastosController.createGastoIA);
app.get('/gastos/:id', gastosController.getGasto);
app.put('/gastos/:id', gastosController.updateGasto);
app.delete('/gastos/:id', gastosController.deleteGasto);

app.post('/extrato/importar', upload.single('file'), extratoController.importarExtrato);

app.get('/relatorio', relatorioController.getRelatorio);
app.get('/relatorio/previsao', relatorioController.getPrevisao);
app.get('/relatorio/pdf/:ano/:mes', relatorioController.getRelatorioPdf);

app.use((err, req, res, next) => {
    console.error('Erro global:', err);

    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor'
    });
});

module.exports = app;