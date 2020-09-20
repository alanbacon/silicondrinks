import React from 'react';
import PropTypes from 'prop-types';
import {
  HashRouter, Switch, Route, Link, Redirect
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './loginPage';
import Events from './events';
import Event from './event';

class App extends React.PureComponent {
  render() {
    const { loggedInUser } = this.props;
    const loggedIn = !!loggedInUser;

    return (
      <HashRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <h1>
                  <Link to="/login">
                    Login
                  </Link>
                </h1>
              );
            }}
          />
          <Route
            exact
            path="/login"
            render={() => <LoginPage />}
          />
          <Route
            exact
            path="/Events"
            render={() => {
              return (
                <div>
                  {!loggedIn ? <Redirect to="/login" /> : <div id="no-redirect" />}
                  <Events />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Event/:eventId"
            render={(mo) => {
              return (
                <div>
                  {!loggedIn ? <Redirect to="/login" /> : <div id="no-redirect" />}
                  <Event eventId={mo.match.params.eventId} />
                </div>
              );
            }}
          />
        </Switch>
      </HashRouter>
    );
  }
}

App.propTypes = {
  loggedInUser: PropTypes.object,
};

export default App;
