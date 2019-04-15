import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import Autocomplete from 'react-autocomplete'
import { addPreview } from "./actions"

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
  position: 'fixed',
  overflow: 'auto',
  maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
}

const mapStateToProps = state => ({
  defs: state.defs,
  history: state.history,
  db: state.db,
})

const mapDispatchToProps = dispatch => ({
  addPreview: (db, id) => dispatch(addPreview(db,id)),
})

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
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
                <span onClick={() => {this.props.addPreview(this.props.db,item.id)}}>[Add]  </span>
                {item.label}
              </div>
            )}
            shouldItemRender={(item,str) => true}
            onSelect={(val, item) => this.props.history.push(item.value)}
            menuStyle={autocompleteMenuStyle}
          />
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchBar)
