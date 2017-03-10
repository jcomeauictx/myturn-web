import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

import MainLayoutContainer from './components/MainLayoutContainer';
import LoginPage from './components/LoginPage';
import GroupMeetingPage from './components/GroupMeetingPage';
import ReportPage from './components/ReportPage';

injectTapEventPlugin();
window.addEventListener('contextmenu', function(e) { e.preventDefault(); });

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={MainLayoutContainer}>
          <IndexRoute component={LoginPage} />
          <Route path='/group' component={GroupMeetingPage} />
          <Route path='/report' component={ReportPage} />
        </Route>
      </Router>
    );
  }
}

export default App;
