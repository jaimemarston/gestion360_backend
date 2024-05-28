import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Usuario, Folders } from './index.js';

export const FoldersUsers = sequelize.define('FoldersUsers', {
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  FolderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Folders,
      key: 'id'
    }
  }
});

