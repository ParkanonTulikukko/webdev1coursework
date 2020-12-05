//const products = require('../products.json');
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response res to modify
 */
const getAllProducts = async response => {
  responseUtils.sendJson(response, await Product.find({}));
  };

const getProduct = async (response, productId) => {
  const product = await Product.findById(productId);
  if (product !== null) {
    return responseUtils.sendJson(response, product);
  } else {
    return responseUtils.notFound(response);
  }
}

const deleteProduct = async (response, productId) => {
  const product = await Product.findById(productId);
  if (product !== null) {
    await Product.deleteOne({ _id: productId });
    return responseUtils.sendJson(response, product); 
    }    
  else {return responseUtils.notFound(response);}
  };

  const updateProduct = async (response, productId, productData) => {
    const product = await Product.findById(productId);
    if (product !== null) {
      try {
        Object.keys(productData).map((v) => {
          if (v !== '_id') {
            product[v] = productData[v];
          }
        });
        await product.save();
        return responseUtils.sendJson(response, product);
      } catch (e) {
        return responseUtils.badRequest(response, "Incorrect product update information");
      }
    } else {
      return responseUtils.notFound(response);
    }
  };

  const registerProduct = async (response, product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return responseUtils.createdResource(response, newProduct);
    } catch (e) {
      return responseUtils.badRequest(response, "incorrect product information");
    }
  }

module.exports = { getAllProducts, getProduct, deleteProduct, updateProduct, registerProduct };
