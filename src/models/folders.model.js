import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import {  MinioFiles, FoldersUsers } from './index.js';

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
  },
}, {
    hooks: {
      beforeDestroy: async (parent, options) => {
        await MinioFiles.destroy({ where: { FolderId: parent.id }, individualHooks: true });
        await FoldersUsers.destroy({ where: { FolderId: parent.id }, individualHooks: true })
      }
    }
  }
);

