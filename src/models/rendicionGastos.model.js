import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RendicionGastosProducto } from './rendicionGastosProducto.model.js';

export const RendicionGastos = sequelize.define('rendicionGastos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numeroRendicion: {
    type: DataTypes.STRING,
  },
  nombreApellido: {
    type: DataTypes.STRING,
  },
  proyecto: {
    type: DataTypes.INTEGER,
  },
  lugarComision: {
    type: DataTypes.STRING,
  },
  objetoComision: {
    type: DataTypes.STRING,
  },
  fechaInicio: {
    type: DataTypes.STRING,
  },
  fechaFin: {
    type: DataTypes.STRING,
  },
  recibido: {
    type: DataTypes.STRING,
  },
  // rendido: {
  //   type: DataTypes.STRING,
  // },
  // saldo: {
  //   type: DataTypes.STRING,
  // },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

/* RendicionGastos.hasMany(RendicionGastosProducto, {
  foreignKey: 'rendicionGastosId',
  sourceKey: 'id',
});
 */