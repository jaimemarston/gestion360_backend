import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const RegistroTipoDocumento = sequelize.define(
  'registroTipoDocumento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });