import React from 'react'
import { List } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { ListItem } from 'material-ui/List'
import { white } from 'material-ui/styles/colors'
import { Card, CardHeader } from 'material-ui/Card'
import Cached from 'material-ui/svg-icons/action/cached'
import ActionDone from 'material-ui/svg-icons/action/done'
import Warning from 'material-ui/svg-icons/alert/warning'
import { red500 } from 'material-ui/styles/colors'

import DoneStep from './DoneStep.jsx'
import styles from './styles'

export default class Logs extends React.Component {
  renderLastStep = () => {
    if ( this.props.robotSteps.length > 0 ) {
      const lastStep = this.props.robotSteps[this.props.robotSteps.length-1]

      if ( lastStep.type === 'divider' ) {
        return null
      }

      if ( lastStep.type === 'done' ) {
        const item = this.renderDoneStep( lastStep )
        return item
      }

      const item = ( <ListItem key={ 'caching' } leftIcon={ lastStep.type === 'error' ? <Warning color={red500} /> : <Cached className="spin-animation" />}>{lastStep.msg}</ListItem> )

      if ( this.props.robotSteps.length > 1 ) {
        return [
          item,
          <Divider key="divider"/>,
        ]
      } else {
        return item
      }
    }

    return null
  }

  renderRobotSteps = () => {
    const steps = [ ...this.props.robotSteps ]
    steps.reverse()
    steps.splice( 0, 1 )

    return steps.map((step, i) => {
      if ( step.type === 'divider' ) {
        if ( i > 0 ) {
          return <ListItem key={`step-${i}`} innerDivStyle={ { margin: '-8px -16px 0' } } hoverColor={white}><Divider /></ListItem>
        }

        return null
      }

      if ( step.type === 'done' ) {
        return <div key={i}><DoneStep step={ step }/></div>
      }

      return (
        <ListItem leftIcon={ step.type === 'error' ? <Warning color={red500} /> : <ActionDone />} key={`step-${i}`}>{step.msg}</ListItem>
      )
    } )
  }

  renderQueue() {
    return this.props.queue.length ? (
      <div className="py-3">
        <h5>Users queue:</h5>
        <div style={styles.usersContainer}>
          {
            this.props.queue.map(({user}, i)=>(
                <div key={`user-${user.username}-${i}`} style={styles.user}>{i + 1}. {user.username} ({user.mathml})</div>
              ))
          }
        </div>
      </div>
    ) : (
      <div className="py-3">
        <h5>No users in the queue</h5>
      </div>
    )

  }

  render() {
    return (
      <div className="container pb-3">
        <div>
          <CardHeader
            textStyle={{paddingRight: 0}}
            title="Robot's status log"
            avatar="./prompt_avatar.png"
            subtitle="Watch for your result"
            className="px-0 pb-0"
          />
          {this.renderQueue()}
        </div>
        <Card className={`${this.props.robotSteps.length === 0 ? 'd-none ' : ''} py-2`}>
          { this.renderLastStep() }
          <List className={this.props.robotSteps.length <= 1 ? 'd-none' : 'pb-0'}>
            { this.renderRobotSteps() }
          </List>
        </Card>
      </div>
    )
  }
}
