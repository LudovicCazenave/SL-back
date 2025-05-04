import { User, Event, Label, Message, Role } from "../models/associations.js";
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
  
  // Retrieve all user profiles excluding sensitive fields and including their associated labels and events.
  async getAllProfiles(req, res) {
    const users = await User.findAll({
      // Exclude sensitive fields like password, email, role_id, created_at, and updated_at from the response.
      attributes: { exclude: ['password', 'email', 'role_id', 'created_at', 'updated_at'] },
      // Include associations with labels and events.
      include: ['labels', 'events'],
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
      include: ['sentMessages', 'receivedMessages', 'labels']
    });

    // If the user is not found, return a 404 response with an appropriate message.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    };

    // Retrieve past events (events with a date in the past) for the user.
    // Limit the results to 2 and order by date in descending order.
    const pastEvents = await Event.findAll({
      where: {
        date: { [Op.lt]: new Date() }
      },
      limit: 2,
      order: [['date', 'DESC']],
      include: [
        { model: Label, as: 'label' }
      ],
      // Select only essential event attributes.
      attributes: ['id', 'title', 'city', 'description']
    });

    // Retrieve the next upcoming event (first event in the future) for the user.
    const futureEvent = await Event.findOne({
      where: {
        date: { [Op.gt]: new Date() }
      },
      order: [['date', 'ASC']],
      include: [
        { model: Label, as: 'label' }
      ],
      attributes: ['id', 'title', 'city', 'description']
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
      include: [
        'role', 'sentMessages', 'receivedMessages', 'labels', 'events'
      ]
    });

    // If the user is not found, return a 404 error.
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const currentDate = new Date();

    // Retrieve the user's past events by filtering the user's events where the date has passed.
    const pastEvents = await Event.findAll({
      where: {
        id: user.events.map(event => event.id),
        date: { [Op.lt]: currentDate }
      },
      include: [
        { model: Label, as: 'label' }
      ],
      order: [['date', 'DESC']]
    });

    // Retrieve the user's upcoming events by filtering the user's events where the date is in the future.
    const futureEvents = await Event.findAll({
      where: {
        id: user.events.map(event => event.id),
        date: { [Op.gt]: currentDate }
      },
      include: [
        { model: Label, as: 'label' }
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
      attributes: { exclude: ['password', 'email'] }
    });

    // Return the matching profiles as JSON with a 200 status code.
    res.status(200).json(profiles);
  }
};