const User = require('../models/user');
const responseUtils = require('../utils/responseUtils');

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
  const user = await User.findById(userId);
  if (user !== null) {
    if (userId.localeCompare(currentUser._id) == 0) {
      console.log("ON SAMA");
      responseUtils.badRequest(response, "Updating own data is not allowed");
      }
    else {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      const user = await User.findById(userId);
      await User.deleteOne({ _id: userId });
      response.end(JSON.stringify(user));
      }  
    } 
  else {
    responseUtils.notFound(response);
    }
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
  /*
  JOTENKIN TÄLLEEN:
  const user = await User.findById(userId);
  if (user !== null) {
    const user = await User.findById(userId);
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.write(JSON.stringify(user));
    response.end();
    }
  else {
    responseUtils.notFound(response);
    }
   */ 
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
