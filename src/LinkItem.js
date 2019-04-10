import _ from 'lodash'
import React, { useState } from "react"
import { connect } from "react-redux"
import { MenuProvider } from 'react-contexify'
import { updateDb } from "./actions"
import * as TABLE from './constants/tables'
import Select from 'react-select'
import Autocomplete from 'react-autocomplete'
import Link from './Link'
import Draggable from './Draggable'
import Command from './Command'
import ErrorBoundary from './ErrorBoundary'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = (dispatch) => ({
  updateDb: (db,path,val) => dispatch(updateDb(db,path,val)),
});

const handleSubmit = (props,desc,cmd,ref) => event => {
  event.preventDefault();
  props.updateDb(props.db, [TABLE.ITEMS,props.id],{desc,ref,cmd})
  props.linkItem.toggleEditing()
}

function optionsFromDefs(defs) {
  return _.keys(defs).map(k => (
    {value: `/tables/${k}`, label: defs[k].name}
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

const Form = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [desc, setDesc] = useState(props.vals.desc || "");
  const [cmd, setCmd] = useState(props.vals.cmd || "");
  const [linkRef, setLinkRef] = useState(props.vals.linkRef || "");

  //<div onBlur={props.linkItem.toggleEditing}>
  return (
    <div>
      <form onSubmit={handleSubmit(props,desc,cmd,linkRef)}>
        {/*<textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
          type="text"
          name="desc"
          required
        />*/}
        {/*<input
          value={ref}
          onChange={e => setRef(e.target.value)}
          placeholder="Reference"
          type="text"
          name="ref"
          required
        />*/}
        <textarea
          value={cmd}
          onChange={e => setCmd(e.target.value)}
          placeholder="Command"
          type="text"
          name="cmd"
        />
        {/*<Autocomplete
          getItemValue={(item) => item.label}
          items={optionsFromDefs(props.defs)}
          renderItem={(item, isHighlighted) => (
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              key={item.label}
            >
              {item.label}
            </div>
          )}
          shouldItemRender={(item,str) => true}
          value={linkRef}
          onChange={(e) => setLinkRef(e.target.value)}
          onSelect={(val, item) => setLinkRef(item.value)}
          menuStyle={autocompleteMenuStyle}
        />*/}
        {/*<Select
          value={ref}
          options={optionsFromDefs(props.defs)}
          onChange={e => setRef(e)}
          classNamePrefix='selectInput'
        />*/}

        <button type="submit">Update</button>
        <button onClick={props.linkItem.toggleEditing}>Cancel</button>
      </form>
    </div>
  );
})

class EditLinkItem extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Form {...this.props}/>
      </React.Fragment>
    );
  }
}

class LinkItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editing: false}
  }
  toggleEditing = () => {
    this.setState({editing: !this.state.editing})
  }
  render() {
    return(
      <Draggable
        path={[TABLE.ITEMS, this.props.id]}
        x0={this.props.vals ? (this.props.vals.x || 0) : 0}
        y0={this.props.vals ? (this.props.vals.y || 0) : 0}
        disabled={this.state.editing}
      >
        {this.state.editing ?
          <EditLinkItem {...this.props} linkItem={this} />
        :
          <MenuProvider id="linkMenu" data={{linkItem: this}} component='span'>
            <ErrorBoundary>
              <Command {...this.props}/>
            </ErrorBoundary>
          </MenuProvider>
        }
      </Draggable>
    );
  }
}

export default LinkItem;
