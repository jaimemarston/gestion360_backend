import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

import  MinioService from '../minio/minio.service.js';
const fileService = new MinioService();

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
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  financial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file_related: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  hooks: {
    beforeDestroy: async (parent, options) => {
      const filename = `${parent.FolderId}/${parent.filename}`;
      await fileService.deleteFile(filename, 'files');
    }
  }
});
