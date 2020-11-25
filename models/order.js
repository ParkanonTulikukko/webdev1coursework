const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  // TODO: 9.4 Implement this
  customerId: {
    type: Schema.Types.ObjectId,
    ref: User,
    //minlength: 1,
    //maxlength: 50,
    required: true,
    //match: /^\S.*[^.\s]$/,
    trim: true
  },
  items: {
    type: String,
    required: true
  }
});

// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;