import React from 'react'

import Chip from 'material-ui/Chip'
import {grey300, blue500, blue400, blue300, blue200, blue100, white, black} from 'material-ui/styles/colors'

import { getUserPositionInQueue } from '../utils/queueUtils.js'


import styles from './styles'

const UserQueuePositionChip = ( { queue, userId } ) => {
  const style = { ...styles.chip }

  const userPositionInQueue = getUserPositionInQueue(queue, userId)
  let uPIQth = String(userPositionInQueue)

  let msg
  let bg
  let color = black

  if ( uPIQth.slice(-1) === '1' && uPIQth.slice(-2) !== '11' ) {
    uPIQth += 'st'
  } else if ( uPIQth.slice(-1) === '2' && uPIQth.slice(-2) !== '12' ) {
    uPIQth += 'nd'
  } else if ( uPIQth.slice(-1) === '3' && uPIQth.slice(-2) !== '13' ) {
    uPIQth += 'rd'
  } else {
    uPIQth += 'th'
  }

  if(userPositionInQueue === -1 ) {
    bg = grey300
    msg ='You have not requested any equation calculation yet'
  } else if(userPositionInQueue === 0) {
    bg = blue500
    color = white
    msg = 'Your request is being processed!'
  } else {
    color = white

    if ( userPositionInQueue === 1 ) {
      bg = blue400
    } else if ( userPositionInQueue === 2 ) {
      bg = blue300
    } else if ( userPositionInQueue === 3 ) {
      bg = blue200
    } else {
      bg = blue100
      color = black
    }

    msg = `You are ${uPIQth} in queue`
  }

  return <Chip style={ style } backgroundColor={ bg } labelColor={color}>{msg}</Chip>
}


export default UserQueuePositionChip
