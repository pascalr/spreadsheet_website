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
  componentDidMount = () => {
    this.input.focus();
  }
  render = () => {
    //onSelect={(val, item) => this.props.history.push(item.value)}
    return (
          <Autocomplete
            getItemValue={(item) => item}
            items={_.values(_.mapValues(this.props.defs,'name'))}
            renderItem={(item, isHighlighted) => (
              <div style={{ background: isHighlighted ? 'lightgray' : 'white'}} key={item}>
                {item}
              </div>
            )}
            ref={el => this.input = el}
            shouldItemRender={(item,str) => true}
            onSelect={this.props.onSelect}
          />
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableAutocomplete)
