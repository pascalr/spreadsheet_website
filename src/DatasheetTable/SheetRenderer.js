import React from 'react'
import { connect } from "react-redux";

import { MenuProvider } from 'react-contexify'

import { columnDropped } from '../actions'

import { colDragSource, colDropTarget } from './drag-drop.js'

import ColumnMenu from '../Table/ColumnMenu'

const Header = colDropTarget(colDragSource((props) => {
  const { def, col, connectDragSource, connectDropTarget, isOver} = props
  const className = 'rTableHead cell read-only' + (isOver ? 'drop-target' : '')
  return (
    connectDropTarget(
      connectDragSource(
        <div className={className} style={{ width: col.width }}>
          <MenuProvider id="columnMenu"
            data={{id: col.id}}
            className="columnMenu menu"
          >
            {col.name}
          </MenuProvider>
        </div>
      )))
}))

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  onColumnDrop: (db, def) => (from, to) => dispatch(columnDropped(db, def, from, to)),
})

class SheetRenderer extends React.PureComponent {
  render () {
    const { db, className, def } = this.props
    return (
      <div className={"rTable "+className}
           style={{backgroundColor: this.props.def.backgroundColor}}>
        <ColumnMenu db={db} def={def} />
        <div className="rCaption">
          {def.name}
        </div>
        <div className="rTableHeading">
          <div className="rTableRow">
            <div className='rTableHead cell read-only row-handle' key='$$actionCell'
              style={{width: 30/*FIXME: The width varies with the nb of rows*/}}
            />
            {
              (def.layout && def.cols) ?
                def.layout[0].map((id, index) => {
                  const col = def.cols[id]
                  return (
                    <Header key={col.name} col={col} def={def} className="data-header"
                      columnIndex={index}
                      onColumnDrop={this.props.onColumnDrop(this.props.db, def)}
                    />
                  );
                }) : null
            }
          </div>
        </div>
        <div className="rTableBody data-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetRenderer);
