import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

class GroupMeetingPage extends Component {
  constructor() {
    super();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.props.ws.emit('action', {
        name: this.props.name,
        actionType: 'REQUESTED_TURN',
    });
  }

  handleMouseUp(e) {
    e.preventDefault();
    const { ws, name, isSpeaking, currentSpeakerName, stopSpeaking } = this.props;

    if (isSpeaking) {
      ws.emit('action', {
        name,
        actionType: name === currentSpeakerName ? 'ENDED_TURN' : 'STOPPED_TURN_REQUEST',
      });
      stopSpeaking();
    }
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      browserHistory.push('/');
    } else {
      const { ws, selectedGroupId, name } = this.props;
      ws.emit('join', { groupId: selectedGroupId, name });
    }
    this.props.startMeetingTimer();
    this.props.refreshTimeLeft();
  }

  render() {
    return (
      <div className='flex-item'>
        <Paper zDepth={2} style={{margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <FlatButton
            onMouseDown={this.handleMouseDown}
            onTouchEnd={this.handleMouseUp}
            icon={<img src='/img/myturn-logo.png' alt='Press to request turn.'/>}
            style={{height: '200px', width: '200px'}}
          />
        </Paper>
      </div>
    );
  }
}

export default GroupMeetingPage;
