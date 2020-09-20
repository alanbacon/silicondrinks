import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as RS from 'reactstrap';
import * as Actions from '../storeCtrl/actions';

class LoginPage extends React.Component {
  componentDidMount() {
    const { loadUsers } = this.props;
    loadUsers();
  }

  render() {
    const { users, loginAs, loggedInUser } = this.props;

    let continueAs = <div />;
    if (loggedInUser) {
      continueAs = (
        <Link to="/Events">
          <RS.Button
            color="primary"
          >
            {`Continue As ${loggedInUser.name}`}
          </RS.Button>
        </Link>
      );
    }

    return (
      <div id="loginPage">
        <RS.ListGroup>
          {
            users.map((user) => {
              return (
                <RS.ListGroupItem key={user._id}>
                  <RS.Button
                    className="loginButton"
                    color="info"
                    onClick={() => loginAs(user._id)}
                  >
                    Login As
                  </RS.Button>
                  {user.name}
                </RS.ListGroupItem>
              );
            })
          }
        </RS.ListGroup>
        {continueAs}
      </div>
    );
  }
}

LoginPage.propTypes = {
  users: PropTypes.array.isRequired,
  loadUsers: PropTypes.func.isRequired,
  loginAs: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object
};

function mapStateToProps(state) {
  return {
    users: state.users,
    loggedInUser: state.loggedInUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadUsers: async () => dispatch(await Actions.getUsers()),
    loginAs: async (userId) => dispatch(await Actions.loginAs(userId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
