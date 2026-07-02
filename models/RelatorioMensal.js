const {
    DataTypes
} = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const RelatorioMensal = sequelize.define('RelatorioMensal', {
    mes_referencia: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    total_gasto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    // 🔥 NOVO — previsão
    total_previsto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    // 🧠 NOVO — análise inteligente
    alerta: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // 📊 NOVO — distribuição dos tipos
    recorrente: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    variavel: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    ocasional: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    sazonal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    // 🏆 NOVO — insights rápidos
    maior_categoria: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    maior_local: {
        type: DataTypes.STRING(150),
        allowNull: true
    },

    criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: 'relatorios_mensais',
    timestamps: false,
});

RelatorioMensal.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
User.hasMany(RelatorioMensal, {
    foreignKey: 'userId'
});

module.exports = RelatorioMensal;