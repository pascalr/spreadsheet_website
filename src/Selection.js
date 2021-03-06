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
  smallerX = () => Math.min(this.x1,this.x2); //Smaller X
  largerX = () => Math.max(this.x1,this.x2); //Larger X
  smallerY = () => Math.min(this.y1,this.y2); //Smaller Y
  largerY = () => Math.max(this.y1,this.y2); //Larger Y

  reCalc = () => { //This will restyle the div
      const style = {}
      style.left = this.smallerX() + 'px';
      style.top = this.smallerY() + 'px';
      style.width = this.largerX() - this.smallerX() + 'px';
      style.height = this.largerY() - this.smallerY() + 'px';
      this.setState({style,hidden: false})
  }
  onMouseDown = (e) => {
    //if (!this.props.canStart || this.props.canStart(e)) {
    if (true || !this.props.canStart || this.props.canStart(e)) {
      this.x1 = e.pageX; //Set the initial X
      this.y1 = e.pageY; //Set the initial Y
      this.x2 = e.pageX;
      this.y2 = e.pageY;
      this.reCalc();
      if (this.props.onMouseDown) {
        this.props.onMouseDown(e)
      }
    }
  };
  onMouseMove = (e) => {
    console.log('onMouseMove')
    if (!this.state.hidden) {
      this.x2 = e.pageX; //Update the current position X
      this.y2 = e.pageY; //Update the current position Y
      this.reCalc();
    }
  };
  onMouseUp = (e) => {
    if (!this.state.hidden) {
      this.setState({hidden:true})
      if (this.props.onSelect) {
        this.props.onSelect(this.smallerX(),this.largerX(),this.smallerY(),this.largerY())
      }
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
