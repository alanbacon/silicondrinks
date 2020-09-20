const { MongoMemoryReplSet } = require('mongodb-memory-server');

async function createPrototypeDatabase(dbName) {
  const replicaSetName = 'prototype';
  const replSet = new MongoMemoryReplSet({
    autoStart: true,
    binary: {
      version: '4.0.3',
    },
    instanceOpts: [
      { storageEngine: 'wiredTiger' },
    ],
    replSet: {
      dbName,
      name: replicaSetName,
    },
    debug: true,
  });

  await replSet.waitUntilRunning();
  return replSet;
}

async function startDatabaseGetConnectionVars() {
  const dbName = 'drinksdb';

  const replSet = await createPrototypeDatabase(dbName);
  const connectionString = await replSet.getConnectionString();
  console.info(`connectionString: ${connectionString}`);

  const databaseConnectionVars = {
    connectionString,
    dbName,
  };

  return databaseConnectionVars;
}

module.exports = {
  startDatabaseGetConnectionVars,
};
