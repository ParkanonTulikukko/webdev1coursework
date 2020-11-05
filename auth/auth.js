const requestUtils = require('../utils/requestUtils.js');
const users = require('../utils/users.js');

const { createRequest } = require('node-mocks-http');
const getRequest = headers => createRequest({ headers });
const getHeaders = () => {
  return {
    authorization: `Basic YWRtaW5AZW1haWwuY29tOjEyMzQ1Njc4OTA=`,
    accept:
      'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'content-type': 'application/json'
  };
};

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.4 Implement getting current user based on the "Authorization" request header
  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  //console.log("*****get current user*****");
  //console.log(requestUtils.getCredentials(request)); 
  const credentials = requestUtils.getCredentials(request);
  if (credentials === null) {
    return null;
    }
  //console.log(credentials[0] + " " + credentials[1]);
  return users.getUser(credentials[0], credentials[1]);
};

/*
let req = getRequest(getHeaders);
req.headers['authorization'] = `Basic YWRtaW5AZW1haWwuY29tOjEyMzQ1Njc4OTA=`;
console.log(req.headers);
console.log(getCurrentUser(req));
*/
module.exports = { getCurrentUser };
