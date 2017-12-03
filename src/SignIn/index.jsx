import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export default class Component extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      errorText: ''
    }
  }

  onChange = ( {target} )=> this.setState( { value: target.value } )

  onSubmit = ( e ) => {
    e.preventDefault()
    const { value } = this.state

    if(value === ''){
      this.setState({
        errorText: 'You can\'t leave username empty'
      })
      return
    }

    this.props.submitName( e, this.state.value )
  }

  render() {
    return (
      <div className="container fill d-flex justify-content-center align-items-center flex-column">
        <div className="col-sm-12 col-md-8">
          <h2 className="d-flex align-items-center justify-content-center">Type you username first</h2>
          <div>
            <form onSubmit={this.onSubmit}>
              <TextField errorText={this.state.errorText} name="username" onChange={this.onChange} floatingLabelText="Username" hintText="Your username" fullWidth />
              <RaisedButton label="Let's go!" primary fullWidth type="submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
