const express = require('express');
const { handleAsyncError } = require('./expressHelpers');
const { NotFound, BadRequest } = require('./errorTypes');
const dbFunctions = require('./dbFunctions');

const router = express.Router();

router.get('/all/:modelname', handleAsyncError(async (req, res) => {
  const { modelname } = req.params;
  const limit = req.query.limit || 100;
  const docORMs = await dbFunctions.queryForAllDocuments(modelname, {}, limit);
  res.status(200).send(docORMs);
}));

router.get('/:modelname/:docId', handleAsyncError(async (req, res) => {
  const { modelname, docId } = req.params;
  const docORM = await dbFunctions.getDocument(modelname, docId);
  if (!docORM) throw new NotFound(`no ${modelname} with id: ${docId}`);
  res.status(200).send(docORM);
}));

router.post('/:modelname/query', handleAsyncError(async (req, res) => {
  const { modelname } = req.params;
  const query = req.body;
  const docORM = await dbFunctions.queryForOneDocument(modelname, query);
  if (!docORM) throw new NotFound(`no ${modelname} with query: ${JSON.stringify(query)}`);
  res.status(201).send(docORM);
}));

router.post('/addComment/:eventId', handleAsyncError(async (req, res) => {
  const { eventId } = req.params;
  const { userId, commentText } = req.body;
  if (!userId || !commentText) {
    throw new BadRequest('missing userId or commentText');
  }
  await dbFunctions.addComment(eventId, userId, commentText);
  res.status(201).send('OK');
}));

module.exports = {
  router
};
