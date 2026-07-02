// models/Perfil.js
const {
    DataTypes
} = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

function generateCode() {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

const Perfil = sequelize.define('Perfil', {
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    aceitou_termos: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    recovery_code_1: {
        type: DataTypes.STRING(6),
        defaultValue: generateCode
    },
    recovery_code_2: {
        type: DataTypes.STRING(6),
        defaultValue: generateCode
    },
    codigos_exibidos: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Novos campos para comparação de gastos
    diff_valor_mensal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Diferença nominal entre o mês atual e o anterior'
    },
    diff_percentual_mensal: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        comment: 'Diferença percentual entre o mês atual e o anterior'
    },
}, {
    tableName: 'perfis',
    timestamps: false,
});

Perfil.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
User.hasOne(Perfil, {
    foreignKey: 'userId'
});

module.exports = Perfil;