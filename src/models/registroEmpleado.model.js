import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RegistroDocumento } from './registroDocumento.model.js';

export const registroEmpleado = sequelize.define('registroEmpleado', {
  id: {
    type: DataTypes.INTEGER,
  
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
  },

  codigo: {
    type: DataTypes.STRING,
  },

  docIdentidad: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
  ndocumento: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  cargo: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  rol: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

/* registroEmpleado.hasMany(RegistroDocumento, { foreignKey: 'ndocumento' }); */
