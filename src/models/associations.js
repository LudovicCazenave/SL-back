import { Event } from "./event.model.js";
import { Message } from "./message.model.js";
import { Role } from "./role.model.js";
import { User } from "./user.model.js";
import { Label } from "./label.model.js";


//association  by FK for table role with user
Role.hasMany(User,{
  foreignKey: "role_id",
  as: "users"
});
User.belongsTo(Role,{
  foreignKey: "role_id",
  as: "role"
});
//association by FK for table user with message create two FK one for the sender and one for the receiver
User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages"
});
User.hasMany(Message, {
  foreignKey: "receiver_id",
  as: "receivedMessages"
});
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender"
});
Message.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver"
});  
//associaton by FK for table label with event 
Label.hasMany(Event,{
  foreignKey: "label_id",
  as: "events"
});
Event.belongsTo(Label,{
  foreignKey: "label_id",
  as: "label"
});

// creating association table for a association many to many bitween user table and event table
User.belongsToMany(Event, {
  through: 'user_event',
  foreignKey: "user_id",
  as: "events",
  onDelete: 'CASCADE'
});
Event.belongsToMany(User, {
  through: 'user_event',
  foreignKey: "event_id",
  as: "users",
  onDelete: 'CASCADE'
});
// creating association table for a association many to many bitween user table and label table
User.belongsToMany(Label, {
  through: 'user_label',
  foreignKey: "user_id",
  as: "labels",
  onDelete: 'CASCADE'
});
Label.belongsToMany(User, {
  through: 'user_label',
  foreignKey: "label_id",
  as: "users",
  onDelete: 'CASCADE'
});

export {Label, User, Event, Message, Role};