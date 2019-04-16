const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  create_time: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ['FOUND', 'STOLEN'],
    required: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  frame_number: Number,
  antitheft_code: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    lat: Number,
    long: Number,
    city: String,
    neighborhood: String,
    street: String,
  },
  image_url: {
    type: String,
    trim: true,
  },
  keywords: {
    frame_type: {
      type: String,
      enum: ['MALE', 'FEMALE'],
    },
    child: Boolean,
    sport: Boolean,
    tandem: Boolean,
    basket: Boolean,
    rack: Boolean,
    mudguard: Boolean,
    chain_protection: Boolean,
    net: Boolean,
    winter_tires: Boolean,
    light: Boolean,
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
});

const bikeModel = mongoose.model('Bike', bikeSchema, 'bikes');

// Use initial uppercase for models (as with a Class object)
module.exports = {
  Bike: bikeModel,
};
