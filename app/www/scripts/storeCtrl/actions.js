import actionNames from './actionNames';
import store from './store';

async function fetchPopulateBody(...args) {
  const resp = await fetch(...args);
  const contentType = resp.headers.get('content-type');
  if (contentType.includes('application/json')) {
    resp.populatedBody = await resp.json();
  } else {
    resp.populatedBody = await resp.text();
  }
  return resp;
}

async function loginAs(userId) {
  const resp = await fetchPopulateBody(`/api/User/${userId}`);
  return {
    type: actionNames.LOGIN,
    payload: resp.populatedBody
  };
}

async function getUsers() {
  const resp = await fetchPopulateBody('/api/all/User');
  return {
    type: actionNames.GET_USERS,
    payload: resp.populatedBody
  };
}

async function getEvents() {
  const resp = await fetchPopulateBody('/api/all/Event');
  return {
    type: actionNames.GET_EVENTS,
    payload: resp.populatedBody
  };
}

async function fetchUser(userId) {
  const resp = await fetchPopulateBody(`/api/User/${userId}`);
  return resp.populatedBody;
}

async function fetchComment(commentId) {
  const resp = await fetchPopulateBody(`/api/Comment/${commentId}`);
  const rawComment = resp.populatedBody;
  const comment = { ...rawComment };
  comment.user = await fetchUser(rawComment.user);
  return comment;
}

async function fetchLocation(locationId) {
  const resp = await fetchPopulateBody(`/api/Location/${locationId}`);
  return resp.populatedBody;
}

async function getPopulatedEvent(eventId) {
  const resp = await fetchPopulateBody(`/api/Event/${eventId}`);
  const rawEvent = resp.populatedBody;
  const event = { ...rawEvent };
  event.location = await fetchLocation(rawEvent.location);
  event.creator = await fetchUser(rawEvent.creator);
  event.comments = await Promise.all(rawEvent.comments.map(
    (commentId) => fetchComment(commentId)
  ));
  event.guests = await Promise.all(rawEvent.guests.map(
    (userId) => fetchUser(userId)
  ));

  return {
    type: actionNames.GET_EVENT,
    payload: event
  };
}

async function submitComment(commentText) {
  const state = store.getState();
  const { loggedInUser, event } = state;
  const eventId = event._id;
  await fetchPopulateBody(`/api/addComment/${eventId}`, {
    method: 'post',
    body: JSON.stringify({
      userId: loggedInUser._id,
      commentText
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await getPopulatedEvent(eventId);
}

export {
  getUsers,
  getEvents,
  getPopulatedEvent,
  loginAs,
  submitComment
};
