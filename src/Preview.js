import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'
import uuidv1 from 'uuid/v1'
import { deletePath, newTable, set, setDb } from "./actions"
import * as TABLE from './constants/tables'
import * as PATH from './constants/paths'
import Table from './Table'
import Draggable from './Draggable'
import Resizable from './Resizable'
import TableAutocomplete from './TableAutocomplete'
import avec from './avec'
import {PREVIEWS, MOUSE_ACTION, SELECTION, MOUSE_ACTION_ADD,
MOUSE_ACTION_DRAG, MOUSE_ACTION_RESIZE} from './consts'
import {genDef} from './helpers'
import ByPass from './lib/ByPass'

// When the user makes it a selection, it creates a temporaty table.
// If the user takes the focus away from the text field, delete it
// If the user writes something, make a table
class TemporaryTable extends React.Component {
  
  render = () => {
    return(
      <div onKeyUp={this.onKeyUp}>
        <TableAutocomplete onSelect={this.props.setConfirmed} {...this.props} />
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
      maxHeight: props.height,
      left: props.x,
      top: props.y,
    }}>
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
}

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = dispatch => ({
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
  set: (path, val) => dispatch(set(path,val)),
  deletePath: (db,path) => dispatch(deletePath(db, path)),
  newTable: (db, defs, name, id) => dispatch(newTable(db, defs, name, id)),
})

const OverBar = (props) => {
  const [over, setOver] = useState(false)
  return (
    <div
      onMouseEnter={() => {setOver(true)}}
      onMouseLeave={() => {setOver(false)}}
    >
      {over ? props.overValue : null}
      {props.children}
    </div>
  );
}

class PreviewSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tempPreview: null, selection: [], selectionToCopy: []}
  }
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    this.props.cache(SELECTION, this.state.selection)
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
    } else if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_ADD) {
  
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
    if (this.state.tempPreview && clickIsOutside(e,this.state.tempPreview)) {
      this.setState({selection: [], tempPreview: null})
    } else if (!this.state.tempPreview && this.state.selection.length > 0) {
      this.setState({selection: []})
    }
  }
  onKeyUp = (e) => {
    // Delete key deletes selected previews
    if (e.which === 46) {
      this.state.selection.forEach(s => {
        //this.props.deletePath(this.props.db,[TABLE.PREVIEW,s])
        this.props.dispatchDelete([TABLE.PREVIEW,s])
      })
    }
  }

    /*canStartSelection = (e) => {
    let can = true
    _.values(this.props.previews).map(p => {
      if (!clickIsOutside(e,p)) {
        console.log('cannot click because of the preview:')
        console.log(p)
        console.log(e)

        can = false
      }
    })
    return can
  }*/

  onMouseMove = (e) => {
    this.pageX = e.pageX
    this.pageY = e.pageY
  }

  onCopy = (e) => {
    console.log('onCopy')
    this.setState({selectionToCopy: this.state.selection})
  }

  onPaste = (e) => {
    console.log('onPaste')
    //console.log(e.clipboardData.getData('Text'));
    const cpy = this.state.selectionToCopy
    if (!cpy) { return }

    cpy.map(t => {
      const p = this.props.previews[t]
      const x = this.pageX - p.x
      const y = this.pageY - p.y
      this.props.db.get([TABLE.TABLES, p.tableId], (model) => {
        console.log('Copying ' + t)
        console.log('at ' + this.pageX)
        const oldDef = this.props.defs[p.tableId]
        const tableId = uuidv1()
        const name = tableId
        //const name = 'copy of ' + oldDef.name // FIXME: number (2)
        const def = {...oldDef, name}
        this.props.db.set([TABLE.DEFS,tableId],def)
        // Duplicate table
        let path = [TABLE.TABLES, tableId]
        this.props.setDb(this.props.db, path, model)
        // Create preview
        const previewId = uuidv1()
        path = [TABLE.PREVIEW, previewId]
        const newP = {id: previewId, width: p.width, height: p.height, x, y, tableId}
        this.props.setDb(this.props.db, path, newP)
      })
      console.log(this)
    })
  }

  render = () => {
    let canSelect = true
    if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_DRAG) {canSelect = false}
    if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_RESIZE) {canSelect = false}

    return (
     <ByPass if={!canSelect}>
     <Selection onSelect={this.onSelect} onMouseDown={this.onMouseDown}
     canStart={this.canStartSelection}>
        <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}
          style={{width: 1920, height: 10000, outline: 'none'}}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onKeyUp={this.onKeyUp}
          tabIndex='0'
          onPaste={this.onPaste}
          onCopy={this.onCopy}
        >
          { _.keys(this.props.previews).map(k => {
            const p = this.props.previews[k]
            const selected = this.state.selection.includes(k)
            return (
              <div key={k}>
                <Draggable
                  path={[TABLE.PREVIEW, k]}
                  x={p.x}
                  y={p.y}
                  disabled={false}
                >
                  <Resizable
                    path={[TABLE.PREVIEW, k]}
                    {...p}
                  disabled={false}
                >
                    <LocatedPreview {...p} selected={this.state.selection.includes(k)}>
                  <div className='popover__wrapper'>
                      <div className='popover__content'>
                        <div className='flexHandles'>
                          <div className='clickHandle'
                            onClick={() => this.props.set('route',`/tables/${p.tableId}`)}
                          />
                          <div className='dragHandle'/>
                          <div className='resizeHandle'/>
                        </div>
                      </div>
                      <div className={selected ? 'selected' : 'notSelected'} style={{
                      }}>
                        <Table id={p.tableId} hideColumnNames={true} hideTableName={true} hideLineNumbers={true}/>
                      </div>
              </div>
                </LocatedPreview>
            </Resizable>
                    </Draggable>
            </div>)
          })}
          { !this.state.tempPreview ? null :
          <LocatedPreview {...this.state.tempPreview}>
            <TemporaryTable
              setCancelled={() => {this.setState({selection: [], tempPreview: null})}}
              setConfirmed={(tableName) => {this.setState({selection: [], tempPreview: null});
                const preview = this.state.tempPreview
                const path = [TABLE.PREVIEW, this.state.tempPreview.id]
                const ids = _.keys(this.props.defs).filter(k => (
                  this.props.defs[k].name === tableName
                ))
                if (ids && ids.length === 1) {
                  preview.tableId = ids[0]
                } else {
                  const def = genDef(this.props.defs,null,this.state.tempPreview.tableId)
                  this.props.dispatch([TABLE.DEFS,def.id],def.attrs)
                  this.props.dispatch([TABLE.TABLES,def.id],'')
                }
                this.props.dispatch(path, preview);
              }}
            />
          </LocatedPreview>
          }
        </div>
      </Selection>
      </ByPass>
    );
  }
}

  /*const load = (LoadObj) => (props) => {
  return <Loading path={TABLE.PREVIEW}>
    <LoadObj {...props}/>
  </Loading>
}*/

const connectedPreviewSelection = connect(mapStateToProps,mapDispatchToProps)(avec([PREVIEWS, MOUSE_ACTION], PreviewSelection))
export {connectedPreviewSelection as PreviewSelection }
