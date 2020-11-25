const path = require('path');
const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: dotEnvPath });

const { connectDB, disconnectDB } = require('../models/db');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

const users = require('./users.json').map(user => ({ ...user }));
const products = require('./products.json').map(product => ({ ...product }));

(async () => {
  connectDB();
  /*
  try {
    const Order = require('../models/order');
    await Order.deleteMany({});
  } catch (error) {console.log("erroria orderin kanssa");}

  try {
    const Product = require('../models/product');
    await Product.deleteMany({});
    await Product.create(products);
    console.log('Created products');
  } catch (error) {console.log("erroria productin kanssa.");}
  */

  //console.log(products);

  const Order = require('../models/order');
  await Order.deleteMany({});
  console.log("Deleted orders");

  await Product.deleteMany({});
  await Product.create(products);
  console.log("Created products");

  await User.deleteMany({});
  await User.create(users);
  console.log('Created users');

  disconnectDB();
})();
