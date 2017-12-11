import React from 'react'
import {CardMedia} from 'material-ui/Card'

const DoneStep = ( { step } ) => {
  const { img } = step

  return (
    <CardMedia className="col-sm-12 col-lg-8 mx-auto">
      <img src={ img } alt="" />
    </CardMedia>
  )
}

export default DoneStep
