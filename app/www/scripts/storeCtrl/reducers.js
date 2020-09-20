import actionNames from './actionNames';

function users(userObjects = [], action) {
  switch (action.type) {
    case actionNames.GET_USERS:
      return action.payload;
    default:
      return userObjects;
  }
}

function loginAsUser(loggedInUserObj = null, action) {
  switch (action.type) {
    case actionNames.LOGIN:
      return action.payload;
    default:
      return loggedInUserObj;
  }
}

function events(eventsArray = [], action) {
  switch (action.type) {
    case actionNames.GET_EVENTS:
      return action.payload;
    default:
      return eventsArray;
  }
}

function event(eventObj = {}, action) {
  switch (action.type) {
    case actionNames.GET_EVENT:
      return action.payload;
    default:
      return eventObj;
  }
}

function rootReducer(state = {}, action) {
  return {
    users: users(state.users, action),
    events: events(state.events, action),
    event: event(state.event, action),
    loggedInUser: loginAsUser(state.loggedInUser, action)
  };
}

export default rootReducer;
