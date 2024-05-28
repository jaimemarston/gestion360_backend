import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Groups = sequelize.define('Groups', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});

