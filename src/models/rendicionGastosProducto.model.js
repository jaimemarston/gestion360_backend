import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const RendicionGastosProducto = sequelize.define(
  'rendicionGastosProducts',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.STRING,
    },
    rendicionGastosId: {
      type: DataTypes.INTEGER,
    },
    serie: {
      type: DataTypes.STRING,
    },
    numero: {
      type: DataTypes.INTEGER,
    },
    tipo: {
      type: DataTypes.INTEGER,
    },
    ruc: {
      type: DataTypes.STRING,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    partidaPresupuestal: {
      type: DataTypes.STRING,
    },
    importe: {
      type: DataTypes.DECIMAL(10, 2),
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }
);
