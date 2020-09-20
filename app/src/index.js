const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { router } = require('./router');
const { logRequestsAndResponses, parseBodyAndCheckContentType } = require('./expressHelpers');
const { startDatabaseGetConnectionVars } = require('./prototypeMongodbInstance');
const { importFromUpsteamDatabase } = require('./importThirdParty');

const app = express();

async function connectToDatabase() {
  const databaseConnectionVars = await startDatabaseGetConnectionVars();

  mongoose.connection.on('connected', () => {
    console.log('connection established successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`connection to mongo failed ${err.message}`);
  });

  mongoose.connection.on('connecting', () => {
    console.log('trying to establish a connection to mongo');
  });

  const connectionArgs = [
    databaseConnectionVars.connectionString,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: databaseConnectionVars.dbName,
    },
  ];
  await mongoose.connect(...connectionArgs);
}

async function start(port) {
  await connectToDatabase();
  await importFromUpsteamDatabase();

  app.use(logRequestsAndResponses);
  app.use(parseBodyAndCheckContentType);
  app.use('/api/', router);
  app.use('/', express.static(path.join(__dirname, '../www')));
  await new Promise((resolve, reject) => {
    app.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

start(80).catch(console.error);
