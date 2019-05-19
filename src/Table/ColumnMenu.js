import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { set, deleteColumn } from '../actions'

import * as TABLE from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  deleteColumn: (db) => ({props}) => dispatch(deleteColumn(db,props.def,props.id,props.layoutNb)),
  set: path => val => dispatch(set(path,val)),
});

class ColumnMenu extends React.Component {

  onTypeChange = (type) => ({props}) => {
    const path = [TABLE.DEFS,props.def.id,'cols',props.id,'type']
    this.props.db.set(path,type, this.props.set(path, type));
  }

  render() {
    console.log('----------------------------------------------------')
    const {db} = this.props;
    return(
      <Menu id="columnMenu">
        <Item onClick={this.props.deleteColumn(db)}>delete column</Item>
        <Submenu label="type">
          <Item onClick={this.onTypeChange('')}>none</Item>
          <Item onClick={this.onTypeChange('link')}>link</Item>
          <Item onClick={this.onTypeChange('checkbox')}>checkbox</Item>
          <Item onClick={this.onTypeChange('document')}>document</Item>
        </Submenu>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnMenu);
