import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as RS from 'reactstrap';
import * as Actions from '../storeCtrl/actions';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentText: '' };
  }

  componentDidMount() {
    const { loadEvent, eventId } = this.props;
    loadEvent(eventId);
  }

  onComment() {
    const { commentText } = this.state;
    const { submitComment } = this.props;
    submitComment(commentText);
  }

  handleCommentInput(e) {
    this.setState({ commentText: e.target.value });
  }

  render() {
    const { event } = this.props;

    return (
      <div id="eventPage">
        <RS.Form>
          <RS.FormGroup>
            <RS.Label>Say Something</RS.Label>
            <RS.Input
              id="commentArea"
              type="textarea"
              name="commentText"
              onChange={(e) => this.handleCommentInput(e)}
            />
          </RS.FormGroup>
          <RS.Button
            onClick={() => this.onComment()}
            color="primary"
          >
            Comment
          </RS.Button>
        </RS.Form>
        <pre>{JSON.stringify(event, null, 2) }</pre>
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  loadEvent: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
  submitComment: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    event: state.event
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadEvent: async (eventId) => dispatch(await Actions.getPopulatedEvent(eventId)),
    submitComment: async (comment) => dispatch(await Actions.submitComment(comment))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
