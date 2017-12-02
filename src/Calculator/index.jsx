import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import {white} from 'material-ui/styles/colors';
import './calculator.scss';

export default class Calculator extends React.Component {
  componentDidMount() {
    this.editor = com.wiris.jsEditor.JsEditor.newInstance( {
      'language': 'en',
      'fontSize': '32px',
      'toolbarSize': '1.5',
      'toolbar': `
<toolbar>
<tab ref="general" empty="true" rows="3">
<section rows="3">
<item ref="undo"/>
<item ref="redo"/>
<item ref="deleteAll"/>
</section>
<section rows="3">
<item ref="&#215;"/>
<item ref="+"/>
<item ref="&#247;"/>
<item ref="-"/>
<item ref="%"/>
</section>
<section rows="2">
<item ref="autoDisplayFraction"/>
<item ref="superscript"/>
<item ref="squareRoot"/>
<item ref="nRoot"/>
</section>
<section rows="2">
<item ref="sinus"/>
<item ref="log"/>
<item ref="cosinus"/>
<item ref="nlog"/>
<item ref="tangent"/>
<item ref="naturalLog"/>
</section>
<section rows="2">
<item ref="numberPi"/>
<item ref="numberE"/>
</section>
</tab>
</toolbar>
`.replace(/\n/g, ''),
    } );
    this.editor.insertInto(document.getElementById('calc'));
  }

  onEquationSubmit = () => {
    this.props.onEquationSubmit(this.editor.getMathML())
  }

  render() {
    return (
      <div>
        <div id="calc" style={ { height: '300px' } }></div>
        <RaisedButton onClick={ this.onEquationSubmit } className="my-3" primary labelColor={white} label="submit" />
      </div>
    );
  }
}
