const { interfaces } = require('mocha');
const mongoose = require('mongoose');
const User = require('./user');
const Product = require('./product');
const Schema = mongoose.Schema;

const orderedItemSchema = new Schema({
  product: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: Product,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      validate: {
        validator: (v) => {
          return v > 0;
        }
      },
      required: true
    },
    description: {type: String}
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  }
});

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  items: {
    type: [orderedItemSchema],
    required: true
  }
});



// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });
orderedItemSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);

module.exports = Order;