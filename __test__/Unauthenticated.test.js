'use strict'; 

const server = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const request = supergoose(server.server);

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
    expect(response.body.color).toEqual('red');
    expect(response.body._id.length).toBeGreaterThan(0);
    id = response.body._id;
  });
  it('get a clothes object using Get clothes/:id', async () => {
    clothes = {
      name : 'scarf',
      color : 'red',
      size : 'L',
    };
    const response = await request.get(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('scarf');
  });
  it('should update an object using put', async()=>{
    let editedClothes = {
      name : 'scarf',
      color : 'green',
      size : 'L',
    };
    const response = await request.put(`/api/v1/clothes/${id}`).send(editedClothes);
    expect(response.status).toEqual(200);
    expect(response.body.color).toEqual('green');
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

describe('food API', ()=>{
  let id;
  let food = {
    name: 'burger',
    calories: 450,
    type: 'PROTIEN',
  };
  it('Should create a new food object using post', async ()=>{
    const response = await request.post('/api/v1/food').send(food);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('burger');
    expect(response.body.calories).toBe(450);
    expect(response.body.type).toBe('PROTIEN');
    expect(response.body._id.length).toBeTruthy();
    id = response.body._id;
  });
  it('Should be able to get a food obj based on its id using get', async()=>{
    const response = await request.get(`/api/v1/food/${id}`).send(food);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('burger');
    expect(response.body.calories).toBe(450);
    expect(response.body.type).toBe('PROTIEN');
    expect(response.body._id.length).toBeTruthy();
  });
  it('Should be able to retrieve all data from the DB', async()=>{
    const response = await request.get('/api/v1/food').send(food);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
  it('Should be able to update data', async()=>{
    let edited = {
      name : 'burger',
      calories : 550, 
      type : 'PROTIEN',
    };
    const response = await request.put(`/api/v1/food/${id}`).send(edited);
    expect(response.status).toEqual(200);
    expect(response.body.calories).toEqual(550);
  });
  it('Should be able to delete data from the DB', async()=>{
    let edited = {
      name : 'burger',
      calories : 550, 
      type : 'PROTIEN',
    };
    const response = await request.delete(`/api/v1/food/${id}`).send(edited);
    expect(response.status).toEqual(200);
  });
});