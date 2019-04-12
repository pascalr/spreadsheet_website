import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'
import uuidv1 from 'uuid/v1'
import { newTable, set, modelLoaded } from "./actions"
import * as TABLE from './constants/tables'
import Table from './Table'

const formProps = state => ({
  db: state.db,
  defs: state.defs,
})

const formDispatch = dispatch => ({
  newTable: (db, defs, name) => () => dispatch(newTable(db,defs,name)),
})

const handleSubmit = (props,desc,cmd,ref) => event => {
  event.preventDefault();
  //props.updateDb(props.db, [TABLE.ITEMS,props.id],{desc,ref,cmd})
  //props.linkItem.toggleEditing()
}

// When the user makes it a selection, it creates a temporaty table.
// If the user takes the focus away from the text field, delete it
// If the user writes something, make a table
class TemporaryTable extends React.Component {
  componentDidMount = () => {
    this.nameInput.focus();
  }
  onKeyUp = (e) => {
    // Enter key confirms the Table
    if (e.which === 13) { 
      this.props.setConfirmed(true)
    // ESC key cancels
    } else if (e.which === 27) {
      this.props.setCancelled(true)
    }
  }
  render = () => {
    return(
      <div onKeyUp={this.onKeyUp}>
        <input
          type="text"
          ref={(input) => { this.nameInput = input; }}
          defaultValue=""
        />
      </div>
    );
  }
}

const persistentProps = state => ({
  db: state.db,
})

const persistentDispatch = dispatch => ({
  set: path => val => dispatch(set(path,val)),
})

class RawPersistent extends React.Component {
  render = () => {
    const {table,key,children,ref,set,db,id,...rest} = this.props
    if (!table) {throw new Error("In order to persist, table is required.");}
    if (!id) {throw new Error("In order to persist, id is required.");}
    const path = [table,id]
    // FIXME: db.setPath(path, rest, set(path))
    db.setPath(path, rest)
    set(path)(rest)
    return children
  }
}
const Persistent = connect(persistentProps, persistentDispatch)(RawPersistent)
  /*const persistent = (table, fields, children) =>
  connect(persistentProps, persistentDispatch)((props) => {

  if (!table) {throw new Error("In order to persist, table is required.");}
  if (!props.id) {throw new Error("In order to persist, id is required.");}
  const path = [table,props.id]
  const val = _.pick(props,fields)
  props.db.setPath(path, val, props.set(path))
  return <React.Fragment>{children(props)}</React.Fragment>
})*/

// A table preview is in limbo until it is confirmed.
const LimboTable = connect(formProps, formDispatch)((props) => {
  const [confirmed, setConfirmed] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  if (cancelled) {return null}
  return (
    <div style={{
      position: 'absolute',
      width: props.width,
      height: props.height,
      left: props.x,
      top: props.y,
      backgroundColor: 'rgba(0,0,255,.2)',
      border: '1px solid #ccc',
    }}>
    {
      confirmed
      ? <Table {...props} id={props.tableId} hideColumnNames={true} hideTableName={true}/>
      : <TemporaryTable {...props} setCancelled={setCancelled}
        setConfirmed={() => {setConfirmed(true)
          newTable(props.db,props.defs,null,props.tableId)
        }} />
    }
    </div>
  )
})

const clickIsOutside = (e,box) => {
  return (e.clientX < box.x || e.clientY < box.y ||
    e.clientX > box.x + box.width ||
    e.clientY > box.y + box.height)
}

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
  previews: state.cache[TABLE.PREVIEW],
})

const mapDispatchToProps = dispatch => ({
  modelLoaded: (model) => dispatch(modelLoaded(TABLE.PREVIEW, model))
})

class PreviewSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {previews: {}, selection: []}
  }
  componentDidMount = () => {
    //this.props.db.load(TABLE.PREVIEW, this.props.modelLoaded)
  }
  // If the selection includes at least one preview, select it.
  // Else, create a new empty preview.
  onSelect = (x0,x1,y0,y1) => {
    const id = uuidv1()
    const p = {id, width: x1-x0,height: y1-y0,x: x0, y:y0}
    // TODO: Create a new def, create a new table
    const tableId = uuidv1()
    p.tableId = tableId;
    this.setState({previews: {...this.state.previews, [id]: p}, selection: [id]})
  }
  onMouseDown = (e) => {
    // Checks if the previously created table is empty and delete if so
    if (this.state.selection.length === 1) {
      const s = this.state.selection[0];
      if (!s.value && clickIsOutside(e,this.state.previews[s])) {
        const previews = {...this.state.previews}
        const f = _.keys(previews).reduce((acc,e) => {
          if (e !== s) {
            acc[e] = previews[e]
          }
          return acc
        },{})
        this.setState({previews: f})
      }
    }
  }

  canStartSelection = (e) => {
    let can = true
    _.values(this.state.previews).map(p => {
      if (!clickIsOutside(e,p)) {
        can = false
      }
    })
    return can
  }

  render = () => {
    return (
      <Selection onSelect={this.onSelect} onMouseDown={this.onMouseDown}
      canStart={this.canStartSelection}>
        <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}
          style={{width: 1920, height: 1024}}
          onMouseUp={this.onMouseUp}
        >
          {/* _.keys(this.props.previews).map((p,i) => (
            <div key={i}>
              <LimboTable {...this.state.previews[p]}/>
            </div>
          ))*/}
          { _.keys(this.state.previews).map((p,i) => (
            <div key={i}>
              <Persistent {...this.state.previews[p]} table={TABLE.PREVIEW}>
                <LimboTable {...this.state.previews[p]}/>
              </Persistent>
            </div>
          ))}
        </div>
      </Selection>
    );
  }
}

const connectedPreviewSelection = connect(mapStateToProps,mapDispatchToProps)(PreviewSelection)
export {connectedPreviewSelection as PreviewSelection }
