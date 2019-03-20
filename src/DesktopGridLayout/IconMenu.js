import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { deleteTable } from '../actions'

import { toggleEditMode } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  deleteTable: (db,def) => ({props}) => dispatch(deleteTable(db,props.name)),
});

class IconMenu extends React.Component {
  render() {
    const {db} = this.props;
    return(
      <Menu id="iconMenu">
        <Item onClick={this.props.deleteTable(db)}>delete table</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IconMenu);
