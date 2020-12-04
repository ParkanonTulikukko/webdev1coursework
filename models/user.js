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

const userSchema = new Schema({
  // TODO: 9.4 Implement this
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
    //match: /^\S.*[^.\s]$/,
    trim: true
  },
	email: {
    type: String,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 10,
    required: true,
    set: hash
    //bcrypt.genSaltSync(10, (err, salt) => {
    //  bcrypt.hash(v, salt, (err, hash) => {
    //    v = hash;
    //  });
    //})
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
    trim: true,
    lowercase: true,
    required: true
  }
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function (password) {
  // TODO: 9.4 Implement this
  return bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;
