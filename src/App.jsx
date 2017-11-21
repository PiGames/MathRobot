import React from 'react';
import {green400, lightGreenA200, grey500, indigoA100} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import Calculator from './Calculator.jsx'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentForward from 'material-ui/svg-icons/content/forward';
import Create from 'material-ui/svg-icons/content/create';
import Chip from 'material-ui/Chip';
import io from 'socket.io-client'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
  palette: {
    primary1Color: green400
  }
});

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      queue: [],
      robotSteps: [],
      usernameInputValue: '',
      openSnackbar: false
    }
    const socket = io('https://mathrobot.herokuapp.com/')
    socket.on('connect', ()=>{this.id = socket.id})
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
  onEvaluateError() {
    this.setState({openSnackbar: true})
  }
  renderCurrentUser() {
    if(this.state.queue.length === 0){
      return 'There is no equations to process'
    } else {
      return `Currently processed equation is from ${this.state.queue[0].user.username}`
    }
  }
  renderUserQueuePositionMessage() {
    const style = {'marginLeft': '16px', 'marginBottom': '8px'}

    const userPositionInQueue = this.state.queue.findIndex(e=>e.user.id === this.id)

    let msg

    if(userPositionInQueue === -1 ) {
      style.background = grey500
      msg ='You have not requested any equation calculation yet'
    } else if(userPositionInQueue === 0) {
      style.background = lightGreenA200
      msg = 'Your request is being processed!'
    } else {
      style.background = indigoA100
      msg = `You are ${userPositionInQueue} in queue`
    }

    return <Chip style={style}>{msg}</Chip>
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
      <Card>
        <CardHeader style={{'textAlign': 'center'}} title="Type you username first" avatar={<Create/>}/>
        <div style={{'textAlign': 'center'}}>
          <form onSubmit={this.onUserNameSubmit.bind(this)}>
            <TextField name="username" onChange={({target})=>this.setState({usernameInputValue: target.value})} label="Username"/>
            <RaisedButton onClick={this.submitName.bind(this)}label="Let's go!" primary={true} />
          </form>
        </div>
      </Card>
    )
  }
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
          <div>
            <AppBar className="header" title="Math Robot" showMenuIconButton={false} iconElementRight={<div className="hello">{this.state.username ? `Hi ${this.state.username}!`: null}</div>}/>
            {
              this.state.username === '' ? this.renderUsernameInput() : (
                <div>
                  <Card>
                    <CardHeader style={{'textAlign': 'center'}} title=            {
                                  this.renderUserQueuePositionMessage()
                                }/>

                  </Card>
                  <Card>
                    <CardHeader title="Calculator input" subtitle="Type your equation, press Enter, and MathRobot will handle the rest. We have full LateX support!" avatar="./calc_card_avatar.jpg"/>
                    <CardMedia>
                      <Calculator onEquationSubmit={this.onEquationSubmit.bind(this)}/>
                    </CardMedia>
                  </Card>
                  <Card>
                    <CardHeader title="Robot's status log" subtitle="Here you can see how MathRobot's status changed over time." avatar="./prompt_avatar.png"/>
                    <Chip style={{'marginLeft': '16px', 'marginBottom': '8px'}}>
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
                  <Snackbar
                    open={this.state.openSnackbar}
                    message="You already submitted one equation!"
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
