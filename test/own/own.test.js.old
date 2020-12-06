const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { handleRequest } = require('../../routes');
const { resetUsers } = require('../../utils/users');

const registrationUrl = '/api/register';
const usersUrl = '/api/users';
const productsUrl = '/api/products';
const contentType = 'application/json';
chai.use(chaiHttp);

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random().toString(36).substr(2, 9).trim();
  } while (str.length < len);

  return str.substr(0, len);
};

// Get users (create copies for test isolation)
const users = require('../../users.json').map(user => ({ ...user }));
const products = require('../../products.json').map(product => ({ ...product }));

const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);
const invalidCredentials = encodeCredentials(adminUser.email, customerUser.password);

const unknownUrls = [`/${generateRandomString(20)}.html`, `/api/${generateRandomString(20)}`];

describe('OWN ISSUES', () => {
  // get randomized test user
  const getTestUser = () => {
    return {
      name: 'Name',
      email: `${generateRandomString()}@email.com`,
      password: generateRandomString(10)
    };
  };

  beforeEach(() => resetUsers());

  describe('Own issues', () => {
    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   

    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   
        
    describe('Total sum of the products', () => {
            it('should show total sum of the products', async () => {
                throw new Error('Not Implemented');
                });//it
            });//describe   

    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   

    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   
        
    describe('Total sum of the products', () => {
            it('should show total sum of the products', async () => {
                throw new Error('Not Implemented');
                });//it
            });//describe   
    
    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   

    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   
        
    describe('Total sum of the products', () => {
            it('should show total sum of the products', async () => {
                throw new Error('Not Implemented');
                });//it
            });//describe   

    describe('Total sum of the products', () => {
        it('should show total sum of the products', async () => {
            throw new Error('Not Implemented');
            });//it
        });//describe   

    });//describe

});
