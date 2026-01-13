import sequelize from '../config/database.js';
import RefreshToken from './refresh-token.model.js';
import PasswordResetToken from './reset-password.model.js';
import User from './user.model.js';

// Relaciones User ↔ RefreshToken
User.hasMany(RefreshToken, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});


User.hasMany(PasswordResetToken, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});


RefreshToken.belongsTo(User, {
  foreignKey: 'user_id',
});

// Auto-relación para rotación (self-reference)
RefreshToken.belongsTo(RefreshToken, {
  as: 'replacedBy',
  foreignKey: 'replaced_by_token_id',
});

const db = {
  sequelize,
  User,
  RefreshToken,

};

export default db;
