import moment from 'moment';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { API_URL } from '../Constants';

class ReportPage extends Component {
  constructor() {
    super();

    this.state = {
      reportGroupDetails: {},
    };

    this.fetchReportGroupDetails = this.fetchReportGroupDetails.bind(this);
  }

  fetchReportGroupDetails() {
    const groupId = this.props.isDiscussionFinished ? this.props.previousGroupId : this.props.currentGroupDetails._id;

    fetch(`${API_URL}/groups/${groupId}`)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          reportGroupDetails: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillMount() {
    const { discussionStatus, currentGroupDetails } = this.props;
    if (currentGroupDetails && discussionStatus === 0) {
      browserHistory.push('/');
    } else {
      this.fetchReportGroupDetails();
    }
  }

  render() {
    const { users } = this.state.reportGroupDetails;
    return (
      <div className='flex-item'>
        <Paper style={{padding: '10px', margin: '10px'}}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Time Consumed (minutes)</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {users && users.map((user, i) => {
              const timeConsumed = parseFloat(moment.duration(user.timeConsumed).asMinutes()).toFixed(2);
              return (
                <TableRow key={i}>
                  <TableRowColumn>{user.name}</TableRowColumn>
                  <TableRowColumn>{timeConsumed}</TableRowColumn>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default ReportPage;
