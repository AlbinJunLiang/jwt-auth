import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            field: 'password_hash',
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
        },
    },
    {
        tableName: 'users',
        timestamps: true,
        underscored: true,
    }
);


export default User;
