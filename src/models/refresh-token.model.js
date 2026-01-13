import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RefreshToken = sequelize.define(
    'RefreshToken',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            field: 'user_id',
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        tokenHash: {
            field: 'token_hash',
            type: DataTypes.STRING(64), // SHA-256
            allowNull: false,
            unique: true,
        },

        expiresAt: {
            field: 'expires_at',
            type: DataTypes.DATE,
            allowNull: false,
        },

        revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        replacedByTokenId: {
            field: 'replaced_by_token_id',
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        ipAddress: {
            field: 'ip_address',
            type: DataTypes.STRING(45),
            allowNull: true,
        },

        userAgent: {
            field: 'user_agent',
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: 'refresh_tokens',
        timestamps: true,
        underscored: true,
    }
);

export default RefreshToken;
