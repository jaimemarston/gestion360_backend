import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const RegistroProyecto = sequelize.define('registroProyecto', {
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
  nombreAbreviado: {
    type: DataTypes.STRING,
  },
  nombreCompleto: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});
