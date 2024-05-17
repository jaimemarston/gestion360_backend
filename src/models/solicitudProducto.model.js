import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const SolicitudProducto = sequelize.define('solicitud_productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
});
