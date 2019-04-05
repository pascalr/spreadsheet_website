import React from "react"
import { connect } from "react-redux";

const mapStateToProps = state => ({
  history: state.history,
})

const mapDispatchToProps = (dispatch) => ({
});

class Link extends React.Component {
  render() {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    const isAbsolutePath = r.test(this.props.to)
    return isAbsolutePath ?
      <a href={this.props.to}>{this.props.children}</a> :
      <span onClick={() => {this.props.history.push(this.props.to)}} className="link">
        {this.props.children}
      </span>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link);
