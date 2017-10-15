const MQ = MathQuill.getInterface(2);

const isiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const config = {
  autoCommands: 'pi sqrt',
  handlers: {
    edit: function() {
      var enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
      console.log( TeXZilla.toMathML( enteredMath ).querySelector( "semantics > :first-child" ), enteredMath );
    }
  },
}

if ( isiOS ) {
  config.substituteTextarea = () => document.createElement("span")
}

const answerSpan = document.getElementById('equation');
const answerMathField = MQ.MathField(answerSpan, config );

const btns = document.querySelectorAll( ".calc-btn" );
btns.forEach( ( btn ) => {
  MQ.StaticMath( btn );
  btn.addEventListener( "click", function() {
    const func = btn.dataset.function;
    switch (func) {
      case "del": {
        answerMathField.focus();
        answerMathField.keystroke('Backspace');
        break;
      }
      case "enter": {
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
