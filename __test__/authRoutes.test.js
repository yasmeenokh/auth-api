'use strict';
require('dotenv').config();
process.env.SECRET = 'words';

const server = require('../src/server').server;
const supergooes = require('@code-fellows/supergoose');
const mockRequest = supergooes(server);
const mangoose = require('mongoose');
const base64 = require('base-64');
const { expect } = require('@jest/globals');
const bearer = require('../src/auth/middleware/bearer');


let users = {
  admin: { username: 'admin', password: 'password' },
  editor: { username: 'editor', password: 'password' },
  user: { username: 'user', password: 'password' },
};
  
describe('Auth Router', () => {
  
  Object.keys(users).forEach(userType => {
  
    describe(`${userType} users`, () => {
  
      it('Should create a new use when signing up ', async () => {
  
        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;
  
        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
  
      });
  
      it('Should sign in with basicAuth', async () => {
  
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);
  
        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
  
      });
  
      it('Should sign in with bearerAuth', async () => {
        const response = await mockRequest.post('/signin').auth(users[userType].username, users[userType].password);
        const token = response.body.token;
        expect(response.status).toBe(200);
      });
  
    });
  
    describe('Invalid logins', () => {
      it('Should fail to sign in with the right username and wrong password ', async () => {
  
        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz');
        const userObject = response.body;
  
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
  
      });
  
      it('Should fail  to sign in with the wrong username', async () => {
  
        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz');
        const userObject = response.body;
  
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
  
      });
  
      it('bearer fails with an invalid token', async () => {
        const bearerResponse = await mockRequest
          .get('/users').set('Authorization', `Bearer foobar`);
        expect(bearerResponse.status).toBe(500);
  
      });
    });
  
  });
  
});