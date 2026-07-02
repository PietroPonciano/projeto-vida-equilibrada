const {
    DataTypes
} = require('sequelize');
const sequelize = require('../sequelize');
const RelatorioMensal = require('./RelatorioMensal');

const GastoRelatorio = sequelize.define('GastoRelatorio', {
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    percentual: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    tipoPredominante: {
        type: DataTypes.ENUM(
            'RECORRENTE',
            'VARIAVEL',
            'OCASIONAL',
            'SAZONAL'
        ),
        allowNull: true
    },

    recomendacao: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    tableName: 'gastos_relatorios',
    timestamps: false,
});

// Relacionamento
GastoRelatorio.belongsTo(RelatorioMensal, {
    foreignKey: 'relatorioId',
    onDelete: 'CASCADE'
});

RelatorioMensal.hasMany(GastoRelatorio, {
    foreignKey: 'relatorioId'
});

module.exports = GastoRelatorio;