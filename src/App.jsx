import React from 'react';
import {green400, lightGreenA200, grey500, deepPurple900} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import Calculator from './Calculator.jsx'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentForward from 'material-ui/svg-icons/content/forward';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import io from 'socket.io-client'

const muiTheme = getMuiTheme({
  appBar: {
    height: 50
  },
  palette: {
    primary1Color: green400
  }
});

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      queue: [],
      robotSteps: []
    }
    this.user = `Kacper-${Math.random()}`
    const socket = io('https://mathrobot.herokuapp.com/')
    socket.emit('give name', this.user);
    socket.on('queue changed', this.onQueueChange.bind(this))
    socket.on('robot step', this.onRobotStep.bind(this))
    socket.on('robot done', this.onRobotDone.bind(this))
    socket.on('evaluate error', this.onEvaluateError.bind(this))

    this.socket = socket
  }
  onRobotStep(step) {
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
    this.setState({
      robotSteps: [...this.state.robotSteps, `Robot says that the answer is: ${result}`]
    })
  }
  onEquationSubmit(equation) {
    this.socket.emit('evaluate', equation)
  }
  onEvaluateError(err) {
    alert(err)
  }
  renderCurrentUser() {
    if(this.state.queue.length === 0){
      return 'There is no equations to process'
    } else {
      return `Currently processed equation is from ${this.state.queue[0].user.username}`
    }
  }
  renderUserQueuePositionMessage() {
    const style = {'margin-left': '16px', 'margin-bottom': '8px'}

    const userPositionInQueue = this.state.queue.findIndex(e=>e.user.username === this.user)

    let msg

    if(userPositionInQueue === -1 ) {
      style.background = grey500
      msg ='You have not requested any equation calculation yet'
    } else if(userPositionInQueue === 0) {
      style.background = lightGreenA200
      msg = 'Your request is being processed!'
    } else {
      style.background = deepPurple900
      style['font-color'] = '#fff'
      msg = `You (${this.user}) are ${userPositionInQueue} in queue`
    }

    return <Chip style={style}>{msg}</Chip>
  }
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
          <div>
            <AppBar className="header" title="Math Robot" showMenuIconButton={false}/>
            <Card>
              <CardHeader title="Calculator input" subtitle="Type your equation, press Enter, and MathRobot will handle the rest. We have full LateX support!" avatar="./calc_card_avatar.jpg"/>
              <CardMedia>
                <Calculator onEquationSubmit={this.onEquationSubmit.bind(this)}/>
              </CardMedia>
            </Card>
            <Card>
              <CardHeader title="Your request status" avatar="./prompt_avatar.png"/>
              {
                this.renderUserQueuePositionMessage()
              }
            </Card>
            <Card>
              <CardHeader title="Robot's status log" subtitle="Here you can see how MathRobot's status changed over time." avatar="./prompt_avatar.png"/>
              <Chip style={{'margin-left': '16px', 'margin-bottom': '8px'}}>
              {
                this.renderCurrentUser()
              }
              </Chip>
              <CardMedia>
                <List>
                {
                    this.state.robotSteps.slice(-5, -1).map((step, i) => (
                    <ListItem leftIcon={<ActionDone/>} key={i}>{step}</ListItem>
                  ))
                }
                <Divider/>
                {
                  this.state.robotSteps.length > 0 ?
                  <ListItem leftIcon={<ContentForward/>}>{this.state.robotSteps[this.state.robotSteps.length-1]}</ListItem>: null
                }
                </List>
              </CardMedia>
            </Card>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
