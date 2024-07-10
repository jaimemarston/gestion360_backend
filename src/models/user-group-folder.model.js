import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { UserGroup, Folders } from './index.js';

export const Usergroup_Folder = sequelize.define('usergroup_folder', {
  usergroupId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: UserGroup,
      key: 'id'
    }
  },
  FolderId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: Folders,
      key: 'id'
    }
  },
});
