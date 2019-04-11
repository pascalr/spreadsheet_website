import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'
import uuidv1 from 'uuid/v1'
import { newTable, set } from "./actions"
import * as TABLE from './constants/tables'
import Table from './Table'

const formProps = state => ({
})

const formDispatch = dispatch => ({
})

const handleSubmit = (props,desc,cmd,ref) => event => {
  event.preventDefault();
  //props.updateDb(props.db, [TABLE.ITEMS,props.id],{desc,ref,cmd})
  //props.linkItem.toggleEditing()
}

const Form = connect(formProps, formDispatch)((props) => {
  const [desc, setDesc] = useState(props.desc || "");
  const [cmd, setCmd] = useState(props.cmd || "");
  const [linkRef, setLinkRef] = useState(props.linkRef || "");

  return (
    <div>
      <form onSubmit={handleSubmit(props,desc,cmd,linkRef)}>
        <textarea
          value={cmd}
          onChange={e => setCmd(e.target.value)}
          placeholder="Command"
          type="text"
          name="cmd"
        />
        <button type="submit">Update</button>
        <button onClick={() => (null)}>Cancel</button>
      </form>
    </div>
  );
})

const previewProps = state => ({
})

const previewDispatch = dispatch => ({
})

class RawPreview extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    return (
      <div style={{
        position: 'absolute',
        width: this.props.width,
        height: this.props.height,
        left: this.props.x,
        top: this.props.y,
        backgroundColor: 'rgba(0,0,255,.2)',
        border: '1px solid #ccc',
      }}>
      {/*<Table id={this.props.tableId}/>*/}
      </div>
    );
  }
}

const Preview = connect(previewProps,previewDispatch)(RawPreview)

const clickIsOutside = (e,box) => {
  return (e.clientX < box.x || e.clientY < box.y ||
    e.clientX > box.x + box.width ||
    e.clientY > box.y + box.height)
}

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = dispatch => ({
  newTable: (db, defs, name) => () => dispatch(newTable(db,defs,name)),
})

// When the user makes it a selection, it creates a temporaty table.
// If the user takes the focus away from the text field, delete it
// If the user writes something, make a table
class TemporatyTable extends React.Component {
}

class PreviewSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {previews: {}, selection: []}
  }
  // If the selection includes at least one preview, select it.
  // Else, create a new empty preview.
  onSelect = (x0,x1,y0,y1) => {
    const id = uuidv1()
    const p = {id, width: x1-x0,height: y1-y0,x: x0, y:y0}
    // TODO: Create a new def, create a new table
    const tableId = uuidv1()
    newTable(this.props.db,this.props.defs,null,tableId)
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
    _.values(this.state.previews).map(p => {
      if (!clickIsOutside(e,p)) {
        console.log('false')
        return false
      }
    })
    console.log('true')
    return true
  }

  render = () => {
    return (
      <Selection onSelect={this.onSelect} onMouseDown={this.onMouseDown}
      canStart={this.canStartSelection}>
        <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}
          style={{width: 1920, height: 1024}}
          onMouseUp={this.onMouseUp}
        >
          { _.keys(this.state.previews).map((p,i) => (
            <div key={i}>
              <Preview {...this.state.previews[p]}/>
            </div>
          ))}
        </div>
      </Selection>
    );
  }
}

const connectedPreviewSelection = connect(mapStateToProps,mapDispatchToProps)(PreviewSelection)
export {connectedPreviewSelection as PreviewSelection }
