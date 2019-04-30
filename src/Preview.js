import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'
import uuidv1 from 'uuid/v1'
import { deletePath, newTable, set, modelLoaded, setDb } from "./actions"
import * as TABLE from './constants/tables'
import * as PATH from './constants/paths'
import Table from './Table'
import { MenuProvider } from 'react-contexify'
import Draggable from './Draggable'
import Resizable from './Resizable'
import TableAutocomplete from './TableAutocomplete'

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
  previews: state.cache[TABLE.PREVIEW],
})

const mapDispatchToProps = dispatch => ({
  modelLoaded: (model) => dispatch(modelLoaded(TABLE.PREVIEW, model)),
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
  set: (path, val) => dispatch(set(path,val)),
  deletePath: (db,path) => dispatch(deletePath(db, path)),
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
        this.props.deletePath(this.props.db,[TABLE.PREVIEW,s])
      })
    }
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
          style={{width: 1920, height: 10000}}
          onMouseUp={this.onMouseUp}
          onKeyUp={this.onKeyUp}
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
                            onClick={() => this.props.set(PATH.ROUTE,`/tables/${p.tableId}`)}
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
                  newTable(this.props.db,this.props.defs,null,this.state.tempPreview.tableId)
                }
                this.props.setDb(this.props.db, path, preview);
              }}
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
