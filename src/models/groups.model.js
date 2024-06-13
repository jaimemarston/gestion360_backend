import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Folders } from './index.js';

export const Groups = sequelize.define('Groups', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
    hooks: {
      beforeDestroy: async (parent, options) => {
        await Folders.destroy({ where: { GroupId: parent.id }, individualHooks: true });
      }
    }
  }
);
