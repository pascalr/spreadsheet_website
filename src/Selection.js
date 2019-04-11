import React from 'react'

class Selection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hidden: true};
    this.x1 = 0
    this.y1 = 0
    this.x2 = 0
    this.y2 = 0
  }
  x3 = () => Math.min(this.x1,this.x2); //Smaller X
  x4 = () => Math.max(this.x1,this.x2); //Larger X
  y3 = () => Math.min(this.y1,this.y2); //Smaller Y
  y4 = () => Math.max(this.y1,this.y2); //Larger Y

  reCalc = () => { //This will restyle the div
      const style = {}
      style.left = this.x3 + 'px';
      style.top = this.y3 + 'px';
      style.width = this.x4 - this.x3 + 'px';
      style.height = this.y4 - this.y3 + 'px';
      this.setState({style,hidden: false})
  }
  onMouseDown = (e) => {
    this.x1 = e.clientX; //Set the initial X
    this.y1 = e.clientY; //Set the initial Y
    this.x2 = e.clientX;
    this.y2 = e.clientY;
    this.reCalc();
  };
  onMouseMove = (e) => {
    if (!this.state.hidden) {
      this.x2 = e.clientX; //Update the current position X
      this.y2 = e.clientY; //Update the current position Y
      this.reCalc();
    }
  };
  onMouseUp = (e) => {
    this.setState({hidden:true})
    if (this.props.onSelect) {
      this.props.onSelect(this.x3,this.x4,this.y3,this.y4)
    }
  };

  render = () => {
    return (
      <div id="selectionDiv"
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        {this.props.children}
        <div id="selectionRectangle"
          hidden={this.state.hidden}
          style={this.state.style}
        >
        </div>
      </div>
    );
  }
}

export default Selection
