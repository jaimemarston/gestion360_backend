import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const UserGroup = sequelize.define('usergroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
});

