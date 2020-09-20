const { drinksModels } = require('./schema');

function getModel(docType) {
  const Model = drinksModels[docType];
  if (!Model) {
    throw new Error(`unknown document type "${docType}"`);
  }
  return Model;
}

async function getDocument(docType, id) {
  const Model = getModel(docType);
  const docORM = await Model.findById(id);
  if (!docORM) {
    console.debug(`Document not found for ${docType}: ${id}`);
    return null;
  }
  return docORM;
}

function createDocument(docType, initObj) {
  const Model = getModel(docType);
  return new Model(initObj);
}

async function saveDocs(docs) {
  const savePromises = docs.map((doc) => doc.save());
  await Promise.all(savePromises);
}

async function queryForOneDocument(docType, query) {
  const Model = getModel(docType);
  return await Model.findOne(query);
}

async function queryForAllDocuments(docType, query, limit = 100) {
  const Model = getModel(docType);
  return await Model.find(query).limit(limit);
}

async function getOrCreateDocumentUsingField(docType, fieldName, initObj) {
  const query = {};
  query[fieldName] = initObj[fieldName];
  let docORM = await queryForOneDocument(docType, query);
  if (!docORM) {
    docORM = createDocument(docType, initObj);
    await saveDocs([docORM]);
  }
  return docORM;
}

async function addComment(eventId, userId, commentText) {
  const now = new Date();
  const commentORM = createDocument('Comment', {
    user: userId,
    timestamp: now.toISOString(),
    message: commentText
  });
  const eventORM = await getDocument('Event', eventId);
  eventORM.comments.push(commentORM._id);
  await saveDocs([commentORM, eventORM]);
}

module.exports = {
  getDocument,
  createDocument,
  saveDocs,
  queryForOneDocument,
  queryForAllDocuments,
  getOrCreateDocumentUsingField,
  addComment
};
