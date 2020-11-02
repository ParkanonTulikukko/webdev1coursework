const responseUtils = require('./utils/responseUtils');
const users = require('./utils/users');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, updateUserRole } = require('./utils/users');
const requestUtils = require('./utils/requestUtils');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    throw new Error('Not Implemented');
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {

    // TODO: 8.4 Add authentication (only allowed to users with role "admin")

    //should respond with Basic Auth Challenge when Authorization header is missing
    //should respond with Basic Auth Challenge when Authorization header is empty
    let authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
      }

    //checking if authorization header is properly encoded
    //by encoding it back to base64 and comparing the result with the original string
    let length = request.headers['authorization'].length;
    let codedCredentials = request.headers['authorization'].substring(6, length+1);
    const buff = Buffer.from(codedCredentials, 'base64');
    if (codedCredentials != buff.toString('base64')) {
      return responseUtils.basicAuthChallenge(response);
      }  

    //should respond with Basic Auth Challenge when Authorization credentials are incorrect
    let credentials = requestUtils.getCredentials(request);
    let user = users.getUser(credentials[0], credentials[1]);
    if (user === undefined) {
      return responseUtils.basicAuthChallenge(response);
      }
      
    //should respond with "403 Forbidden" when customer credentials are received
    if (user.role === "customer") {
      response.statusCode = 403;
      return response.end();
      } 

    // TODO: 8.3 Return all users as JSON
    return responseUtils.sendJson(response, getAllUsers());
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    //console.log("hello");
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.3 Implement registration
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const newUser = await parseBodyJson(request);
    let errors = validateUser(newUser);
    if (errors.length === 0 && !emailInUse(newUser.email)) {
      let nu = saveNewUser(newUser);
      return responseUtils.createdResource(response, nu, 'test')
    } else {
      return responseUtils.badRequest(response, 'test');
    }
    // throw new Error('Not Implemented');
  }
};

module.exports = { handleRequest };
