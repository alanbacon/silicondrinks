import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as RS from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Actions from '../storeCtrl/actions';

class Events extends React.Component {
  componentDidMount() {
    const { loadEvents } = this.props;
    loadEvents();
  }

  render() {
    const { events } = this.props;

    return (
      <div id="eventsPage">
        <RS.ListGroup>
          {
            events.map((event) => {
              return (
                <Link key={event._id} to={`/Event/${event._id}`}>
                  <RS.ListGroupItem>
                    {`${event.title} ${event.time}`}
                  </RS.ListGroupItem>
                </Link>
              );
            })
          }
        </RS.ListGroup>
      </div>
    );
  }
}

Events.propTypes = {
  events: PropTypes.array.isRequired,
  loadEvents: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadEvents: async () => dispatch(await Actions.getEvents())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);
