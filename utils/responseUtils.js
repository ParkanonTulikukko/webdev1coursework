const { createResponse } = require('node-mocks-http');

/**
 * Send proper basic authentication challenge headers
 * 
 * @param {http.ServerResponse} response res to modify
 */
const basicAuthChallenge = response => {
  response.statusCode = 401;
  response.setHeader('www-authenticate', 'Basic');
  return response.end();
};

const response = createResponse();
basicAuthChallenge(response);

/**
 * Helper function to send JSON type data
 * 
 * @param {http.ServerResponse} response res to modify 
 * @param {array} payload Payload to convert to JSON and to send to the requester 
 * @param {String} code HTTP response status code
 */
const sendJson = (response, payload, code = 200) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  return response.end(JSON.stringify(payload));
};

/**
 * Calls out sendJson function with status code 201
 * 
 * @param {http.ServerResponse} response res to modify  
 * @param {array} payload Payload to send to sendJson function 
 */
const createdResource = (response, payload) => {
  return sendJson(response, payload, 201);
};

/**
 * Function to call when there's no content to send
 * 
 * @param {http.ServerResponse} response res to modify 
 */
const noContent = response => {
  response.statusCode = 204;
  return response.end();
};

/**
 * Function to be called when the request is invalid
 * 
 * @param {http.ServerResponse} response res to modify
 * @param {String} errorMsg Error message
 */
const badRequest = (response, errorMsg = 'ERROR') => {
  if (errorMsg) return sendJson(response, { error: errorMsg }, 400);

  response.statusCode = 400;
  return response.end();
};

/**
 * Function to be called whent the request is unauthorized
 * 
 * @param {http.ServerResponse} response res to modify
 */
const unauthorized = response => {
  response.statusCode = 401;
  return response.end();
};

/**
 * Function to be called whent the request is forbidden
 * 
 * @param {http.ServerResponse} response res to modify
 */
const forbidden = response => {
  response.statusCode = 403;
  return response.end();
};

/**
 * Send response with the 404 status code
 * 
 * @param {http.ServerResponse} response res to modify
 */
const notFound = response => {
  response.statusCode = 404;
  return response.end();
};

/**
 * Send response with the 405 status code
 * 
 * @param {http.ServerResponse} response res to modify
 */
const methodNotAllowed = response => {
  response.statusCode = 405;
  return response.end();
};

/**
 * Send response with the 406 status code
 * 
 * @param {http.ServerResponse} response res to modify
 */
const contentTypeNotAcceptable = response => {
  response.statusCode = 406;
  return response.end();
};

/**
 * Send response with the 500 status code
 * 
 * @param {http.ServerResponse} response res to modify
 */
const internalServerError = response => {
  response.statusCode = 500;
  return response.end();
};

/**
 * Send response with the 500 status code and redirect to the given URL
 * 
 * @param {http.ServerResponse} response res to modify
 * @param {String} URL to be redirect
 */
const redirectToPage = (response, page) => {
  response.writeHead(302, { Location: page });
  response.end();
};

module.exports = {
  sendJson,
  createdResource,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  methodNotAllowed,
  contentTypeNotAcceptable,
  internalServerError,
  basicAuthChallenge,
  redirectToPage
};
