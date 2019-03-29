import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { deleteTable } from '../actions'

import { toggleEditMode } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
  history: state.history,
})

const mapDispatchToProps = (dispatch) => ({
  deleteTable: (db) => ({props}) => dispatch(deleteTable(db,props.id)),
});

const edit = history => ({event, props}) => {
  history.push('/edit/' + props.name)
}

class LinkMenu extends React.Component {

  onToggleEditing({event, props}) {
    props.linkItem.toggleEditing()
  }

  render() {
    const {db} = this.props;
    return(
      <Menu id="linkMenu">
        <Item onClick={this.onToggleEditing}>edit</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkMenu);
