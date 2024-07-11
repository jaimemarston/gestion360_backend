import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { UserGroup, Usuario } from './index.js';

export const User_Group = sequelize.define('user_group', {
  usergroupId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: UserGroup,
      key: 'id'
    }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
});
