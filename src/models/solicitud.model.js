import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { RegistroProyecto } from './registroProyecto.model.js';
import { SolicitudProducto } from './solicitudProducto.model.js';

export const Solicitud = sequelize.define('solicitudes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numeroSolicitud: {
    type: DataTypes.STRING,
  },
  fechaRegistro: {
    type: DataTypes.STRING,
  },
  nombre: {
    type: DataTypes.STRING,
  },
  nombreProyecto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  lugarComision: {
    type: DataTypes.STRING,
  },
  itinerarioTransporte: {
    type: DataTypes.STRING,
  },
  objetoComision: {
    type: DataTypes.STRING,
  },
  fechaInicio: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  fechaFin: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

 Solicitud.hasMany(SolicitudProducto, {
  foreignKey: 'solicitudId',
  sourceKey: 'id',
});

/*
Solicitud.hasMany(RegistroProyecto); */


// SolicitudProducto.belongsTo(Solicitud, {
//   foreignKey: 'solicitudId',
//   targetId: 'id',
// });
