import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { set, deleteColumn } from '../actions'

import * as TABLE from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  deleteColumn: (db,def) => ({props}) => dispatch(deleteColumn(db,def,props.id)),
  set: path => val => dispatch(set(path,val)),
});

class ColumnMenu extends React.Component {

  onTypeChange = (def, type) => ({props}) => {
    const path = [TABLE.DEFS,def.id,'cols',props.id,'type']
    this.props.db.setPath(path,type, this.props.set(path, type));
  }

  render() {
    const {db, def} = this.props;
    return(
      <Menu id="columnMenu">
        <Item onClick={this.props.deleteColumn(db,def)}>delete column</Item>
        <Submenu label="type">
          <Item onClick={this.onTypeChange(def,'')}>none</Item>
          <Item onClick={this.onTypeChange(def,'link')}>link</Item>
          <Item onClick={this.onTypeChange(def,'checkbox')}>checkbox</Item>
        </Submenu>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnMenu);
