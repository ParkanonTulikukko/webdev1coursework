const responseUtils = require('./utils/responseUtils');
const controllerUsers = require('./controllers/users');
//const User = require('./models/user');
//const Product = require('./models/product');
const { getCurrentUser } = require('./auth/auth');
//const products = require('./utils/products');
const controllerProducts = require('./controllers/products');
const controllerOrders = require('./controllers/orders');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
//const users = require('./utils/users');
//const { emailInUse, getAllUsers, saveNewUser, validateUser, updateUserRole, getUserById } = require('./utils/users');
//const requestUtils = require('./utils/requestUtils');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST'],
  '/api/orders': ['GET', 'POST']
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

/**
 * Does the URL match /api/products/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

/**
 * Does the URL match /api/orders/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  //console.log(filePath);

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = (filePath === '/' || filePath === '') ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const authorization = request.headers['authorization'];
    // auth checks
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    //const credentials = requestUtils.getCredentials(request);
    //const user = users.getUser(credentials[0], credentials[1]);
    const currentUser = await getCurrentUser(request);
    if (currentUser === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    
    // if (currentUser === null) {
    //   return responseUtils.basicAuthChallenge(response);
    // }
    // if (currentUser.role === 'customer') {
    //   return responseUtils.forbidden(response);
    // }

    const fp = filePath.split('/');
    const userid = fp[fp.length - 1];
    //const user = await User.findById(userid);

    //if (user === null) return responseUtils.notFound(response);

    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }

    if (method.toUpperCase() === 'GET') {
      return controllerUsers.viewUser(response, userid, currentUser);
    } else if (method.toUpperCase() === 'PUT') {
      return controllerUsers.updateUser(response, userid, currentUser, await parseBodyJson(request));
    } else if (method.toUpperCase() === 'DELETE') {
      return controllerUsers.deleteUser(response, userid, currentUser);
    } else {
      return responseUtils.badRequest(response);
    }
  }

  // Direct SINGLE product (products/{id}) GET, PUT, DELETE to product controller functions based on http method. 
  if (matchProductId(filePath)) {
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if (currentUser === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    const fp = filePath.split('/');
    const productId = fp[fp.length - 1];
    if (method.toUpperCase() === 'GET') {
      return controllerProducts.getProduct(response, productId);
    } else if (method.toUpperCase() === 'PUT') {
      if (currentUser.role !== 'admin') {
        return responseUtils.forbidden(response);
      }
      return controllerProducts.updateProduct(response, productId, await parseBodyJson(request));
    } else if (method.toUpperCase() === 'DELETE') {
      if (currentUser.role !== 'admin') {
        return responseUtils.forbidden(response);
      }
      return controllerProducts.deleteProduct(response, productId);
    } else {
      return responseUtils.methodNotAllowed(response);
    }
  }

  // same as above but with orders
  if (matchOrderId(filePath)) {
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if (currentUser === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    const fp = filePath.split('/');
    const orderId = fp[fp.length - 1];
    if (method.toUpperCase() === 'GET') {
      return controllerOrders.getOrder(response, orderId, currentUser);
    } else {
      return responseUtils.methodNotAllowed(response);
    }
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

    //console.log(request.headers['authorization']);
    // TODO: 8.4 Add authentication (only allowed to users with role "admin")
    //should respond with Basic Auth Challenge when Authorization header is missing
    //should respond with Basic Auth Challenge when Authorization header is empty
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }

    //checking if authorization header is properly encoded
    //by encoding it back to base64 and comparing the result with the original string
    const length = request.headers['authorization'].length;
    const codedCredentials = request.headers['authorization'].substring(6, length + 1);
    const buff = Buffer.from(codedCredentials, 'base64');
    if (codedCredentials !== buff.toString('base64')) {
      return responseUtils.basicAuthChallenge(response);
    }

    //should respond with Basic Auth Challenge when Authorization credentials are incorrect
    //const credentials = requestUtils.getCredentials(request);
    //const user = users.getUser(credentials[0], credentials[1]);
    const user = await getCurrentUser(request);
    if (user === null) {
      return responseUtils.basicAuthChallenge(response);
    }

    //should respond with "403 Forbidden" when customer credentials are received
    if (user.role === "customer") {
      return responseUtils.forbidden(response);
    }

    // TODO: 8.3 Return all users as JSON
    //return responseUtils.sendJson(response, getAllUsers());
    //const allUsers = await User.find({});
    //return responseUtils.sendJson(response, allUsers);
    return controllerUsers.getAllUsers(response);

  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.3 Implement registration
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const newUser = await parseBodyJson(request);

    // const errors = validateUser(newUser);
    // if (errors.length === 0 && !emailInUse(newUser.email)) {
    //   const nu = saveNewUser(newUser);
    //   return responseUtils.createdResource(response, nu, 'test');
    // } else {
    //   return responseUtils.badRequest(response, 'test');
    // }
    // throw new Error('Not Implemented');
    // try {
    //   let newUserAdded = new User(newUser);
    //   newUserAdded.role = "customer";
    //   await newUserAdded.save();
    //   return responseUtils.createdResource(response, newUserAdded);
    // } catch (e) {
    //   //console.log(e);
    //   return responseUtils.badRequest(response, 'invalid user info');
    // }
    return controllerUsers.registerUser(response, newUser);
  }

  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    //1) should respond with "401 Unauthorized" when Authorization header is missing
    //2) should respond with Basic Auth Challenge when Authorization header is missing
    //Respond with Basic Auth Challenge (w/ status code 401) when "authorization" header is empty or missing
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }

    //3) should respond with Basic Auth Challenge when Authorization credentials are incorrect
    //const credentials = requestUtils.getCredentials(request);
    const user = await getCurrentUser(request);
    if (user === null) {
      return responseUtils.basicAuthChallenge(response);
    }

    // should respond with JSON when admin credentials are received
    // should respond with JSON when customer credentials are received
    // should respond with correct data when admin credentials are received
    // should respond with correct data when customer credentials are received
    return controllerProducts.getAllProducts(response);
  }

  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    const user = await getCurrentUser(request);
    if (user === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (user.role === 'admin') {
      const newProduct = await parseBodyJson(request);
      return controllerProducts.registerProduct(response, newProduct);
    } else {
      return responseUtils.forbidden(response);
    }
  }

  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if (currentUser === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    if (currentUser.role === 'customer') {
      const body = await parseBodyJson(request);
      return controllerOrders.registerOrder(response, body, currentUser);
    } else {
      return responseUtils.forbidden(response);
    }
  }
  
  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
    const authorization = request.headers['authorization'];
    if (authorization === undefined || authorization === "") {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if (currentUser === null) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    if (currentUser.role === 'admin') {
      return controllerOrders.getAllOrders(response);
    } else if (currentUser.role === 'customer') {
      return controllerOrders.getOwnOrders(response, currentUser);
    }
  }

};

module.exports = { handleRequest };
