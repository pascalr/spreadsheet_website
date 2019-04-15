import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Autocomplete from 'react-autocomplete'
import { addPreview } from "./actions"

const mapStateToProps = state => ({
  defs: state.defs,
  history: state.history,
  db: state.db,
})

const mapDispatchToProps = dispatch => ({
  addPreview: (db, id) => dispatch(addPreview(db,id)),
})

class TableAutocomplete extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }
  componentDidMount = () => {
    this.input.focus();
  }
  onKeyUp = (e) => {
    // Enter key confirms the Table
    if (e.which === 13) {
      this.props.onSelect(this.state.value)
    // ESC key cancels
    } else if (e.which === 27) {
      this.props.setCancelled()
    }
  }

  render = () => {
    //onSelect={(val, item) => this.props.history.push(item.value)}
    return (
      <div onKeyUp={this.onKeyUp}>
          <Autocomplete
            getItemValue={(item) => item}
            items={_.values(_.mapValues(this.props.defs,'name'))}
            renderItem={(item, isHighlighted) => (
              <div style={{ background: isHighlighted ? 'lightgray' : 'white'}} key={item}>
                {item}
              </div>
            )}
            ref={el => this.input = el}
            open={this.state.value !== ''}
            shouldItemRender={_.includes}
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={this.props.onSelect}
          />
        </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableAutocomplete)
