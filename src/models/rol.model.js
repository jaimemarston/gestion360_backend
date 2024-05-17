import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Rol = sequelize.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rol: {
    type: DataTypes.STRING,
  },
});
