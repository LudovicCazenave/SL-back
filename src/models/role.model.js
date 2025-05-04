import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/database.js';

export class Role extends Model{};


Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'role'
});