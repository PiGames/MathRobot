import React from 'react'
import theme from './theme'

import io from 'socket.io-client'

import AppBar from 'material-ui/AppBar'
import Snackbar from 'material-ui/Snackbar'
import { Tabs, Tab } from 'material-ui/Tabs'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { getUserPositionInQueue } from './utils/queueUtils.js'

import Calculator from './Calculator/index.jsx'
import SignIn from './SignIn/index.jsx'
import Logs from './Logs/index.jsx'
import LiveStream from './LiveStream/index.jsx'

import './main.scss'
import './tab.scss'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      queue: [],
      robotSteps: [],
      openSnackbar: false,
      snackbarMessage: '',
      currentTab: 'log',
      userId: null,
      evaluateError: '',
      showSignIn: true,
    }

    const socket = io(process.env.BACKEND_URL)
    socket.on('connect', ()=>{
      this.setState({
        userId: socket.id
      })
    })

    socket.on('disconnect', () => {
      this.setState( {
        username: '',
      } )
    })
    socket.on('robot step', this.onRobotStep.bind(this))
    socket.on('robot done', this.onRobotDone.bind(this))
    socket.on('queue changed', this.onQueueChange.bind(this))
    socket.on('evaluate error', this.onEvaluateError.bind(this))
    socket.on('username given', this.onUsernameGiven.bind(this))
    socket.on('username error', this.onUsernameError.bind(this))
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

  onRobotDone({ img }) {
    const step = {
      img: img,
      msg: `Robot says that the answer is: ${46}`,
      type: 'done',
    }

    const divider = {
      msg: '12345689',
      type: 'divider',
    }

    this.setState({
      robotSteps: [...this.state.robotSteps, step, divider]
    })
  }

  onQueueChange(queue) {
    this.setState({
      queue
    })
  }

  onEvaluateError( err ) {
    this.setState( {
      currentTab: 'log',
      openSnackbar: true,
      snackbarMessage: err,
    } )
  }

  closeSnackabar = () => {
    this.setState({
      openSnackbar: false
    })
  }

  onEquationSubmit = (equation) => {
    if(equation === '<math xmlns="http://www.w3.org/1998/Math/MathML"/>'){
      this.setState({
        openSnackbar: true,
        snackbarMessage: 'Why would you submit an empty equation?'
      })
      return
    }

    this.setState( {
      currentTab: 'log',
      openSnackbar: true,
      snackbarMessage: 'Your request has been added to the queue'
    } )

    this.socket.emit('evaluate', equation)
  }

  submitName = ( e, username ) => {
    console.log('submit')
    this.socket.emit('give name', username)
  }

  getUserPositionInQueue = () => {
    return getUserPositionInQueue( this.state.queue, this.state.userId )
  }

  handleTabChange = (value) => {
    const userPositionInQueue = this.getUserPositionInQueue()

    if ( userPositionInQueue < 0 || value !== 'calc' ) {
      this.setState({
        currentTab: value,
      })
    }
  };

  onUsernameGiven(username) {
    console.log('given')
    localStorage.setItem( 'username', username )
    this.setState( {
      username,
      showSignIn: false,
      openSnackbar: false,
    } )
  }
  onUsernameError() {
    console.log('error')
    this.setState({
     openSnackbar: true,
     snackbarMessage: 'Username already exists'
   }, ()=>console.log(this.state.openUsernameSnackbar))
  }
  render() {
    const isUserInQueue = this.getUserPositionInQueue() >= 0

    return (
      <div>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            <AppBar
              zDepth={ 0 }
              title="Math Robot"
              showMenuIconButton={false}
              iconElementRight={
                <h4 className="align-items-center d-flex font-weight-normal h-100 mb-0 mr-3 text-white">
                  {this.state.username ? `Hi ${this.state.username}!`: null}
                </h4>
              }
            />
            {
              this.state.showSignIn ?
              <div>
              <SignIn submitName={this.submitName} />
              </div>
              :
              (
              <div>
                <Tabs
                    value={this.state.currentTab}
                    onChange={this.handleTabChange}
                  >
                  <Tab label="See robot's log" value="log">
                    <Logs
                      queue={ this.state.queue }
                      robotSteps={ this.state.robotSteps }
                      userId={ this.state.userId }
                      errorText={ this.state.evaluateError }
                    />
                  </Tab>
                  <Tab label="Enter own equation" value="calc" className={ isUserInQueue ? 'disabled-tab' : ''}>
                    <Calculator
                      onEquationSubmit={this.onEquationSubmit}
                    />
                  </Tab>
                  <Tab label="See robot live" value="live">
                    <LiveStream />
                  </Tab>
                </Tabs>

                <Snackbar
                  open={true}
                  message={this.state.snackbarMessage}
                  autoHideDuration={4000}
                  onRequestClose={this.closeSnackabar}
                />
              </div>
            )
          }
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
