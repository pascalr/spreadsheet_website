import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import Autocomplete from 'react-autocomplete'
import { addPreview, set } from "./actions"
import * as PATH from './constants/paths'

function optionsFromDefs(defs) {
  return _.keys(defs).map(k => (
    {value: `/tables/${k}`, label: defs[k].name, id: k}
  ))
}

const autocompleteMenuStyle = { // FIXME: Maybe useless...
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0)',
  padding: '2px 0',
  fontSize: '90%',
  zIndex: '100',
  position: 'fixed',
  overflow: 'auto',
  maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
}

const mapStateToProps = state => ({
  defs: state.defs,
  db: state.db,
})

const mapDispatchToProps = dispatch => ({
  addPreview: (db, id) => dispatch(addPreview(db,id)),
  set: (path, val) => dispatch(set(path,val)),
})

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }
  shouldItemRender = (item,str) => {
    return _.includes(item.label, str)
  }
  render = () => {
    return (
      <React.Fragment>
        <div style={{textAlign: 'center'}}>
          <span>Tables:</span>
          <Autocomplete
            getItemValue={(item) => item.label}
            items={optionsFromDefs(this.props.defs)}
            renderItem={(item, isHighlighted) => (
              <div style={{ background: isHighlighted ? 'lightgray' : 'white',
                            cursor: 'pointer'}}
                key={item.label}
              >
                {item.label}
              </div>
            )}
            shouldItemRender={this.shouldItemRender}
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={(val, item) => this.props.set(PATH.ROUTE,item.value)}
            menuStyle={autocompleteMenuStyle}
          />
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchBar)
