import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from './ui/Dialog';

class LoginPage extends Component {
  constructor() {
    super();

    this.state = {
      isAddGroupDialogOpen: false
    }

    this.handleAddGroupDialogOpen = this.handleAddGroupDialogOpen.bind(this);
    this.handleAddGroupDialogClose = this.handleAddGroupDialogClose.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLoginPress = this.handleLoginPress.bind(this);
  }

  handleAddGroupDialogOpen() {
    this.setState({
      isAddGroupDialogOpen: true
    });
  }

  handleAddGroupDialogClose() {
    this.setState({
      isAddGroupDialogOpen: false
    });
  }
  
  handleAddGroup() {
    const { addGroupName : name, addGroupDiscussionLength, addGroupTurnMaxLength } = this.state;
    const discussionLength = parseInt(addGroupDiscussionLength, 10) * 60000;
    const turnMaxLength = parseInt(addGroupTurnMaxLength, 10) * 1000;

    this.props.addNewGroup(name, discussionLength, turnMaxLength);
    this.handleAddGroupDialogClose();
  }

  handleGroupChange(e, key, groupId) {
    this.props.changeGroup(groupId);
  }

  handleTextChange(e, value) {
    this.setState({
      [e.target.id]: value
    });
  }

  handleNameChange(e, name) {
    this.props.changeName(name);
  }

  handleLoginPress() {
    if (this.props.isLoggedIn) {
      this.props.logout();
    } else {
      this.props.login();
    }
  }

  render() {
    const { selectedGroupId, groups } = this.props;

    const addGroupDialogActions = [
      <RaisedButton label='Cancel' onTouchTap={this.handleAddGroupDialogClose} />,
      <RaisedButton primary={true} label='Submit' onTouchTap={this.handleAddGroup} style={{marginLeft: '10px'}}/>
    ]

    return (
      <div className='flex-item'>
        <Paper style={{padding: '10px', margin: '10px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <SelectField
              floatingLabelText='Group'
              value={selectedGroupId}
              onTouchTap={this.props.fetchGroups}
              onChange={this.handleGroupChange}
              selectedMenuItemStyle={{color: 'rgb(0, 188, 212)'}}
            >
              {groups.map(({ _id, name }) => (
                <MenuItem key={_id} value={_id} primaryText={name} />
              ))}
            </SelectField>
            <RaisedButton label='Add' onTouchTap={this.handleAddGroupDialogOpen} style={{marginLeft: '10px'}}/>
          </div>
          <TextField
            onChange={this.handleNameChange}
            floatingLabelText='Name'
            errorText=''
            value={this.props.name}
          />
        </Paper>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <RaisedButton
            onTouchTap={this.handleLoginPress}
            primary={true}
            label={this.props.isLoggedIn ? 'Logout' : 'Login'}
            style={{margin: '0 10px 0 10px'}}
          />
          <RaisedButton label='Help' style={{margin: '0 10px 0 10px'}}/>
        </div>
        <Dialog
          title='Add Group'
          actions={addGroupDialogActions}
          open={this.state.isAddGroupDialogOpen}
          onRequestClose={this.handleAddGroupDialogClose}
        >
          <TextField id='addGroupName' onChange={this.handleTextChange} floatingLabelText='Name' />
          <TextField id='addGroupDiscussionLength' type='number' onChange={this.handleTextChange} floatingLabelText='Total (min)' />
          <TextField id='addGroupTurnMaxLength' type='number' onChange={this.handleTextChange} floatingLabelText='Turn (sec)' />
        </Dialog>
      </div>
    )
  }
}

export default LoginPage;
