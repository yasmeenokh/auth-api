'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection');
const basicAuth = require('../auth/middleware/basic');
const bearerAuth = require('../auth/middleware/bearer');
const aclAuth = require('../auth/middleware/acl');



const router = express.Router();

const models = new Map();

router.param('model', (request, response, next)=>{
  const modelName = request.params.model;
  if(models.has(modelName)){
    request.model = models.get(modelName);
    next();
  } else{
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)){
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      request.model = models.get(modelName);
      next();
    } else {
      next('INVALID MODEL');
    }
  }
});

router.get('/api/v2/:model', bearerAuth, aclAuth('read'), handleGetAll);
router.get('/api/v2/:model/:id',bearerAuth, aclAuth('read'), handleGetOne);
router.post('/api/v2/:model', bearerAuth, aclAuth('create'), handleCreate);
router.put('/api/v2/:model/:id', bearerAuth, aclAuth('update'), handleUpdate);
router.delete('/api/v2/:model/:id', bearerAuth, aclAuth('delete'),  handleDelete);

async function handleGetAll (request, response){
  try {
    let allRecords = await request.model.get();
    response.status(200).json(allRecords);

  } catch (error) {
    if(error) response.status(403).json({error : error.message});
  }
}

async function handleGetOne (request, response){
  try {

    const id = request.params.id;
    let theRecord = await request.model.get(id);
    response.status(200).json(theRecord);
  } catch (error) {
    if(error) response.status(403).json({error : error.message});
  }
}

async function handleCreate (request, response){
  try {

    let obj = request.body;
    let newRecord = await request.model.create(obj);
    response.status(201).json(newRecord);
  }catch (error) {
    if(error) response.status(403).json({error : error.message});
  }
}
async function handleUpdate (request, response){
  try {

    const id = request.params.id;
    const obj = request.body;
    let updatedRecord = await request.model.update(id, obj);
    response.status(200).json(updatedRecord);
  } catch (error) {
    if(error) response.status(403).json({error : error.message});
  }
}

  

async function handleDelete (request, response){
  try {

    const id = request.params.id;
    let deletedRecord = await request.model.delete(id);
    response.status(200).json(deletedRecord);
  } catch (error) {
    if(error) response.status(403).json({error : error.message});
  }
}


module.exports = router;

