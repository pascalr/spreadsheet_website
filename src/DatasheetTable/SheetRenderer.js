import _ from 'lodash'
import React from 'react'
import { connect } from "react-redux";
import { MenuProvider } from 'react-contexify'
import { columnDropped } from '../actions'
import { colDragSource, colDropTarget } from './drag-drop.js'
import { RIEInput } from 'riek'
import { set } from '../actions'
import * as TABLE from '../constants/tables'
import avec from '../avec'

const colMapStateToProps = state => ({
  db: state.db,
});

const colMapDispatchToProps = dispatch => ({
  set: path => val => dispatch(set(path,val))
})

class ColumnNameBase extends React.Component {

  onColumnNameChange = (props) => {
    const path = [TABLE.DEFS,this.props.def.id,'cols',this.props.col.id,'name']
    this.props.dispatch(path,props.columnName)
    //this.props.db.set(path,props.columnName,
    //  this.props.set(path, props.columnName));
  }

  render = () => {
    return (
      <RIEInput
        value={this.props.col.name}
        change={this.onColumnNameChange}
        propName='columnName'
        validate={_.isString} />
    )
  }
}

const ColumnName = connect(colMapStateToProps, colMapDispatchToProps)(avec(null, ColumnNameBase));

class HeaderBase extends React.Component {
  render() {
    const { def, col, connectDragSource, connectDropTarget, isOver} = this.props
    const className = 'rTableHead cell read-only' + (isOver ? 'drop-target' : '')
    return (
      connectDropTarget(
        connectDragSource(
          <div className={className} style={{ width: col.width }}>
            <MenuProvider id="columnMenu"
              data={{id: col.id, layoutNb: this.props.layoutNb, def}}
              className="columnMenu menu"
            >
              <ColumnName col={col} def={def}/>
            </MenuProvider>
          </div>
        )))
  }
}
const Header = colDropTarget(colDragSource(HeaderBase))

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
        { this.props.hideColumnNames || this.props.isField ? null :
        <div className="rTableHeading">
          <div className="rTableRow">
            <div className='rTableHead cell read-only row-handle' key='$$actionCell'
              style={{width: 30/*FIXME: The width varies with the nb of rows*/}}
            />
            {
              (def.layout && def.cols) ?
                def.layout[this.props.layoutNb].map((id, index) => {
                  const col = def.cols[id]
                  return (
                    <Header key={id} col={col} def={def} className="data-header"
                      columnIndex={index} layoutNb={this.props.layoutNb}
                      onColumnDrop={this.props.onColumnDrop(this.props.db, def)}
                    />
                  );
                }) : null
            }
          </div>
        </div>}
        <div className="rTableBody data-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SheetRenderer);
