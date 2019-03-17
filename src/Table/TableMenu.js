import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { addColumn, deleteColumn, deleteTable } from '../actions'

import { toggleEditMode } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = (dispatch) => ({
  addColumn: () => dispatch(addColumn()),
  deleteColumn: (name) => () => dispatch(deleteColumn(name)),
  deleteTable: () => dispatch(deleteTable()),
});

class TableMenu extends React.Component {
  render() {
    return(
      <Menu id="tableMenu">
        <Item onClick={this.props.addColumn}>add column</Item>
        <Item onClick={this.props.deleteTable}>delete table</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMenu);
