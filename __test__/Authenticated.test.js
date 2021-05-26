'use strict';

const server = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth/middleware/bearer.js');
const acl = require('../src/auth/middleware/acl');
const request = supergoose(server.server);
process.env.SECRET = 'toes';

let users = [
  {username : 'admin', password : 'password', role : 'admin'},
  {username : 'editor', password : 'password', role : 'editor'},
  {username : 'user', password : 'password', role : 'user'},

];

describe('The admin access', ()=>{
  let token; 
  let id; 
  it('should be able to post', async ()=>{
    const response = await request.post('/signup');
    token = response.body.token;
    await request.post('/api/v2/clothes').set('Authorization', `Bearer ${token}`).send({name : 'scarf', color: 'red', size: 'L'});
  });
});

