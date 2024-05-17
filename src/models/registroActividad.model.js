import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const RegistroActividad = sequelize.define('registroActividad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombreApellido: {
    type: DataTypes.STRING,
  },
  destino: {
    type: DataTypes.STRING,
  },
  fechaInicio: {
    type: DataTypes.STRING,
  },
  fechaFin: {
    type: DataTypes.STRING,
  },
  objetoComision: {
    type: DataTypes.STRING,
  },
  detalleActividad: {
    type: DataTypes.STRING,
  },
  otros: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
