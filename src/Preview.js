import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'
import uuidv1 from 'uuid/v1'
import { newTable, set, modelLoaded, setDb } from "./actions"
import * as TABLE from './constants/tables'
import * as PATH from './constants/paths'
import Table from './Table'
import { MenuProvider } from 'react-contexify'

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
      // TODO: Get the value of the input field.
      // If the input field matches an existing table,
      // create a preview that links to the table
      // TODO: Make the input value inserted inside the table
      // Or just create a table everytime???
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

const LocatedPreview = (props) => {
  return (
    <div style={{
      position: 'absolute',
      width: props.width,
      height: props.height,
      maxHeight: props.height,/*FIXME: Does not seem to work as I expected*/
      overflowY: 'auto',
      overflowX: 'hidden',
      left: props.x,
      top: props.y,
    }} className={props.selected ? 'selected' : 'notSelected'}>
      { props.children }
    </div>
  )
}
const xyToBox = (x0,y0,x1,y1) => {
  return {x: x0, y: y0, width: x1-x0, height: y1-y0}
}
const selectionIsOutside = (x,y,box) => {
  return (x < box.x || y < box.y ||
    x > box.x + box.width ||
    y > box.y + box.height)
}
const clickIsOutside = (e,box) => {
  return selectionIsOutside(e.clientX,e.clientY,box)
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
  modelLoaded: (model) => dispatch(modelLoaded(TABLE.PREVIEW, model)),
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
  set: (path, val) => dispatch(set(path,val)),
})

class PreviewSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tempPreview: null, selection: []}
  }
  componentDidMount = () => {
    this.props.set(PATH.UI_LOADING, true)
    this.props.db.load(TABLE.PREVIEW, (model) => {
      this.props.modelLoaded(model);
      this.props.set(PATH.UI_LOADING, false)
    })
  }
  // If the selection includes at least one preview, select it.
  // Else, create a new empty preview.
  onSelect = (x0,x1,y0,y1) => {
    // If the selection includes at least one preview, select it.
    const ids = _.keys(this.props.previews).map(k => {
      const p = this.props.previews[k]
      const box = xyToBox(x0,y0,x1,y1)
      const x_c = p.x + p.width/2
      const y_c = p.y + p.height/2
      // The preview is selection if the box includes the center of the preview.
      if (!selectionIsOutside(x_c,y_c,box)) {
        return k
      }
      return null
    }).filter(e => (e!==null))
    
    if (ids && ids.length !== 0) {
      this.setState({selection: ids})
    } else {
  
      const width = x1-x0
      const height = y1-y0
      // Create a new empty preview if it is a real selection (wide enough)
      if (width > 20 || height > 20) {
        const id = uuidv1()
        const tableId = uuidv1()
        const p = {id, width, height, x: x0, y:y0, tableId}
        this.setState({selection: [id], tempPreview: p})
        //
      }
    }
  }
  onMouseDown = (e) => {
    this.setState({selection: [], tempPreview: null})
  }

  canStartSelection = (e) => {
    let can = true
    _.values(this.props.previews).map(p => {
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
          { _.keys(this.props.previews).map((k,i) => {
            const p = this.props.previews[k]
            return (
              <div key={i}>
                <LocatedPreview {...p} selected={this.state.selection.includes(k)}>
                  <MenuProvider id="previewMenu" className="menu" data={{tableId: p.tableId}}>
                    <Table id={p.tableId} hideColumnNames={true} hideTableName={true}/>
                  </MenuProvider>
                </LocatedPreview>
            </div>)
          })}
          { !this.state.tempPreview ? null :
          <LocatedPreview {...this.state.tempPreview}>
            <TemporaryTable
              setCancelled={() => {this.setState({selection: [], tempPreview: null})}}
              setConfirmed={() => {this.setState({selection: [], tempPreview: null});
                this.props.setDb(this.props.db, [TABLE.PREVIEW, this.state.tempPreview.id], this.state.tempPreview);
                newTable(this.props.db,this.props.defs,null,this.state.tempPreview.tableId)}}
            />
          </LocatedPreview>
          }
        </div>
      </Selection>
    );
  }
}

const connectedPreviewSelection = connect(mapStateToProps,mapDispatchToProps)(PreviewSelection)
export {connectedPreviewSelection as PreviewSelection }
