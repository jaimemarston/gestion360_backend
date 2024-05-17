import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RendicionGastosProducto } from './rendicionGastosProducto.model.js';

export const Sections = sequelize.define('Sections', {
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

Sections.sync({ force: false }); 
