const {
    DataTypes
} = require('sequelize');
const sequelize = require('../sequelize');

const ExpoToken = sequelize.define('ExpoToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }

}, {
    tableName: 'expo_tokens',
    timestamps: false
});

module.exports = ExpoToken;