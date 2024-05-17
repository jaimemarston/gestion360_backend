import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const RegistroCodigoReferencia = sequelize.define(
  'registroCodigoReferencia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    exonerar: {
      type: DataTypes.STRING,
      allowNull: true
    },

    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codidoc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ruc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telf: {
      type: DataTypes.STRING,
      allowNull: true
    },
    direc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apaterno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amaterno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oficta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ncuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moneban: {
      type: DataTypes.STRING,
      allowNull: true
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecnac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoafp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numafp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    feccre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecmod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    feceli: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });