const products = require('../products.json');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(products));
};

module.exports = { getAllProducts };
