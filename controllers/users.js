const User = require('../models/user');

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllUsers = async response => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(await User.find({})));
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  const user = await User.findById(userId);
  //await User.deleteOne({ _id: userId });
  response.end(JSON.stringify(user));
  
  };

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async (response, userId, currentUser, userData) => {
  // TODO: 10.1 Implement this
  throw new Error('Not Implemented');
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  //response.write(await User.findById(userId), function(err) { response.end(); })
  const user = await User.findById(userId);
  console.log(user);
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.write(JSON.stringify(user));
  //response.end(JSON.stringify(await User.findById(userId)));
  response.end(function() {console.log("sit tää");} );
  //response.end();
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this
  throw new Error('Not Implemented');
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
