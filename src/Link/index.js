import React from "react"
import { connect } from "react-redux";

import { changePath } from '../actions'

const mapStateToProps = state => ({
  history: state.history,
})

const mapDispatchToProps = (dispatch) => ({
});

class Link extends React.Component {
  render() {
    return(
      <div onClick={() => {this.props.history.push(this.props.to)}}>
        {this.props.children}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link);
