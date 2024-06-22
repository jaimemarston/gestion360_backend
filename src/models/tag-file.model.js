import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Tag, MinioFiles } from './index.js';

export const TagFile = sequelize.define('tagfile', {
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: 'id'
    }
  },
  fileId: {
    type: DataTypes.INTEGER,
    references: {
      model: MinioFiles,
      key: 'id'
    }
  },
});
