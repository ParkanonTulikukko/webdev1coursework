//const products = require('../products.json');
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  responseUtils.sendJson(response, await Product.find({}));
  };

const deleteProduct = async (response, productId) => {
  const product = await Product.findById(productId);
  if (product !== null) {
    await Product.deleteOne({ _id: productId });
    responseUtils.sendJson(response, product); 
    }    
  else {responseUtils.notFound(response);}
  };

module.exports = { getAllProducts, deleteProduct };
