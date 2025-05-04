import 'dotenv/config';
import { sequelize } from '../config/database.js';
import { Event, Label, Message, Role, User} from "../models/associations.js";
// Drop all tables if they exist in the database
await sequelize.drop();
// Synchronize all defined models to the database, creating the tables if they do not exist
await sequelize.sync();

console.log('Synchronisation terminée');
// Close the database connection
await sequelize.close();