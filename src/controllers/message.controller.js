import { User, Event, Label, Message, Role } from "../models/associations.js";
import { Op } from "sequelize";

export const messageController = {
  // Retrieve all messages for the authenticated user
  async getAllMessages(req, res) {
    // Extract the userId from the request object (assumed to be added by authentication middleware)
    const { userId } = req.user;

    // Find all messages where the authenticated user is either the sender or the receiver.
    // The results are ordered in descending order by the "created_at" timestamp.
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId },
        ],
      },
      // Include sender and receiver associations with selected attributes.
      include: [
        {
          association: "sender",
          attributes: ["id", "firstname", "slug", "picture", "gender"],
        },
        {
          association: "receiver",
          attributes: ["id", "firstname", "slug", "picture", "gender"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Return the fetched messages in JSON format with a 200 status code.
    res.status(200).json(messages);
  },

  // Create a new message from the authenticated user to the specified receiver.
  async createMessage(req, res) {
    // Get the sender's ID from the authenticated user.
    const sender_id = req.user.userId;
    // Extract receiver_id and content from the request body.
    const { receiver_id, content } = req.body;

    // Ensure that both content and receiver_id are provided in the request.
    if (!content || !receiver_id) {
      return res.status(400).json({
        message: "Le contenu du message et l'ID du destinataire sont requis.",
      });
    }

    // Create a new message record in the database.
    const newMessage = await Message.create({
      content,
      sender_id,
      receiver_id,
    });

    // Retrieve the newly created message with its associated sender and receiver information.
    const createdMessage = await Message.findOne({
      where: { id: newMessage.id },
      include: [
        {
          association: "sender",
          attributes: ["id", "firstname", "slug", "picture", "gender"],
        },
        {
          association: "receiver",
          attributes: ["id", "firstname", "slug", "picture", "gender"],
        },
      ],
    });
    // Respond with the newly created message as JSON and a 201 status code.
    res.status(201).json(createdMessage);
  },
};