import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'otp_codes',
    timestamps: true,
    underscored: true,
}

);

export default PasswordResetToken;
