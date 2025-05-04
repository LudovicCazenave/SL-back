
import 'dotenv/config';
import { sequelize } from '../config/database.js';
import { User, Event, Role, Label, Message } from '../models/associations.js';

console.log("🔄 Seeding started...");

// Creation of Labels
const labels = await Label.bulkCreate([
  { name: 'Nature' },
  { name: 'Culturel' },
  { name: 'Artistique' },
  { name: 'Jeux de société' },
  { name: 'Soirée à thème' },
  { name: 'Sports/bien-être' }
]);

// Creation of Roles
const roles = await Role.bulkCreate([
  { name: 'Admin' },
  { name: 'User' },
]);

// Batch creation of Users
const users = await User.bulkCreate([

  { gender: 'Homme', firstname: 'Jean', slug: 'jean', email: 'jean60@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$9jPB1sdp+uzfVrtyBBazwA$/XzgZBVouI1UOJb3z/N/VjOWL/9+/YRRjos5SEa2iX8', city: 'PARIS', smoker: false, pet: true, description: 'Passionné de jardinage et de cuisine.', height: 175, age: 62, music: 'Jazz', zodiac: 'Gémeaux', gender_match: 'Femme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Femme', firstname: 'Marie', slug: 'marie',email: 'marie62@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$7SqEYqmA5pKorefGaq7K4Q$V6xEnKseeMcGj1QuIzHxycRjraFoDVurJn1nPkLMrL4', city: 'LYON', smoker: true, pet: false, description: 'Aime les randonnées en montagne.', height: 160, age: 65, music: 'Classique', zodiac: 'Taureau', gender_match: 'Homme', marital: 'Veuve', role_id: 2 },
  { gender: 'Homme', firstname: 'Claude', slug: 'claude',email: 'claude65@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$4/eboGTFKLOdH6DEMce3ig$o0B4zoFiBXoKFNOv9Yo1Ugv5pFXU7jD2EW9eU0DbA44', city: 'TOULOUSE', smoker: false, pet: true, description: 'Enthousiaste de photographie.', height: 180, age: 67, music: 'Rock', zodiac: 'Balance', gender_match: 'Femme', marital: 'Divorcé', role_id: 2 },
  { gender: 'Femme', firstname: 'Françoise', slug: 'francoise',email: 'francoise66@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$VjZbdoI1PkNIX/GbAtbf3Q$0/Le9+p4CA87vzdgdlYaBxci5gAYrBimu51Gn4wztdo', city: 'MARSEILLE', smoker: false, pet: false, description: 'Amateur de théâtre.', height: 155, age: 68, music: 'Pop', zodiac: 'Scorpion', gender_match: 'Homme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Homme', firstname: 'Pierre', slug: 'pierre',email: 'pierre60@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$7FomjFrPBqY5Qawuj1nM5A$o5KaOKowz63BGXxVi9lNlQNJBFbDIAhFY8MF4ypjwNw', city: 'PARIS', smoker: true, pet: true, description: 'Passionné de cuisine italienne.', height: 172, age: 60, music: 'Blues', zodiac: 'Poissons', gender_match: 'Femme', marital: 'Séparé', role_id: 2 },
  { gender: 'Femme', firstname: 'Hélène', slug: 'helene',email: 'helene63@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$bGHyJF9VPhu9JRWW0YM4jA$TkcH9VHBG6DL9+vtaoYuco8Dq6OHnwz7FwDJQJ047Ks', city: 'LYON', smoker: false, pet: true, description: 'Amatrice de peinture et sculpture.', height: 162, age: 64, music: 'Électro', zodiac: 'Cancer', gender_match: 'Homme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Homme', firstname: 'Georges', slug: 'georges',email: 'georges61@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$7+qFVnjxFunf2IliDVGRAw$udLfud2rWtgxB/jVz4Mi1FRxWpHY683cC0WVoJLAj7U', city: 'TOULOUSE', smoker: true, pet: false, description: 'Amateur de littérature française.', height: 178, age: 70, music: 'Folk', zodiac: 'Capricorne', gender_match: 'Femme', marital: 'Veuf', role_id: 2 },
  { gender: 'Femme', firstname: 'Alice', slug: 'alice',email: 'alice64@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$CpSGTY7suTlQpO7aYbEfJQ$J3EmKiEgocNFDL7lMYPGSbBLNFc4XjnW8OIsInCPhxM', city: 'MARSEILLE', smoker: false, pet: true, description: 'Passionnée de danse classique.', height: 157, age: 69, music: 'R&B', zodiac: 'Vierge', gender_match: 'Homme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Homme', firstname: 'Alain', slug: 'alain',email: 'alain68@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$67W4HHTjs02fgtp+EDj3uw$g/lWl8lmORe1ppij8bEChbD2funt+ddsoGQwVVI2Otc', city: 'PARIS', smoker: false, pet: false, description: 'Passionné de voyages.', height: 180, age: 66, music: 'Reggae', zodiac: 'Verseau', gender_match: 'Femme', marital: 'Séparé', role_id: 2 },
  { gender: 'Femme', firstname: 'Brigitte', slug: 'brigite',email: 'brigitte70@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$ekT0VdeSayVLM9LbMBYi1A$sPvBx8rp0Y5tDl7ltSjXI9B5a++cz4qrwxM0BVTwnx8', city: 'LYON', smoker: false, pet: true, description: 'Passionnée de jardinage.', height: 165, age: 70, music: 'Jazz', zodiac: 'Lion', gender_match: 'Homme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Homme', firstname: 'René', slug: 'rene',email: 'rene62@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$Vn9TCp6p+t7IHVLuxZ/LMg$n8raD1Bd8XInQIzsZe2eWyHgYVFXV2OC5dZsdOzQOUY', city: 'TOULOUSE', smoker: true, pet: false, description: 'Amateur de cuisine asiatique.', height: 173, age: 62, music: 'Classique', zodiac: 'Sagittaire', gender_match: 'Femme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Femme', firstname: 'Sophie', slug: 'sophie',email: 'sophie65@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$Qg58F+O/VgmE4IG43WCkpA$VZxJJXCUJMSXzVvu1e/E/BqiLLydhQvCJdKkktA6lVY', city: 'MARSEILLE', smoker: false, pet: true, description: 'Passionnée de photographie.', height: 158, age: 65, music: 'Rock', zodiac: 'Bélier', gender_match: 'Homme', marital: 'Veuve', role_id: 2 },
  { gender: 'Homme', firstname: 'Jacques', slug: 'jacques',email: 'jacques63@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$h0idkeiairQTFQOxXMrT/g$5kbxsWUQ1wS9sdgeeq5iAEZGn3mbdTrjMW6zApE/CNs', city: 'PARIS', smoker: false, pet: false, description: 'Amateur de vin et gastronomie.', height: 177, age: 64, music: 'Blues', zodiac: 'Poissons', gender_match: 'Homme', marital: 'Veuf', role_id: 2 },
  { gender: 'Femme', firstname: 'Isabelle', slugi: 'isabelle',email: 'isabelle66@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$2ogznHAIDEd6d+QE3CSIuQ$JyPZj5q3tYUuH8/vG3N+QdHcFwu2+z7vhjEL8/BXYdY', city: 'LYON', smoker: false, pet: true, description: 'Passionnée par la lecture et l\'écriture.', height: 170, age: 67, music: 'Classique', zodiac: 'Vierge', gender_match: 'Homme', marital: 'Séparé', role_id: 2 },
  { gender: 'Homme', firstname: 'Michel', slug: 'michel',email: 'michel69@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$gwHT/n4aZvkEgIuZbE1LGA$VsDayVZHFNzENCMblszfe7IY85Tb3+T9p8FVx2md1zs', city: 'PARIS', smoker: true, pet: false, description: 'Amateur de pêche et de randonnées.', height: 182, age: 71, music: 'Blues', zodiac: 'Cancer', gender_match: 'Femme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Femme', firstname: 'Chantal', slug: 'chantal',email: 'chantal70@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$ddFzyMcbieGUsEPQrW9qhA$79ZfhPJtWIJx+xutVGd0d4jE6rj6AMdLj7gsLh48rfM', city: 'TOULOUSE', smoker: false, pet: false, description: 'Passionnée de cuisine française.', height: 168, age: 70, music: 'Pop', zodiac: 'Lion', gender_match: 'Homme', marital: 'Veuve', role_id: 2 },
  { gender: 'Homme', firstname: 'Philippe', slug: 'philippe',email: 'philippe65@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$ouTljA03IywA0Prpc51+xg$+SRyBvQnmdma6de79LCdIhRknoAG56mk+OM+BqV6TXQ', city: 'MARSEILLE', smoker: true, pet: true, description: 'Amateur de vins et de voyages.', height: 180, age: 68, music: 'Rock', zodiac: 'Verseau', gender_match: 'Femme', marital: 'Divorcé', role_id: 2 },
  { gender: 'Femme', firstname: 'Laurence', slug: 'laurence',email: 'laurence63@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$J3K4gFtg5uHvZ3SqWrgO8Q$5i09i4Db/wM64mxH0Rok81DvgbjnN7YHS/vLyUDMB8Y', city: 'LYON', smoker: false, pet: false, description: 'Passionnée d\'opéra et de musique classique.', height: 172, age: 69, music: 'Classique', zodiac: 'Scorpion', gender_match: 'Homme', marital: 'Divorcé', role_id: 2 },
  { gender: 'Homme', firstname: 'Daniel', slug: 'daniel',email: 'daniel64@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$XdkyMrMl+YskUNMf1bXtEw$cRz/s0aHDK/PKCzMl3Fe88lkKuMcFGxHXenLbik2Cp8', city: 'PARIS', smoker: true, pet: false, description: 'Amateur de films classiques et d\'histoire.', height: 175, age: 66, music: 'Jazz', zodiac: 'Sagittaire', gender_match: 'Femme', marital: 'Célibataire', role_id: 2 },
  { gender: 'Femme', firstname: 'Jacqueline', slug: 'jacqueline',email: 'jacqueline66@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$ZWKHkM/MbXo0TLZroeY9KA$IANDx5LqT9aTlA2SmCzFL7+JgisFOBcezAXj5gIJ2+I', city: 'TOULOUSE', smoker: false, pet: true, description: 'Passionnée de cuisine et de jardinage.', height: 163, age: 70, music: 'Folk', zodiac: 'Taureau', gender_match: 'Homme', marital: 'Séparé', role_id: 2 }
]);

  
 

