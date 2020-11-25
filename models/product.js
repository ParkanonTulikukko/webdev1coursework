const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function hash(password) {
  if (password.length < 10) {
     return password;
  } else {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  
}

const productSchema = new Schema({
  // TODO: 9.4 Implement this
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
    //match: /^\S.*[^.\s]$/,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
	image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    //minlength: 1,
    //maxlength: 50,
    required: true,
    trim: true
  }
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
/*
userSchema.methods.checkPassword = async function (password) {
  // TODO: 9.4 Implement this
  return bcrypt.compare(password, this.password);
};
*/

// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;