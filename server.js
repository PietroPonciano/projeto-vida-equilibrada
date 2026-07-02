const sequelize = require('./models');

async function initDB() {
    try {
        await sequelize.authenticate();

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({
                alter: true
            });
        } else {
            await sequelize.sync();
        }

        console.log('Banco conectado');
    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    }
}

async function startServer(app) {
    const PORT = process.env.PORT || 3000;

    await initDB();

    return app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = {
    initDB,
    startServer
};