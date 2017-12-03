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
      currentTab: 'log',
      userId: null,
      evaluateError: '',
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

    this.socket = socket
  }

  componentDidMount() {
    if ( localStorage.getItem( 'username' ) ) {
      this.submitName( null, localStorage.getItem( 'username' ) )
    }
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

  onEvaluateError() {
    this.setState( {
      evaluateError: 'aaa',
    } )
  }

  closeSnackabar = () => {
    this.setState({
      openSnackbar: false
    })
  }

  onEquationSubmit = (equation) => {
    this.setState( {
      currentTab: 'log',
      openSnackbar: true
    } )
    this.socket.emit('evaluate', equation)
  }

  submitName = ( e, usernameInputValue ) => {
    localStorage.setItem( 'username', usernameInputValue )
    this.setState( {
      username: usernameInputValue},
      () => this.socket.emit('give name', this.state.username)
    )
  }

  getUserPositionInQueue = () => {
    return getUserPositionInQueue( this.state.queue, this.state.userId )
  }

  handleTabChange = (value) => {
    const userPositionInQueue = this.getUserPositionInQueue()

    if ( userPositionInQueue < 0 ) {
      this.setState({
        currentTab: value,
      })
    }
  };

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
              this.state.username === '' ?
              <SignIn submitName={this.submitName} />
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
                </Tabs>

                <Snackbar
                  open={this.state.openSnackbar}
                  message="Your request has been added to the queue"
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
