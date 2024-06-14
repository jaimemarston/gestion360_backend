import { DataTypes } from 'sequelize';
import { USER_ROLE } from '../utils/enums/user-role.enum.js'
import { sequelize } from '../database/db.js';

export const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  codigo: {
    type: DataTypes.STRING,

  },
  nombre: {
    type: DataTypes.STRING,
  },
  apellido: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
  },
  imgfirma: {
    type: DataTypes.STRING,
  },
  rol: {
    type: DataTypes.ENUM(Object.values(USER_ROLE)),
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