// Batch creation of Events
await Event.bulkCreate([
  { title: 'Balade Nature en Forêt', slug: 'balade-nature-en-foret', description: 'Une promenade guidée dans la forêt de Fontainebleau pour découvrir la faune et la flore locales.', date: '2025-05-15', time: '10:00', city: 'PARIS', street: 'Rue des Écoles', street_number: 34, zip_code: 75005, picture: 'image1.jpg', label_id: 1 },
  { title: 'Soirée Théâtre Classique', slug: 'soiree-theatre-classique', description: 'Une soirée de théâtre avec une pièce classique de Molière.', date: '2025-06-22', time: '19:30', city: 'PARIS', street: 'Rue du Faubourg Saint-Martin', street_number: 7, zip_code: 75010, picture: 'image2.jpg', label_id: 2 },
  { title: 'Atelier de Peinture Acrylique', slug: 'atelier-peinture-acrylique', description: 'Un atelier pour découvrir et pratiquer la peinture acrylique avec un artiste local.', date: '2025-07-30', time: '14:00', city: 'PARIS', street: 'Avenue de l\'Opéra', street_number: 15, zip_code: 75001, picture: 'image3.jpg', label_id: 3 },
  { title: 'Randonnée au Parc de la Tête d\'Or', slug: 'randonnee-parc-tete-d-or', description: 'Une randonnée matinale dans le parc pour admirer la nature et les paysages.', date: '2025-05-18', time: '08:30', city: 'LYON', street: 'Boulevard des Belges', street_number: 1, zip_code: 69006, picture: 'image4.jpg', label_id: 1 },
  { title: 'Concert de Musique Classique', slug: 'concert-musique-classique', description: 'Un concert avec l\'orchestre philharmonique de Lyon, interprétant des œuvres de Beethoven.', date: '2025-06-05', time: '20:00', city: 'LYON', street: 'Rue de la République', street_number: 4, zip_code: 69002, picture: 'image5.jpg', label_id: 2 },
  { title: 'Soirée Jeux de Société', slug: 'soiree-jeux-de-societe', description: 'Une soirée conviviale pour jouer à des jeux de société variés.', date: '2025-07-12', time: '18:00', city: 'LYON', street: 'Rue des Marronniers', street_number: 25, zip_code: 69002, picture: 'image6.jpg', label_id: 3 },
  { title: 'Balade Nature au Jardin des Plantes', slug: 'balade-nature-jardin-des-plantes', description: 'Une promenade guidée pour découvrir les plantes et arbres du jardin botanique.', date: '2025-05-10', time: '09:00', city: 'TOULOUSE', street: 'Rue de la Pomme', street_number: 31, zip_code: 31000, picture: 'image7.jpg', label_id: 1 },
  { title: 'Exposition d\'Art Contemporain', slug: 'exposition-art-contemporain', description: 'Une exposition présentant les œuvres d\'artistes contemporains locaux.', date: '2025-06-17', time: '15:00', city: 'TOULOUSE', street: 'Rue du Taur', street_number: 20, zip_code: 31000, picture: 'image8.jpg', label_id: 3 },
  { title: 'Soirée Cinéma en Plein Air', slug: 'soiree-cinema-plein-air', description: 'Une soirée cinéma en plein air avec projection d\'un film classique.', date: '2025-07-25', time: '21:00', city: 'TOULOUSE', street: 'Rue Gambetta', street_number: 45, zip_code: 31000, picture: 'image9.jpg', label_id: 4 },
  { title: 'Randonnée au Parc National des Calanques', slug: 'randonnee-parc-national-calanques', description: 'Une randonnée pour découvrir les magnifiques paysages du parc national.', date: '2025-05-20', time: '07:00', city: 'MARSEILLE', street: 'Rue du Prado', street_number: 12, zip_code: 13008, picture: 'image10.jpg', label_id: 1 },
  { title: 'Atelier de Sculpture sur Bois', slug: 'atelier-sculpture-bois', description: 'Un atelier pratique pour apprendre les techniques de la sculpture sur bois.', date: '2025-06-03', time: '10:00', city: 'MARSEILLE', street: 'Avenue du Prado', street_number: 18, zip_code: 13006, picture: 'image11.jpg', label_id: 3 },
  { title: 'Soirée Dégustation de Vins', slug: 'soiree-degustation-vins', description: 'Une soirée pour déguster des vins régionaux avec un sommelier expert.', date: '2025-07-28', time: '19:00', city: 'MARSEILLE', street: 'Rue Sainte', street_number: 5, zip_code: 13001, picture: 'image12.jpg', label_id: 2 }
]);

