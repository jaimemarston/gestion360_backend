import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Tag = sequelize.define('tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  }
});
