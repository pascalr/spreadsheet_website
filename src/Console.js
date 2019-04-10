import React from 'react'
import _ from 'lodash'
import './styles/sandbox.css'

// Some constants used to define the type
// Used for syntax highlighting
const NUMBER = "number"
const STRING = "string"
const UNDEFINED = "undefined"
const ERROR = "error"

// Inspect an object and output the results
// todo: Implement a custom stringify similar to jsconsole.com, to include native
// and circular objects, and all object methods
const stringify = function(obj) {
	try {
		return JSON.stringify(obj);
	} catch(e) {
		return obj.toString();
	}
}

// A function to add functions to be available
window.func = (cmdName) => {
}

const Output = ({command,_class,result}) => {
  const resultPrefix = "  => "
  return (
    <React.Fragment>
      <div className="command">{command}</div>
      <div className="result">
        <span className="prefix">{resultPrefix}</span>
        <span className={_class}>{stringify(result)}</span>
      </div>
    </React.Fragment>
  );
}

class Console extends React.Component {
  constructor(props) {
    super(props)
    this.state = {history: [], commands: []}
    this.currentHistory = ""
    this.command = ""
    // TODO: Load history

    window.functions = {}
  }
  
  // Evaluate a command and save it to history
  evaluate = (command) => {
			if ( !command )
				return false;

      const item = {command};

			// Evaluate the command and store the eval result, adding some basic classes for syntax-highlighting
			try {
				item.result = eval.call(window.functions, command);
        //item.result = this.get('iframe') ? this.iframeEval(command) : eval.call(window, command);
				if ( _.isUndefined(item.result) ) item._class = "undefined";
				if ( _.isNumber(item.result) ) item._class = "number";
				if ( _.isString(item.result) ) item._class = "string";
			} catch(error) {
				item.result = error.toString();
				item._class = "error";
			}

			// TODO Add the item to the history
			return item;
		}


  onKeyDown = (e) => {

    const keycode = e.keyCode;
    // If it is a printable charater, it will be added to the text field
    var valid =
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    // Enter key is handled by handle submit
    if (e.which === 13) { 
      if (!this.command)
        return;
		// Tab adds a tab character (instead of jumping focus)
				// If shift is down, do a carriage return
      //if ( this.ctrl ) {
      //		this.currentHistory = val + "\n";
      //		this.update();
      //		return false;
      //	}
      const result = this.evaluate(this.command)
      if (result && result.result) {
        this.setState({commands: [...this.state.commands, result]})
      }
      this.command = "";
    } else if ( e.which === 8 ) { // backspace
      this.command = this.command.slice(0,-1)
    } else if ( e.which === 9 ) {
			e.preventDefault();
    } else if ( valid ){
      this.command = this.command + e.key;
    }
    console.log(this.command)
  }

  render = () => {
    const placeholder = this.props.placeholder ||
                       "// type some javascript and hit enter (:help for info)"
    this.tabCharacter = this.props.tabCharacter || "\t";
	  //iframe : false, // if true, run `eval` inside a sandboxed iframe
    //		fallback : true // if true, use native `eval` if the iframe method fails
    return (
	    <div id="sandbox" onKeyDown={this.onKeyDown}>
        <div className="output">
          {this.state.commands.map((c,i) => (
            <Output key= {i} {...c}/>
          ))}
        </div>
        <div className="input">
          <textarea rows="1" placeholder={placeholder}/>
        </div>
      </div>
    )
  }
}

export default Console;
