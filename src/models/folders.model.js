import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Folders = sequelize.define('Folders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true,
  },
  label1: {
    type: DataTypes.STRING,
  },
  label2: {
    type: DataTypes.STRING,
  },
  label3: {
    type: DataTypes.STRING,
  }
});

