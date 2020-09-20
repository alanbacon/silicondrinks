const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const { Schema, model } = mongoose;

const UserSchema = {
  name: {
    type: String, default: null, required: true, unique: true, index: true,
  },
  avatarUrl: {
    type: String, default: null,
  },
};
const User = Schema(UserSchema);

const EventTypes = ['COCKTAILS', 'BEERS', 'COFFEES', 'MILKSHAKES'];
const EventSchema = {
  _id: {
    type: String, default: uuidv4,
  },
  type: {
    type: String, default: 'BEERS', enum: EventTypes, required: true,
  },
  time: {
    type: String, default: null,
  },
  title: {
    type: String, default: null, required: true,
  },
  location: {
    type: String, ref: 'Location',
  },
  creator: {
    type: String, ref: 'User',
  },
  guests: [
    { type: String, ref: 'User' },
  ],
  comments: [
    { type: String, ref: 'Comment' },
  ],
};
const Event = Schema(EventSchema);

const LocationSchema = {
  name: {
    type: String, default: null, required: true, unique: true, index: true,
  },
  latitude: {
    type: Number, default: null, required: true,
  },
  longitude: {
    type: Number, default: null, required: true,
  },
};
const Location = Schema(LocationSchema);

const CommentSchema = {
  user: {
    type: String, ref: 'User', required: true,
  },
  timestamp: {
    type: String, default: null, required: true,
  },
  message: {
    type: String, default: '',
  },
};
const Comment = Schema(CommentSchema);

const drinksModels = {
  User: model('User', User),
  Event: model('Event', Event),
  Location: model('Location', Location),
  Comment: model('Comment', Comment),
};

module.exports = {
  drinksModels,
  EventTypes,
};
