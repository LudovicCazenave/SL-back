import { User, Event, Label, Message, Role } from "../models/associations.js";
import passwordValidator from "password-validator";
import * as argon2 from "argon2";
import { Op } from "sequelize";
import { userUpdateSchema } from "../schema/user.schema.js";
import { deleteFileIfExists } from "../utils/file.utils.js";
import slugify from 'slugify';

// Function to generate slug

const generateSlug = (name) => {
  return slugify(name, {
    lower: true, // Convert to lowercase
    remove: /[^a-zA-Z0-9 -]/g, // Remove special characters except spaces and hyphens
    strict: true // Remove any remaining special characters
  });

};   

export const userController = {

  // Handle user sign-up
  async signUp(req, res) {
    const { email, password, firstname, gender, age, height, marital, pet, city, gender_match, description, smoker, music, zodiac, labels } = req.body;

    // Validate required fields
    if (!email || !password || !firstname || !gender || !age || !height || !marital || !pet || !city || !gender_match) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Configure password validator
    const passwordSchema = new passwordValidator();
    passwordSchema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits(1)
      .has().not().spaces();

    // Validate password
    if (!passwordSchema.validate(password)) {
      return res.status(400).json({
        error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre, et ne doit pas contenir d’espaces.',
      });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: "role"
      }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);
    
    
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path; 
    }


    // Create the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstname,
      gender,
      age,
      height,
      marital,
      pet,
      city,
      gender_match,
      description,
      smoker,
      music,
      picture: imagePath,
      zodiac,
      slug: generateSlug(firstname) // Generate slug based on firstname
    });

    // Check if labels are provided and if the labels array is not empty
    if (labels && labels.length > 0) {
      // Find all labels in the database that match the provided label names
      const userLabels = await Label.findAll({
        where: {
          name: labels // Filter labels by the names provided in the request
        }
      });

      // Associate the found labels with the newly created user
      // This uses the `setLabels` method provided by Sequelize for many-to-many relationships
      await newUser.setLabels(userLabels);
    }

    // Save user to database
    await newUser.save();

    // Return the user info
    return res.status(201).json({ 
      message: 'Utilisateur créé avec succès.', 
      logged: true, 
      pseudo: newUser.firstname,
    });
  },
  
  // Retrieve all user profiles excluding sensitive fields and including their associated labels and events.
  async getAllProfiles(req, res) {
    const users = await User.findAll({
      // Exclude sensitive fields like password, email, role_id, created_at, and updated_at from the response.
      attributes: { exclude: ['password', 'email', 'role_id', 'created_at', 'updated_at'] },
      // Include associations with labels and events.
      include: [
        {model: Label, as: 'labels', attributes:["name"]},
        {model: Event, as: 'events', attributes: {exclude:['created_at', 'updated_at']}}
        ],
    });

    // Return the fetched user profiles as a JSON response with a 200 status code.
    res.status(200).json(users);
  },

  // Retrieve a single user profile based on the provided slug.
  async getOneProfile(req, res) {
    const { slug } = req.params;

    // Find one user where their slug matches the provided parameter.
    // Include associations for sent messages, received messages, and labels.
    const user = await User.findOne({
      where: { slug: slug },
      attributes: { exclude: ['password', 'email', 'role_id', 'created_at', 'updated_at'] },
      include: [
        'sentMessages',
        'receivedMessages',
        {model: Label, as:'labels', attributes:['name'] },
      ]
    });

    // If the user is not found, return a 404 response with an appropriate message.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    };

    // Retrieve past events (events with a date in the past) for the user.
    const pastEvents = await user.getEvents({
      where: {
        date: { [Op.lt]: new Date() }
      },
      attributes: {exclude:['created_at', 'updated_at']},
      order: [['date', 'DESC']],
      include: [
        { model: Label, as: 'label', attribute:['name'] }
      ],
    });

    // Retrieve the next upcoming event (first event in the future) for the user.
    const futureEvent = await user.getEvents({
      where: {
        date: { [Op.gt]: new Date() }
      },
      attributes: {exclude:['created_at', 'updated_at']},
      order: [['date', 'ASC']],
      include: [
        { model: Label, as: 'label', attribute:['name'] }
      ],
    });

    // Append past and future event information to the user's data values.
    user.dataValues.pastEvents = pastEvents;
    user.dataValues.futureEvent = futureEvent;

    // Return the augmented user profile as JSON with a 200 status code.
    res.status(200).json(user);
  },

  // Retrieve detailed account information for the authenticated user.
  // This includes roles, messages, labels, events, and computed past/future events.
  getAccountDetails: async (req, res) => {
    const userId = req.user.userId; 
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password', 'email', 'role_id', 'created_at', 'updated_at'] },
      include: [
        {model: Role, as:'role',attributes:{ exclude: ['name','created_at', 'updated_at']}},
        'sentMessages',
        'receivedMessages', 
        {model: Label, as:'labels', attributes:['name']},
      ]
    });

    // If the user is not found, return a 404 error.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const currentDate = new Date();

    // Retrieve the user's past events by filtering the user's events where the date has passed.
    const pastEvents = await user.getEvents({
      where: {
        date: { [Op.lt]: currentDate }
      },
      attributes: {exclude:['created_at', 'updated_at']},
      include: [
        { model: Label, as: 'label', attribute:['name'] }
      ],
      order: [['date', 'DESC']]
    });

    // Retrieve the user's upcoming events by filtering the user's events where the date is in the future.
    const futureEvents = await user.getEvents({
      where: {
        date: { [Op.gt]: currentDate }
      },
      attributes: {exclude:['created_at', 'updated_at']},
      include: [
        { model: Label, as: 'label', attribute:['name'] }
      ],
      order: [['date', 'ASC']],
    });

    // Update user data values:
    // - Format the picture URL.
    // - Add pastEvents and futureEvents arrays.
    user.dataValues.picture = `http://localhost:3000/${user.picture}`;
    user.dataValues.pastEvents = pastEvents;
    user.dataValues.futureEvents = futureEvents;

    // Return the user details as JSON with a 200 status code.
    res.status(200).json(user);
  },

  // Update account details for the authenticated user.
  updateAccountDetails: async (req, res) => {
    const userId = req.user.userId; // Retrieve user ID from the authenticated request.
    const updatedData = req.body;

    // Validate the updated data using Joi schema.
    await userUpdateSchema.validateAsync(updatedData);

    // If the firstname is updated, generate a new slug from the firstname.
    if (updatedData.firstname) {
      updatedData.slug = generateSlug(updatedData.firstname);
    }

    // Find the user to update, including some associations.
    const user = await User.findOne({
      where: { id: userId },
      include: [
        'role', 'sentMessages', 'receivedMessages', 'labels'
      ]
    });

    // If the user is not found, return a 404 error.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // If a file (e.g., profile picture) is provided in the request, process it.
    if (req.file) {
      // If the user already has a picture, delete the old file.
      if (user.picture) {
        await deleteFileIfExists(user.picture);
      }
      // Set the picture path in updatedData.
      updatedData.picture = `public/uploads/${req.file.filename}`;
    }

    // Update the user's details in the database with the new data.
    await user.update(updatedData);

    // If labels are provided, update the user's associated labels.
    if (updatedData.labels) {
      await user.setLabels(updatedData.labels);
    }

    // Refetch the updated user with its associations.
    const updatedUser = await User.findOne({
      where: { id: userId },
      include: [
        'role', 'sentMessages', 'receivedMessages', 'labels'
      ]
    });

    // Return a success message along with the updated user data.
    res.status(200).json({ message: 'Les informations de l\'utilisateur ont été mises à jour avec succès', user: updatedUser });
  },

  // Delete the account of the authenticated user.
  deleteAccount: async (req, res) => {
    const userId = req.user.userId; // Retrieve user ID from the authenticated request.
    const user = await User.findOne({
      where: { id: userId }
    });

    // If the user is not found, return a 404 error.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // If the user has a picture, delete the associated file.
    if (user.picture) {
      await deleteFileIfExists(user.picture);
    }

    // Clear the authentication token stored in cookies (for security).
    res.clearCookie('token', { httpOnly: true });

    // Delete the user record from the database.
    await user.destroy();

    // Return a success message confirming account deletion.
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  },

  // Retrieve profiles that match the connected user's preferences (city, gender, etc.).
  connectedProfile: async (req, res) => {
    const userId = req.user.userId;

    // Retrieve the current user's data.
    const currentUser = await User.findOne({
      where: { id: userId }
    });

    // If the user is not found, return a 404 error.
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find profiles (other users) that match criteria:
    // - Exclude the current user.
    // - Must be in the same city.
    // - Their gender and gender_match properties should align with the current user's preferences.
    const profiles = await User.findAll({
      where: {
        id: { [Op.ne]: userId }, // Exclude the current user.
        city: currentUser.city,   // Must be in the same city.
        [Op.or]: [
          {
            [Op.and]: [
              { gender: currentUser.gender_match }, // Profile must have the gender the current user is interested in.
              { gender_match: currentUser.gender }    // Profile's gender preference must match the current user's gender.
            ]
          },
        ]
      },
      limit: 6, // Limit to 6 profiles.
      order: [['created_at', 'DESC']], // Order by most recent creation.
      // Exclude sensitive fields (password, email) from the response.
      attributes: { exclude: ['password', 'email', 'created_at', 'updated_at'] }
    });

    // Return the matching profiles as JSON with a 200 status code.
    res.status(200).json(profiles);
  }
};