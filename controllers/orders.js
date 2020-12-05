const { Mongoose } = require('mongoose');
const Order = require('../models/order');
const responseUtils = require('../utils/responseUtils');


/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response - reference to the http response to attach all orders to
 */
const getAllOrders = async response => {
  return responseUtils.sendJson(response, await Order.find({}));
};


// const deleteOrder = async (response, orderId) => {
//   const order = await Order.findById(orderId);
//   if (order !== null) {
//     await Order.deleteOne({ _id: orderId });
//     responseUtils.sendJson(response, order);
//   } else {
//     return responseUtils.notFound(response);
//   }
// };



/**
 * 
 * @param {http.ServerResponse} response res to modify 
 * @param {object} user user object 
 */
const getOwnOrders = async (response, user) => {
  const orders = await Order.find({customerId: user._id});
  if (orders !== null) {
    return responseUtils.sendJson(response, orders);
  } else {
    return responseUtils.notFound(response);
  }
};

/**
 * 
 * @param {http.ServerResponse} response res to modify
 * @param {string} orderId orderid as a string 
 * @param {object} user requesters user object
 */
const getOrder = async (response, orderId, user) => {
  const order = await Order.findById(orderId);
  if (order !== null) {
    //console.log(user.role, order.customerId.equals(user._id));
    if (user.role === 'admin' || order.customerId.equals(user._id)) {
      return responseUtils.sendJson(response, order);
    } 
  }
  return responseUtils.notFound(response);
};

/**
 * 
 * @param {http.ServerResponse} response res to modify
 * @param {object} itemsData object with itemdata
 * @param {object} user req's user object
 */
const registerOrder = async (response, itemsData, user) => {
  // if (itemsData.items.length === 0 || itemsData === undefined) {
  //   return responseUtils.badRequest(response);
  // } 

  const itemsToAdd = itemsData.items;

  try {
    const order = new Order({ customerId: user._id, items: itemsToAdd });
    const saveUser = await order.save();
    return responseUtils.createdResource(response, saveUser);
  } catch (e) {
    return responseUtils.badRequest(response, 'order insertion failed because itemdata was incorrectly formatted');
  }
};

module.exports = { getAllOrders, getOwnOrders, getOrder, registerOrder };