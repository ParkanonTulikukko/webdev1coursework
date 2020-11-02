/**
 * Week 08 utility file for user related operations
 *
 * NOTE: This file will be abandoned during week 09 when a database will be used
 * to store all data.
 */

/**
 * Use this object to store users
 *
 * An object is used so that users can be reset to known values in tests
 * a plain const could not be redefined after initialization but object
 * properties do not have that restriction.
 */

const data = {
  // make copies of users (prevents changing from outside this module/file)
  users: require('../users.json').map(user => ({ ...user })),
  roles: ['customer', 'admin']
};

/**
 * Reset users back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetUsers = () => {
  // make copies of users (prevents changing from outside this module/file)
  data.users = require('../users.json').map(user => ({ ...user }));
};

/**
 * Generate a random string for use as user ID
 * @returns {string}
 */
const generateId = () => {
  let id;

  do {
    // Generate unique random id that is not already in use
    // Shamelessly borrowed from a Gist. See:
    // https://gist.github.com/gordonbrander/2230317

    id = Math.random().toString(36).substr(2, 9);
  } while (data.users.some(u => u._id === id));

  return id;
};


/**
 * Check if email is already in use by another user
 *
 * @param {string} email
 * @returns {boolean}
 */
const emailInUse = email => {
  var isItInUse = data.users.some(function (user) {
        return (email === user.email);
        });
  return isItInUse; 
};

//emailInUse("email");

/**
 * Return user object with the matching email and password or undefined if not found
 *
 * Returns a copy of the found user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Object|undefined}
 */
const getUser = (email, password) => {
  // TODO: 8.3 Get user whose email and password match the provided values
  //data.users.forEach(getUser);
  let foundedUser = undefined;
  for (i = 0; i < data.users.length; i++) {
    if (data.users[i].password === password && data.users[i].email === email) {
      foundedUser = JSON.parse(JSON.stringify(data.users[i]));
      }//if
    }//for

  return foundedUser;  
  
  };

//console.log(getUser("admin@email.com","1234567890"));

/**
 * Return user object with the matching ID or undefined if not found.
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId
 * @returns {Object|undefined}
 */
const getUserById = userId => {
  let foundedUser = undefined;
  for (i = 0; i < data.users.length; i++) {
    if (data.users[i]._id === userId) {
      foundedUser = JSON.parse(JSON.stringify(data.users[i]));
      }//if
    }//for

  return foundedUser;  
};

/**
 * Delete user by its ID and return the deleted user
 *
 * @param {string} userId
 * @returns {Object|undefined} deleted user or undefined if user does not exist
 */
const deleteUserById = userId => {
  //30) should delete an existing user with the given ID
  //31) should return the deleted user object
  for (i = 0; i < data.users.length; i++) {
    if (data.users[i]._id === userId) {
      let deletedUser = JSON.parse(JSON.stringify(data.users[i]));
      data.users.splice(i, 1);
      //console.log(deletedUser);
      return deletedUser;
      }//if
    }//for
  return undefined;
  }

/*console.log(deleteUserById("s7ygctl5v"));  
console.log(deleteUserById("s7y6ctl4v"));
console.log(data.users);
*/
/**
 * Return all users
 *
 * Returns copies of the users and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<Object>} all users
 */
const getAllUsers = () => {
  return JSON.parse(JSON.stringify(data.users));
  };

/**
 * Save new user
 *
 * Saves user only in memory until node process exits (no data persistence)
 * Save a copy and return a (different) copy of the created user
 * to prevent modifying the user outside this module.
 *
 * DO NOT MODIFY OR OVERWRITE users.json
 *
 * @param {Object} user
 * @returns {Object} copy of the created user
 */
const saveNewUser = user => {
  // Added the third rule, it seems all new users should be customers (mocha test)
  if (user.role === null || user.role === undefined || user.role !== "customer") {
    user.role = "customer";
    }
  user._id = generateId();
  data.users.push(JSON.parse(JSON.stringify(user)));
  return JSON.parse(JSON.stringify(user));
};

/**
 * Update user's role
 *
 * Updates user's role or throws an error if role is unknown (not "customer" or "admin")
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId
 * @param {string} role "customer" or "admin"
 * @returns {Object|undefined} copy of the updated user or undefined if user does not exist
 * @throws {Error} error object with message "Unknown role"
 */
const updateUserRole = (userId, role) => {
  //console.log("juuser id on " + userId);
  let user = deleteUserById(userId);
  if (user === undefined) {
    return undefined;
    }
  if (role != "customer" && role != "admin") {
    throw new Error('Unknown role');
    }
  user.role = role;
  data.users.push(JSON.parse(JSON.stringify(user))); 
  return JSON.parse(JSON.stringify(user));
};

/**
 * Validate user object (Very simple and minimal validation)
 *
 * This function can be used to validate that user has all required
 * fields before saving it.
 *
 * @param {Object} user user object to be validated
 * @returns {Array<string>} Array of error messages or empty array if user is valid
 */
const validateUser = user => {

  let errors = [];

  if (!user.hasOwnProperty("name")) 
    {errors.push('Missing name');}
  if (!user.hasOwnProperty("email")) 
    {errors.push('Missing email');}
  if (!user.hasOwnProperty("password")) 
    {errors.push('Missing password');}  
  if (user.role != "admin" && user.role != "customer" && user.role != undefined) {
    errors.push("Unknown role");
    }

  return errors;
};

module.exports = {
  deleteUserById,
  emailInUse,
  getAllUsers,
  getUser,
  getUserById,
  resetUsers,
  saveNewUser,
  updateUserRole,
  validateUser
};
