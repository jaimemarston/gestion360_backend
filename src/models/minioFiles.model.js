import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const MinioFiles = sequelize.define('minioFiles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true,
  },
  filename: {
    type: DataTypes.STRING,
  },
  mimetype: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.JSON,
  },
});
