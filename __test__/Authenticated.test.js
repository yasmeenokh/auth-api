'use strict';

const server = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const request = supergoose(server.server);
process.env.SECRET = 'toes';

let users = [
  {username : 'admin', password : 'password', role : 'admin'},
  {username : 'editor', password : 'password', role : 'editor'},
  {username : 'user', password : 'password', role : 'user'},

];
let clothes = {
  name : 'scarf',
  color : 'red',
  size : 'L',
};

let food = {
  name: 'burger',
  calories: 450,
  type: 'PROTIEN',
};

let token = {};

users.map(user =>{
  let id;
  describe('/api/v2/clothes route test', ()=>{
    it('Should be able to sign up', async()=>{
      const response = await request.post('/signup').send(user);
      expect(response.status).toBe(201);
      expect(response.body.user.username).toEqual(user.username);
      expect(response.body.token).toBeDefined();
      expect(response.body.user._id).toBeDefined();
      token[user.username] = response.body.token;

    });
    it('Should be able to create a new food Or clothes object /post if the role was admin or editor', async()=>{
      const response = await request.post('/api/v2/clothes').set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('scarf');
        expect(response.body.color).toBe('red');
        id = response.body._id;

      }
    });
    it('Should be able to get data by id for all roles /get', async()=>{
      const response = await request.get(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('scarf');
        expect(response.body.size).toBe('L');
      }
    });

    it('Should be able to update a new food Or clothes object /post if the role was admin or editor', async()=>{
      let edited = {
        name : 'scarf',
        color : 'red',
        size : 'small',
      };
      const response = await request.put(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(edited);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('scarf');
        expect(response.body.size).toBe('small');

      }
    });
  
    it('Should be able to get data by id for all roles /get', async()=>{
      if ((user.role === 'admin' || user.role === 'editor' || user.role === 'user')){
        const response = await request.get('/api/v2/clothes').set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
      }
    });
    it('Should deny create a new obj when the role is user', async()=>{
      const response = await request.post('/api/v2/clothes').set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny updating an obj when the role is user', async()=>{
      const response = await request.put(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny deleting an obj when the role is user', async()=>{
      const response = await request.delete(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny deleting an obj when the role is editor', async()=>{
      const response = await request.delete(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'editor')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should allow deleting an obj when the role is admin', async()=>{
      const response = await request.delete(`/api/v2/clothes/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(clothes);
      if ((user.role === 'admin')){
        expect(response.status).toBe(200);
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

users.map(user =>{
  let id;
  
  describe('/api/v2/food route test', ()=>{
    it('Should be able to create a new food Or food object /post if the role was admin or editor', async()=>{
      const response = await request.post('/api/v2/food').set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('burger');
        expect(response.body.calories).toBe(450);
        id = response.body._id;

      }
    });
    it('Should be able to get data by id for all roles /get', async()=>{
      const response = await request.get(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('burger');
        expect(response.body.calories).toBe(450);
      }
    });

    it('Should be able to update a new food Or clothes object /post if the role was admin or editor', async()=>{
      let edited = {
        name: 'burger',
        calories: 550,
        type: 'PROTIEN',
      };
      const response = await request.put(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(edited);
      if ((user.role === 'admin' || user.role === 'editor')){
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('burger');
        expect(response.body.calories).toBe(550);

      }
    });
  
    it('Should be able to get data by id for all roles /get', async()=>{
      if ((user.role === 'admin' || user.role === 'editor' || user.role === 'user')){
        const response = await request.get('/api/v2/food').set('Authorization', `Bearer ${token[user.username]}` ).send(food);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
      }
    });
    it('Should deny create a new obj when the role is user', async()=>{
      const response = await request.post('/api/v2/food').set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny updating an obj when the role is user', async()=>{
      const response = await request.put(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny deleting an obj when the role is user', async()=>{
      const response = await request.delete(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'user')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should deny deleting an obj when the role is editor', async()=>{
      const response = await request.delete(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'editor')){
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Access Denied');
      }
    });
    it('Should allow deleting an obj when the role is admin', async()=>{
      const response = await request.delete(`/api/v2/food/${id}`).set('Authorization', `Bearer ${token[user.username]}` ).send(food);
      if ((user.role === 'admin')){
        expect(response.status).toBe(200);
      }
    });
  });
});