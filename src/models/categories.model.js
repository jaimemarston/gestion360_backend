import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RendicionGastosProducto } from './rendicionGastosProducto.model.js';

export const Categories = sequelize.define('Categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});
