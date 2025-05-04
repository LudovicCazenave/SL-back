import { Model, DataTypes } from "sequelize";
import { sequelize } from '../config/database.js';

export class Event extends Model{};

Event.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  street_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  zip_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'event'
});