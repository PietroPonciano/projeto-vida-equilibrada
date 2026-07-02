const {
    DataTypes
} = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Gasto = sequelize.define('Gasto', {
    categoria: {
        type: DataTypes.ENUM(
            'Moradia',
            'Alimentação',
            'Transporte',
            'Saúde',
            'Educação',
            'Lazer',
            'Investimento',
            'Outros'
        ),
        allowNull: false
    },

    tipo: {
        type: DataTypes.ENUM(
            'RECORRENTE',
            'VARIAVEL',
            'OCASIONAL',
            'SAZONAL'
        ),
        allowNull: false
    },

    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    estabelecimento: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    dataGasto: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    dataCriacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: 'gastos',
    timestamps: false,
});

Gasto.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
User.hasMany(Gasto, {
    foreignKey: 'userId'
});

module.exports = Gasto;