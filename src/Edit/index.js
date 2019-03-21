import React from 'react'
import {connect} from 'react-redux'

import {set} from '../actions'

import Field from './Field'

const mapStateToProps = state => ({
  root: state.cache.root
})

const mapDispatchToProps = (dispatch) => ({
  set: (path, val) => dispatch(set(path, val))
})

class Edit extends React.Component {
  renderFields() {
    if (!this.props.root) { return null; }
    const data = this.props.root[this.props.params.id];
    if (!data) { return null; }
    return (
      <div className="editData">
        {Object.keys(data).map(k => (
          <div key={k}>
            <span>{k}: </span>
            <span>{data[k]}</span>
          </div>
        ))}
      </div>
    );
  }
  render() {
    return (
      <div className="edit">
        <div className="location">
          {this.props.params.id}
          {this.renderFields()}
        </div>
        <Field table={this.props.params.id} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
