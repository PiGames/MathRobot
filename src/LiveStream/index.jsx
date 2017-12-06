import React from 'react'
import './style.scss'

export default class Live extends React.Component {
  render() {
    return (
      <div className="container ar16-9 mt-3">
        <iframe
          width="560"
          height="315"
          className="h-100 position-absolute"
          src="https://www.youtube.com/embed/live_stream?channel=UCbm5muM7pUXwJ0PlZObbmZg"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    )
  }
}
