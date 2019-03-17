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
  deleteColumn: (name) => () => dispatch(deleteColumn(name)),
});

class ColumnMenu extends React.Component {
  render() {
    return(
      <Menu id="tableMenu">
        <Item onClick={this.props.addColumn}>delete column</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnMenu);
