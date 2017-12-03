import React from 'react'
import { List } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { ListItem } from 'material-ui/List'
import { white } from 'material-ui/styles/colors'
import { Card, CardHeader } from 'material-ui/Card'
import Cached from 'material-ui/svg-icons/action/cached'
import ActionDone from 'material-ui/svg-icons/action/done'

import UserQueuePositionChip from './UserQueuePositionChip.jsx'
import EvaluatedUserChip from './EvaluatedUserChip.jsx'
import ErrorChip from './ErrorChip.jsx'
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

      const item = ( <ListItem key={ 6 } leftIcon={<Cached className="spin-animation" />}>{lastStep.msg}</ListItem> )

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
          return <ListItem key={i} innerDivStyle={ { margin: '-8px -16px 0' } } hoverColor={white}><Divider /></ListItem>
        }

        return null
      }

      if ( step.type === 'done' ) {
        return <div key={i}><DoneStep step={ step }/></div>
      }

      return (
        <ListItem leftIcon={<ActionDone />} key={i}>{step.msg}</ListItem>
      )
    } )
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
          <div className="py-3" style={ styles.chipWrapper }>
            <ErrorChip errorText={ this.props.errorText } />
            <EvaluatedUserChip queue={ this.props.queue } />
            <UserQueuePositionChip queue={ this.props.queue } userId={ this.props.userId } />
          </div>
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
