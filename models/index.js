const sequelize = require('../sequelize');

// 🔥 IMPORTA TODOS OS MODELS
require('./User');
require('./Gasto');
require('./GastoRelatorio');
require('./ExpoToken');
require('./Perfil');
require('./RelatorioMensal');

module.exports = sequelize;