import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { addColumn, deleteColumn, deleteTable } from '../actions'

import { toggleEditMode } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  deleteColumn: (db,def) => ({props}) => dispatch(deleteColumn(db,def,props.name)),
});

class ColumnMenu extends React.Component {
  render() {
    const {db, def} = this.props;
    return(
      <Menu id="columnMenu">
        <Item onClick={this.props.deleteColumn(db,def)}>delete column</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnMenu);
