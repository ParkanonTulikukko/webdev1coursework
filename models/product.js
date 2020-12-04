const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
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
	image: {
    type: String
  },
  description: {
    type: String,
  }
});

// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;