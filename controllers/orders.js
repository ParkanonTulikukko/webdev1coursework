//const products = require('../products.json');
//const Product = require('../models/order');
const { OrderedItem } = require('../models/order');
const Order = require('../models/order');
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');
const mongoose = require('mongoose');
//const users = require('./users');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
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



const getOwnOrders = async (response, user) => {
  const orders = await Order.find({customerId: user._id});
  if (orders !== null) {
    return responseUtils.sendJson(response, orders);
  } else {
    return responseUtils.notFound(response);
  }
};

const getOrder = async (response, orderId, user) => {
  const order = await Order.findById(orderId);
  if (order !== null) {
    console.log(user.role, order.customerId.equals(user._id));
    if (user.role === 'admin' || order.customerId.equals(user._id)) {
      return responseUtils.sendJson(response, order);
    } 
  }
  return responseUtils.notFound(response);
};

const registerOrder = async (response, itemsData, user) => {
  //console.log(items);
  const itemsToAdd = [];
  itemsData['items'].map((i) => {
    
    const orderedItem = { 'product': i.product, 'quantity': i.quantity };
    
    //console.log("new orderedItem: ", orderedItem)
    //const p = await Product.findById(i.product._id);
    //console.log(p);
    //const q = i.quantity;
    //console.log(q);
    itemsToAdd.push(orderedItem);
    //console.log(orderedItem);
    //const a = order.validateSync();
    console.log(itemsToAdd);
  });
  try {
    const order = new Order({ customerId: user._id, items: itemsToAdd });
    //console.log(order);
    console.log(order);
    console.log(order.items);
    //order.validat
    let saveUser = await order.save();
    console.log(saveUser)
    //console.log(order);
    return responseUtils.createdResource(response, order);
  } catch (e) {
    console.log("db error", e);
    return responseUtils.badRequest(response);
  }
}

module.exports = { getAllOrders, getOwnOrders, getOrder, registerOrder };