import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const LugarComision = sequelize.define('lugarComision', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING,
    unique:true,
    primaryKey: true,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
