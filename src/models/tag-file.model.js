import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Tag, MinioFiles } from './index.js';

export const TagFile = sequelize.define('tagfile', {
  tagId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: Tag,
      key: 'id'
    }
  },
  minioFileId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: MinioFiles,
      key: 'id'
    }
  },
});
