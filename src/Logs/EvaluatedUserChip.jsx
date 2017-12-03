import React from 'react'

import styles from './styles'
import Chip from 'material-ui/Chip'

const EvaluatedUserChip = ( { queue } ) => {
  let text = ''
  if ( queue.length === 0 ){
    text = 'No equations are beeing processed'
  } else {
    text = `Currently processed equation is from ${queue[0].user.username}`
  }

  return (<Chip style={styles.chip}>{ text }</Chip>)
}

export default EvaluatedUserChip
