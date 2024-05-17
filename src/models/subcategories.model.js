import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RendicionGastosProducto } from './rendicionGastosProducto.model.js';

export const Subcategories = sequelize.define('Subcategories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
});

Subcategories.sync({ force: false }); 
