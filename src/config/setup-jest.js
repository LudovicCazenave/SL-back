
import { sequelize } from "./database.js";
import { User } from '../models/user.model.js';
import argon2 from 'argon2';

beforeEach(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await argon2.hash('Cl@ude1958!');
  await User.create({
    gender: 'Homme',
    firstname: 'Claude',
    slug: 'claude',
    email: 'claude65@example.com', 
    password: hashedPassword, 
    city: 'TOULOUSE', 
    smoker: false, 
    pet: true, 
    description: 'Enthousiaste de photographie.', 
    height: 180, 
    age: 67, 
    music: 'Rock', 
    zodiac: 'Balance', 
    gender_match: 'Femme', 
    marital: 'Divorcé'
  });
});

afterAll(async () => {
  await sequelize.close();
});