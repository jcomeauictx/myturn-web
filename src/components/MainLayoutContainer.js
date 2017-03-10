import find from 'lodash/find';
import SocketIOClient from 'socket.io-client';
import moment from 'moment';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconHome from 'material-ui/svg-icons/action/home';
import IconRecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import IconAssessment from 'material-ui/svg-icons/action/assessment';
import { msToClock } from '../helpers/timeConversions';
import { DISCUSSION_STATUS, API_URL } from '../Constants';

class MainLayoutContainer extends Component {
  constructor() {
    super()

    this.state = {
      groups: [],
      selectedGroupId: null,
      name: '',
      isLoggedIn: false,
      isSpeaking: false,
      currentGroupDetails: {},
      currentSpeakerName: null,
      discussionStatus: 0,
      timeLeftStr: '',
      isDiscussionFinished: false,
      hasError: false,
      errorMessage: '',
      previousGroupId: '',
    }

    this.webSocket = SocketIOClient(`${API_URL}/groups`);

    this.finishDiscussion = this.finishDiscussion.bind(this);
    this.expireTurn = this.expireTurn.bind(this);
    this.startMeetingTimer = this.startMeetingTimer.bind(this);
    this.startTurnTimer = this.startTurnTimer.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.refreshTimeLeft = this.refreshTimeLeft.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeGroup = this.changeGroup.bind(this);
    this.changeDiscussionStatus = this.changeDiscussionStatus.bind(this);
    this.addNewGroup = this.addNewGroup.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.fetchCurrentGroup = this.fetchCurrentGroup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  finishDiscussion() {
    this.setState({
      isDiscussionFinished: true,
      discussionStatus: 3,
      isSpeaking: false,
      currentSpeakerName: null,
      selectedGroupId: null,
      isLoggedIn: false,
      previousGroupId: this.state.currentGroupDetails._id,
    });
    this.webSocket.emit('action', { actionType: 'DISCUSSION_EXPIRED', name: this.state.name });
    browserHistory.push('/report');
  }

  expireTurn() {
    if (this.state.isSpeaking) {
      this.webSocket.emit('action', { actionType: 'TURN_EXPIRED', name: this.state.name });
      this.setState({ isSpeaking: false });
    }
  }

  startMeetingTimer() {
    const { startTimestamp: startTime, discussionLength } = this.state.currentGroupDetails;
    const timeLeftDiscussion = discussionLength - (new Date() - moment(startTime).toDate());
    setTimeout(this.finishDiscussion, timeLeftDiscussion);
  }

  startTurnTimer() {
    const { turnMaxLength } = this.state.currentGroupDetails;
    setTimeout(this.expireTurn, turnMaxLength);
  }

  stopSpeaking() {
    this.setState({ isSpeaking: false });
  }

  refreshTimeLeft() {
    const timeDiff = moment(this.state.currentGroupDetails.endTimestamp).toDate() - new Date();
    this.setState({
      timeLeftStr: `${msToClock(timeDiff)}`,
    });
  }

  changeName(name) {
    this.setState({ name });
  }

  changeGroup(selectedGroupId) {
    this.setState({
      selectedGroupId,
      currentGroupDetails: find(this.state.groups, { _id: selectedGroupId }),
    });
  }

  changeDiscussionStatus(discussionStatus) {
    this.setState({
      discussionStatus
    });
  }

  addNewGroup(name, discussionLength, turnMaxLength) {
    fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({name, discussionLength, turnMaxLength})
    })
      .then((response) => response.json())
      .then((response) => {
        this.fetchGroups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchGroups() {
    fetch(`${API_URL}/groups`)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          groups: response
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchCurrentGroup() {
    const { _id } = this.state.currentGroupDetails;
    fetch(`${API_URL}/groups/${_id}`)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          currentGroupDetails: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  login() {
    fetch(`${API_URL}/groups/${this.state.selectedGroupId}/join`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({name: this.state.name})
    })
      .then((response) => {
        response.json()
          .then((responseData) => {
            if (!response.ok) {
              throw new Error(responseData.message);
            }
            this.setState({
              isLoggedIn: true,
              isDiscussionFinished: false,
            });
            this.fetchCurrentGroup();
            if (this.state.currentGroupDetails.currentSpeaker) {
              this.setState({
                currentSpeakerName: this.state.currentGroupDetails.currentSpeaker,
                discussionStatus: 2,
              });
            } else {
              this.setState({
                discussionStatus: 1,
              });
            }
            this.refreshTimeLeft();
            browserHistory.push('/group');
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this.setState({
      selectedGroupId: null,
      isLoggedIn: false,
      currentSpeakerName: null,
      discussionStatus: 0,
      isDiscussionFinished: false,
    })
  }

  componentWillMount() {
    this.webSocket.on('connect', () => {
      console.log('WS client connected');
    });

    this.webSocket.on('disconnect', () => {
      console.log('WS client disconnected');
    });

    this.webSocket.on('error', (err) => {
      console.log(err);
    });

    this.webSocket.on('action', (action) => {
      console.log(action);
      this.refreshTimeLeft();

      switch (action.actionType) {
        case 'TURN_GRANTED':
          const isUsersTurn = action.name === this.state.name;
          this.setState({
            discussionStatus: 2,
            currentSpeakerName: action.name,
            isSpeaking: isUsersTurn,
          });

          if (isUsersTurn) {
            this.startTurnTimer();
          }
          break;
        case 'ENDED_TURN':
          this.setState({
            discussionStatus: 1,
            currentSpeakerName: null,
          });
          break;
        case 'TURN_EXPIRED':
          this.setState({
            discussionStatus: 1,
            currentSpeakerName: null,
          });
          break;
        case 'DISCUSSION_EXPIRED':
          if (!this.state.isDiscussionFinished) {
            this.finishDiscussion();
          }
          break;
        default:
      }
    });

    this.fetchGroups();
  }

  render() {
    const { discussionStatus, isLoggedIn, isDiscussionFinished, timeLeftStr, currentSpeakerName } = this.state;
    const topStatusBarIsVisible = discussionStatus !== 0;
    const bottomNavIsVisible = isLoggedIn || isDiscussionFinished;

    const routeNavIndexMapping = {
      '/': 0,
      '/group': 1,
      '/report': 2,
    }

    const bottomNav = (
      <div style={{alignSelf: 'flex-end', width: '100%', visibility: bottomNavIsVisible ? 'visible' : 'hidden'}}>
        <Paper zDepth={0}>
          <BottomNavigation selectedIndex={routeNavIndexMapping[this.props.location.pathname]}>
            <BottomNavigationItem
              label='Home'
              icon={<IconHome />}
              onTouchTap={() => { browserHistory.push('/') }}
            />
            <BottomNavigationItem
              label='Discussion'
              icon={<IconRecordVoiceOver />}
              onTouchTap={() => {
                if (!this.state.isDiscussionFinished) {
                  browserHistory.push('/group');
                }
              }}
            />
            <BottomNavigationItem
              label='Report'
              icon={<IconAssessment />}
              onTouchTap={() => { browserHistory.push('/report')}}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );

    const topStatusBar = (
      <Paper
        zDepth={1}
        style={{margin: '10px', padding: '10px', textAlign: 'center', visibility: topStatusBarIsVisible ? 'visible' : 'hidden'}}
      >
        <div>{!isDiscussionFinished && timeLeftStr}</div>
        <div>{(discussionStatus === 2) ?
          `Current Speaker is ${currentSpeakerName}` :
          DISCUSSION_STATUS[discussionStatus]
          }
        </div>
      </Paper>
    );

    return (
      <MuiThemeProvider>
        <div className='flex-container'>
          {topStatusBar}
          {React.cloneElement(this.props.children, {
            startMeetingTimer: this.startMeetingTimer,
            finishDiscussion: this.finishDiscussion,
            stopSpeaking: this.stopSpeaking,
            changeName: this.changeName,
            changeGroup: this.changeGroup,
            addNewGroup: this.addNewGroup,
            fetchGroups: this.fetchGroups,
            fetchCurrentGroup: this.fetchCurrentGroup,
            refreshTimeLeft: this.refreshTimeLeft,
            login: this.login,
            logout: this.logout,
            ws: this.webSocket,
            ...this.state
          })}
          {bottomNav}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default MainLayoutContainer;
