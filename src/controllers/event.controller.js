import { Event, Label, User } from "../models/associations.js";
import { Op } from 'sequelize';

export const eventController = {
  
  // Get all events along with their associated labels and users
  async getAllEvents(req, res) {
    // Retrieve all events from the database including associations identified by 'label' and 'users'
    const events = await Event.findAll({
      include: ['label', 'users'],
    });
    // Respond with the list of events in JSON format
    res.json(events);
  },

  // Get a single event by its slug
  async getOneEvent(req, res) {
    const { slug } = req.params;
    // Find the event in the database matching the given slug, including label and users associations
    const event = await Event.findOne({
      where: { slug: slug },
      include: ['label', 'users'],
    });

    // If no event is found, send a 404 error response
    if (!event) {
      return res.status(404).json({ message: 'Evènement non trouvé' });
    }

    // If event is found, send it with a 200 success status
    res.status(200).json(event);
  },

  // Get the last created event for each predefined city
  async lastEvent(req, res) {
    // Define a list of target cities
    const cities = ['PARIS', 'LYON', 'MARSEILLE', 'TOULOUSE'];
    
    // For each city, find the most recently created event (using created_at field in descending order)
    const events = await Promise.all(cities.map(async (city) => {
      return await Event.findOne({
        where: { city },
        order: [['created_at', 'DESC']],
        include: { model: Label, as: 'label' },  // Include the associated label for the event
      });
    }));

    // Return the array of events, one for each city, in JSON format
    res.json(events);
  },

  // Get events relevant to a connected user (i.e., based on user's city and upcoming events)
  async connectedEvent(req, res) {
    // Extract the authenticated user's ID from the request object (assumed to be added by authentication middleware)
    const userId = req.user.userId;

    // Retrieve the user information from the database using the user ID
    const user = await User.findOne({
      where: { id: userId },
    });

    // If no user is found, return a 404 error indicating "User not found"
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all events based on the user's city and ensure that the event date is in the future
    const events = await Event.findAll({
      where: {
        city: user.city,        // Only events in the user's city
        date: {
          [Op.gte]: new Date(), // Only include events that occur on or after today
        },
      },
      limit: 4,                  // Limit the number of events returned
      order: [['date', 'ASC']],  // Order events by date in ascending order (soonest events first)
      include: [{
        model: Label,
        as: 'label',           // Include the event label (category information)
      }],
    });

    // Return the filtered events with a 200 status code
    res.status(200).json(events);
  },

  // Register the currently authenticated user for a specific event based on the event's slug
  async registerForEvent(req, res) {
    // Retrieve user's ID from the authenticated request
    const userId = req.user.userId;
    // Retrieve the event slug from the URL parameters
    const { slug } = req.params;

    // Find the user in the database by primary key using the user ID
    const user = await User.findByPk(userId);
    // Find the event from the database based on the provided slug
    const event = await Event.findOne({
      where: { slug },
    });

    // If either the user or the event doesn't exist, return a 404 error with an appropriate message
    if (!user || !event) {
      return res.status(404).json({ message: "Utilisateur ou événement non trouvé" });
    }

    // Check if the user is already registered for the event; hasEvent is a Sequelize association method
    const isRegistered = await user.hasEvent(event);
    if (isRegistered) {
      return res.status(400).json({ message: "Déjà inscrit à cet événement" });
    }

    // Add the event to the user's list of events (register the user to the event)
    await user.addEvent(event);

    res.status(200).json({ message: "Inscription réussie à l'événement" });
  },
};