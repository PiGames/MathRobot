import React from 'react'
import Chip from 'material-ui/Chip'
import { red500, white } from 'material-ui/styles/colors'

import styles from './styles'

const ErrorChip = ( { errorText } ) => (
  errorText ?
  <Chip
    style={styles.chip}
    backgroundColor={red500}
    labelColor={white}
    className="d-block"
  >{ errorText }</Chip>
  : null
)

export default ErrorChip
