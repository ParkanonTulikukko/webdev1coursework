//const products = require('../products.json');
const Product = require('../models/order');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllOrders = async response => {
  responseUtils.sendJson(response, await Order.find({}));
  };


const deleteOrder = async (response, orderId) => {
  const order = await Order.findById(orderId);
  if (order !== null) {
    await Order.deleteOne({ _id: orderId });
    responseUtils.sendJson(response, order); 
    }    
  else {responseUtils.notFound(response);}
  };

module.exports = { getAllOrders, deleteOrder };