async function addLabelToUser(userId, labelId) {
  const user = await User.findByPk(userId);
  await user.addLabel(labelId);
}

// Ajouter des labels à l'utilisateur 1
await addLabelToUser(1, 1);
await addLabelToUser(1, 2);
await addLabelToUser(1, 4);
await addLabelToUser(2, 1);
await addLabelToUser(2, 6);
await addLabelToUser(2, 3);
await addLabelToUser(3, 3);
await addLabelToUser(3, 1);
await addLabelToUser(4, 2);
await addLabelToUser(4, 5);
await addLabelToUser(4, 4);
await addLabelToUser(5, 1);
await addLabelToUser(5, 6);
await addLabelToUser(5, 4);
await addLabelToUser(6, 3);
await addLabelToUser(6, 2);
await addLabelToUser(6, 1);
await addLabelToUser(7, 2);
await addLabelToUser(7, 5);
await addLabelToUser(7, 1);
await addLabelToUser(8, 6);
await addLabelToUser(8, 3);
await addLabelToUser(8, 1);
await addLabelToUser(9, 1);
await addLabelToUser(9, 2);
await addLabelToUser(9, 5);
await addLabelToUser(10, 1);
await addLabelToUser(10, 5);
await addLabelToUser(10, 2);
await addLabelToUser(11, 2);
await addLabelToUser(11, 1);
await addLabelToUser(11, 3);
await addLabelToUser(12, 1);
await addLabelToUser(12, 5);
await addLabelToUser(12, 4);
await addLabelToUser(13, 1);
await addLabelToUser(13, 4);
await addLabelToUser(14, 1);
await addLabelToUser(14, 6);
await addLabelToUser(14, 4);
await addLabelToUser(15, 2);
await addLabelToUser(15, 5);
await addLabelToUser(15, 1);
await addLabelToUser(16, 2);
await addLabelToUser(16, 6);
await addLabelToUser(16, 4);
await addLabelToUser(17, 2);
await addLabelToUser(17, 5);
await addLabelToUser(17, 4);
await addLabelToUser(18, 2);
await addLabelToUser(18, 1);
await addLabelToUser(18, 3);
await addLabelToUser(19, 1);
await addLabelToUser(19, 3);
await addLabelToUser(19, 6);
await addLabelToUser(20, 2);
await addLabelToUser(20, 4);
await addLabelToUser(20, 5);

  
console.log("✅ Seed done with success !");
console.log("🧹 Clean up by closing database connection");
await sequelize.close();

