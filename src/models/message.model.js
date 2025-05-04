import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/database.js';

export class Message extends Model{};


Message.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'message'
});