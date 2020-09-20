const querystring = require('querystring');
const dbFunctions = require('./dbFunctions');
const { fetchPopulateBody } = require('./helpers');

const upstreamDatabaseBaseUrl = 'https://mock-api.drinks.test.siliconrhino.io/events';

class DrinkApiGetter {
  constructor() {
    this.page = 0;
    this.pageSize = 10;
    this.end = false;
  }

  async getEvents() {
    let events = [];
    this.page += 1;
    const queryString = querystring.encode({ page: this.page, pageSize: this.pageSize });
    const resp = await fetchPopulateBody(
      `${upstreamDatabaseBaseUrl}?${queryString}`,
    );
    if (resp.ok) {
      events = resp.populatedBody;
      if (events.length === 0) {
        this.end = true;
      }
    } else {
      throw new Error('upstream database down');
    }
    return events;
  }
}

async function eventExists(eventId) {
  const existingEvent = await dbFunctions.getDocument('Event', eventId);
  return !!existingEvent;
}

async function addEventToDatabaseIdempotent(event) {
  const {
    id, location, creator, guests, comments,
  } = event;
  const storedEvent = { ...event };
  delete storedEvent.id;

  if (await eventExists(id)) {
    return; // ---- feature to be added later, event may have changed for example extra comments or guests might have been added, need to diff that with local changes.
  }

  const locationORM = await dbFunctions.getOrCreateDocumentUsingField('Location', 'name', location);
  const creatorORM = await dbFunctions.getOrCreateDocumentUsingField('User', 'name', creator);
  const guestORMs = await Promise.all(guests.map(
    (guest) => dbFunctions.getOrCreateDocumentUsingField('User', 'name', guest)
  ));
  const commentORMs = [];
  for (const comment of comments) { // can't use promise all because it introduces a race condition on user creation
    const { user } = comment;
    const storedComment = { ...comment };
    const userORM = await dbFunctions.getOrCreateDocumentUsingField('User', 'name', user);
    storedComment.user = userORM._id;
    const commentORM = dbFunctions.createDocument('Comment', storedComment);
    await dbFunctions.saveDocs([commentORM]);
    commentORMs.push(commentORM);
  }

  const eventORM = dbFunctions.createDocument('Event', {
    ...storedEvent,
    _id: id,
    location: locationORM._id,
    creator: creatorORM._id,
    guests: guestORMs.map((orm) => orm._id),
    comments: commentORMs.map((orm) => orm._id)
  });

  await dbFunctions.saveDocs([eventORM]);
}

async function importFromUpsteamDatabase() {
  const getter = new DrinkApiGetter();
  while (!getter.end) {
    const events = await getter.getEvents();
    for (const event of events) { // can't use promise all because it introduces a race condition on location and user creation
      await addEventToDatabaseIdempotent(event);
    }
  }
}

module.exports = {
  importFromUpsteamDatabase
};
