const User = require('../models/user');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllUsers = async response => {
  //response.writeHead(200, { 'Content-Type': 'application/json' });
  //console.log(await User.find({}));
  //response.end(JSON.stringify(await User.find({})));
  const users = await User.find({});
  return responseUtils.sendJson(response, users);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  if (currentUser === null) {
    return responseUtils.basicAuthChallenge(response);
  } 
  const user = await User.findById(userId);
  if (user !== null) {
    if (userId.localeCompare(currentUser._id) == 0) {
      return responseUtils.badRequest(response, "Updating own data is not allowed");
    } else if (currentUser.role !== 'admin') {
      return responseUtils.forbidden(response);
    } else {
      await User.deleteOne({ _id: userId });
      return responseUtils.sendJson(response, user);
      }  
  } else {
    return responseUtils.notFound(response);
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
  if (currentUser === null) {
    return responseUtils.basicAuthChallenge(resposne);
  }
  if (currentUser.role !== 'admin') {
    return responseUtils.forbidden(response);
  }
  const user = await User.findById(userId);
  if (user !== null) {
    if (user._id !== currentUser._id) {
      try {
        user.role = userData.role;
        await user.save();
        return responseUtils.sendJson(response, user);
      } catch (e) {
        return responseUtils.badRequest(response, "invalid role");
      }
    } else {
      //can't update self
      return responseUtils.badRequest(response, "Updating own data is not allowed")
    }
  } else {
    //no defined user found
    return responseUtils.notFound(response);
  }
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
  
  if (currentUser === null) {
    return responseUtils.basicAuthChallenge(response);
  } 
  if (currentUser.role !== 'admin') {
    return responseUtils.forbidden(response);
  }
  const user = await User.findById(userId);
  if (user === null) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, user);
    
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this
  try {
    const newUser = new User(userData);
    newUser.role = 'customer';
    //return badrequest if new registered user's role is not customer
    //if (newUser.role !== 'customer') {
    //  return responseUtils.badRequest(response, 'user role not customer')
    //}
    await newUser.save();
    return responseUtils.createdResource(response, newUser);
  } catch (e) {
    return responseUtils.badRequest(response, "invalid user information");
  }
  throw new Error('Not Implemented');
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
