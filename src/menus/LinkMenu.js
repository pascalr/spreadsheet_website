import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'
import { deletePath } from '../actions'
import * as TABLE from '../constants/tables'

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  deleteLinkItem: (db) => ({props}) => dispatch(deletePath(db,[TABLE.ITEMS, props.id])),
});

class LinkMenu extends React.Component {

  onToggleEditing({event, props}) {
    props.linkItem.toggleEditing()
  }

  render() {
    const {db} = this.props;
    return(
      <Menu id="linkMenu">
        <Item onClick={this.onToggleEditing}>edit</Item>
        <Item onClick={this.props.deleteLinkItem(this.props.db)}>delete</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkMenu);
