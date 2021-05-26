'use strict'; 

const server = require('../src/server');
const superTest = require('supertest');
const supergoose = require('@code-fellows/supergoose');
const request = supergoose(server.server);
const mangoose = require('mongoose');
require('dotenv').config();

describe('Api clothes', ()=>{
  let id;
  let clothes;
  it('should create a new object using post', async()=>{
    clothes = {
      name : 'scarf',
      color : 'red',
      size : 'L',
    };
    const response = await request.post('/api/v1/clothes').send(clothes);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('scarf');
    expect(response.body.type).toEqual('red');
    expect(response.body._id.length).toBeGreaterThan(0);
    id = response.body._id;
  });
  it('get a food using Get /food/:id', async () => {
    clothes = {
      name : 'scarf',
      color : 'red',
      size : 'L',
    };
    const response = await request.get(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('scarf');
  });
  it('should update an object using put', async()=>{
    let editedClothes = {
      name : 'scarf',
      color : 'green',
      size : 'L',
    };
    const response = await request.put(`/api/v1/food/${id}`).send(editedClothes);
    expect(response.status).toEqual(200);
    expect(response.body.type).toEqual('green');
  });

  it('should retrieve all data from the DB', async()=>{
    const response = await request.get('/api/v1/clothes');
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should be able to delete data from the DB', async()=>{
    const response = await request.delete(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
  });
});

describe('Api clothes', ()=>{
  let id;
  let clothes;
  it('should create a new object using post', async()=>{
    clothes = {
      name : 'T-shirt',
      type : 'men',
    };
    const response = await request.post('/api/v1/clothes').send(clothes);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('T-shirt');
    expect(response.body.type).toEqual('men');
    expect(response.body._id.length).toBeGreaterThan(0);
    id = response.body._id;
  });
  it('get a clothes using Get /clothes/:id', async () => {
    const response = await request.get(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('T-shirt');
  });
  it('should update an object using put', async()=>{
    clothes = {
      name : 'T-shirt',
      type : 'women',
    };
    const response = await request.put(`/api/v1/clothes/${id}`).send(clothes);
    expect(response.status).toEqual(200);
    expect(response.body.type).toEqual('women');
  });
  
  it('should retrieve all data from the DB', async()=>{
    const response = await request.get('/api/v1/clothes');
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  }); 

  it('should be able to delete data from the DB', async()=>{
    const response = await request.delete(`/api/v1/clothes/${id}`);
    expect(response.status).toBe(200);
    // expect(response.body).toEqual([]);

  });


});


