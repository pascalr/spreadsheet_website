import React from "react"
import { connect } from "react-redux";

import {set} from '../actions'
import * as PATH from '../constants/paths'

const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
  set: (path,val) => dispatch(set(path,val)),
});

class Link extends React.Component {
  render() {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    const isAbsolutePath = r.test(this.props.to)
    return isAbsolutePath ?
      <a href={this.props.to}>{this.props.children}</a> :
      <span onClick={() => {console.log('link clicked');this.props.set(PATH.ROUTE,this.props.to)}} className="link">
        {this.props.children}
      </span>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link);
