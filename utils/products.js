const products = require('../products.json');

const getAllProducts = () => {
    return JSON.parse(JSON.stringify(products));
    };

//console.log(getAllProducts());    

module.exports = {
    getAllProducts
    };