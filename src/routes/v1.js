'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection');

const router = express.Router();

const models = new Map();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next('Invalid Model');
    }
  }
});

router.get('/api/v1/:model', handleGetAll);
router.get('/api/v1/:model/:id', handleGetOne);
router.post('/api/v1/:model', handleCreate);
router.put('/api/v1/:model/:id', handleUpdate);
router.delete('/api/v1/:model/:id', handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);

  } catch (error) {
    if(error) res.status(403).json({error : error.message});
  }
}

async function handleGetOne(req, res) {
  try {

    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (error) {
    if(error) res.status(403).json({error : error.message});
  }
}

async function handleCreate(req, res) {
  try {

    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    if(error) res.status(403).json({error : error.message});
  }
}

async function handleUpdate(req, res) {
  try{

    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (error) {
    if(error) res.status(403).json({error : error.message});
  }
}

async function handleDelete(req, res) {
  try {

    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    if(error) res.status(403).json({error : error.message});
  }
}


module.exports = router;