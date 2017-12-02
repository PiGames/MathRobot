import React from 'react';
import {green500, grey300, indigoA100, white, black} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import Calculator from './Calculator/index.jsx'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionDone from 'material-ui/svg-icons/action/done';
import Cached from 'material-ui/svg-icons/action/cached';
import Chip from 'material-ui/Chip';
import io from 'socket.io-client'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import {Tabs, Tab} from 'material-ui/Tabs';

import './main.scss';
import './tab.scss';

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
  palette: {
    primary1Color: green500
  }
});

const styles = {
  chip: {
    margin: 4,
  },

  chipWrapper: {
    margin: '0 -4px',
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      username: 'asd',
      queue: [],
      // robotSteps: [],
      robotSteps: [{'msg':'Reaching to 3','type':'step'},{'msg':'Reaching to square root','type':'step'},{'msg':'...','type':'step'},{'msg':'Reading from display','type':'step'},{'img':'/calc.jpg','msg':'Robot says that the answer is: 46','type':'done'}],
      usernameInputValue: '',
      openSnackbar: false,
      currentTab: 'log',
    }

    const socket = io('https://mathrobot.herokuapp.com/')
    socket.on('connect', ()=>{this.id = socket.id})
    socket.on('queue changed', this.onQueueChange.bind(this))
    socket.on('robot step', this.onRobotStep.bind(this))
    socket.on('robot done', this.onRobotDone.bind(this))
    socket.on('evaluate error', this.onEvaluateError.bind(this))

    this.socket = socket
  }
  onRobotStep(stepMsg) {
    const step = {
      msg: stepMsg,
      type: 'step',
    }

    this.setState({
      robotSteps: [...this.state.robotSteps, step]
    })
  }
  onQueueChange(queue) {
    this.setState({
      queue
    })
  }
  onRobotDone({result}) {
    const step = {
      img: '/calc.jpg',
      msg: `Robot says that the answer is: ${result}`,
      type: 'done',
    }

    this.setState({
      robotSteps: [...this.state.robotSteps, step]
    })
  }
  onEquationSubmit(equation) {
    this.setState( {
      currentTab: 'log',
      openSnackbar: true
    } );
    this.socket.emit('evaluate', equation)
  }
  onEvaluateError() {
    console.log( 'Err' ); // TODO add error!
  }
  renderCurrentUser() {
    if(this.state.queue.length === 0){
      return 'No equations are beeing processed'
    } else {
      return `Currently processed equation is from ${this.state.queue[0].user.username}`
    }
  }
  renderUserQueuePositionMessage() {
    const style = { ...styles.chip }

    const userPositionInQueue = this.state.queue.findIndex(e=>e.user.id === this.id)

    let msg;
    let bg;
    let color = black;

    if(userPositionInQueue === -1 ) {
      bg = grey300;
      msg ='You have not requested any equation calculation yet'
    } else if(userPositionInQueue === 0) {
      bg = green500
      color = white;
      msg = 'Your request is being processed!'
    } else {
      bg = indigoA100
      msg = `You are ${userPositionInQueue} in queue`
    }

    return <Chip style={ style } backgroundColor={ bg } labelColor={color}>{msg}</Chip>
  }
  onUserNameSubmit(e) {
    e.preventDefault()
    this.submitName()
  }
  submitName() {
    const {usernameInputValue} = this.state
    if(usernameInputValue === ''){
      return
    }

    this.setState({username: usernameInputValue},
                  () => this.socket.emit('give name', this.state.username))
  }
  renderUsernameInput() {
    return (
      <div className="container fill d-flex justify-content-center align-items-center flex-column">
        <div className="col-sm-12 col-md-8">
          <h2 className="d-flex align-items-center justify-content-center">Type you username first</h2>
          <div style={{'textAlign': 'center'}}>
            <form onSubmit={this.onUserNameSubmit.bind(this)}>
              <TextField name="username" onChange={({target})=>this.setState({usernameInputValue: target.value})} floatingLabelText="Username" hintText="Your username" fullWidth />
              <RaisedButton onClick={this.submitName.bind(this)} label="Let's go!" primary fullWidth />
            </form>
          </div>
        </div>
      </div>
    )
  }

  handleTabChange = (value) => {
    const userPositionInQueue = this.state.queue.findIndex(e=>e.user.id === this.id)

    if ( userPositionInQueue < 0 ) {
      this.setState({
        currentTab: value,
      });
    }
  };

  renderRobotSteps = () => {
    const steps = [ ...this.state.robotSteps ]
    steps.reverse();
    steps.splice( 0, 1 );
    return steps.map((step, i) => {
      if ( step.type !== 'done' ) {
        return (
          <ListItem leftIcon={<ActionDone />} key={i}>{step.msg}</ListItem>
        );
      }

      return this.renderDoneStep( step );
    } );
  }

  renderDoneStep( { msg, img } ) {
    return (
      <CardMedia overlay={<CardTitle title={ msg } />} className="col-md-6">
        <img src={ img } alt="" />
      </CardMedia>
    );
  }

  renderLastStep = () => {
    if ( this.state.robotSteps.length > 0 ) {
      const lastStep = this.state.robotSteps[this.state.robotSteps.length-1]

      if ( lastStep.type === 'done' ) {
        const item = this.renderDoneStep( lastStep );
        return [
          item,
          // <Divider key="divider"/>,
        ]
      }

      const item = ( <ListItem key={ 6 } leftIcon={<Cached className="spin-animation" />}>{lastStep.msg}</ListItem> );
      return [
        item,
        <Divider key="divider"/>,
      ]
    }

    return null;
  }

  render() {
    const isUserInQueue = this.state.queue.findIndex(e=>e.user.id === this.id) >= 0;

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
          <div>
            <AppBar zDepth={0} className="header" title="Math Robot" showMenuIconButton={false} iconElementRight={<div className="hello">{this.state.username ? `Hi ${this.state.username}!`: null}</div>}/>
            {
              this.state.username === '' ? this.renderUsernameInput() : (
              <div>
                <Tabs
                    value={this.state.currentTab}
                    onChange={this.handleTabChange}
                  >
                  <Tab label="See robot's log" value="log">
                    <div className={ 'container' }>
                      <div>
                        <CardHeader textStyle={{paddingRight: 0}} title="Robot's status log" avatar="./prompt_avatar.png" subtitle="Watch for your result"/>
                        <div className="p-3 d-flex flex-wrap" style={styles.chipWrapper}>
                          <Chip style={styles.chip}>
                            { this.renderCurrentUser() }
                          </Chip>
                          { this.renderUserQueuePositionMessage() }
                        </div>
                      </div>
                      <div>
                        { this.renderLastStep() }
                        <List>
                        { this.renderRobotSteps() }
                        </List>
                      </div>
                    </div>
                  </Tab>
                  <Tab label="Enter own equation" value="calc" className={ isUserInQueue ? 'disabled-tab' : ''}>
                    <div className={ 'container' }>
                      <CardHeader textStyle={{paddingRight: 0}} title="Calculator input" avatar="./calc_card_avatar.jpg" subtitle="Type your equation"/>
                      <CardMedia className="px-3">
                        <Calculator onEquationSubmit={this.onEquationSubmit.bind(this)} />
                      </CardMedia>
                    </div>
                  </Tab>
                </Tabs>
                <Snackbar
                  open={this.state.openSnackbar}
                  message="Your request has been added to the queue"
                  autoHideDuration={4000}
                  onRequestClose={()=>this.setState({openSnackbar: false})}
                />
              </div>)
          }
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
