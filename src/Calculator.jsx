/* global MathQuill answerMathField TeXZilla*/
import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import parseToClickable from './MathML2Clickable.js'

export default class Calculator extends React.Component {
  componentDidMount() {
    const MQ = MathQuill.getInterface(2);

    const answerSpan = document.getElementById('equation');


    const config = {
      autoCommands: 'pi sqrt',
      handlers: {
        edit: () => {
          const enteredMath = answerMathField.latex();
          this.equation = TeXZilla.toMathML( enteredMath ).querySelector( 'semantics > :first-child' );
          console.log(parseToClickable(this.equation));
        }
      },
    }
    const isiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    if ( isiOS ) {
      config.substituteTextarea = () => document.createElement('span')
    }

    const answerMathField = MQ.MathField(answerSpan, config );

    const btns = document.querySelectorAll( '.calc-btn' );
    btns.forEach( ( btn ) => {
      MQ.StaticMath( btn );
      btn.addEventListener( 'click', function() {
        const func = btn.dataset.function;
        switch (func) {
          case 'del': {
            answerMathField.focus();
            answerMathField.keystroke('Backspace');
            break;
          }
          case 'enter': {
            answerMathField.focus();
            answerMathField.keystroke('Enter');
            break;
          }
          default: {
            answerMathField.focus();
            answerMathField.write( func );
          }
        }
      } );
    } );
  }
  onEquationSubmit = () => {
    this.props.onEquationSubmit(parseToClickable(this.equation))
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="equation-container col-sm-12 col-md-6 pr-0 pl-0">
              <span id="equation" />
            </div>
          </div>
        </div>
        <div className="container buttons-container">
          <div className="row justify-content-md-center">
            <div className="col-sm-12 col-md-6">
              <div className="d-flex">
                <div className="calc-btn" data-function={7}>7</div>
                <div className="calc-btn" data-function={8}>8</div>
                <div className="calc-btn" data-function={9}>9</div>
                <div className="calc-btn" data-function="\div">\div</div>
              </div>
              <div className="d-flex">
                <div className="calc-btn" data-function={4}>4</div>
                <div className="calc-btn" data-function={5}>5</div>
                <div className="calc-btn" data-function={6}>6</div>
                <div className="calc-btn" data-function="\cdot">\times</div>
              </div>
              <div className="d-flex">
                <div className="calc-btn" data-function={1}>1</div>
                <div className="calc-btn" data-function={2}>2</div>
                <div className="calc-btn" data-function={3}>3</div>
                <div className="calc-btn" data-function="-">-</div>
              </div>
              <div className="d-flex">
                <div className="calc-btn" data-function={0}>0</div>
                <div className="calc-btn" data-function=".">.</div>
                <div className="calc-btn" data-function="+">+</div>
                <div className="calc-btn pull-right" data-function="del">\textup{'{del}'}</div>
              </div>
              <RaisedButton onClick={this.onEquationSubmit.bind(this)}label="Submit" fullWidth={true} primary={true}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
