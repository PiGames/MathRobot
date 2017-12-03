import React from 'react'
import {CardMedia, CardTitle} from 'material-ui/Card'

const DoneStep = ( { step } ) => {
  const { msg, img } = step

  return (
    <CardMedia overlay={<CardTitle title={ msg } />} className="col-sm-12 col-lg-8 mx-auto">
      <img src={ img } alt="" />
    </CardMedia>
  )
}

export default DoneStep
