import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'
import uuidv1 from 'uuid/v1'
import * as TABLE from '../constants/tables'

import { toggleEditMode, setDb } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = (dispatch) => ({
  toggleEditMode: () => dispatch(toggleEditMode()),
  newLink: (db) => () => dispatch(setDb(db,[TABLE.SCREEN,uuidv1()],{desc: "link"})),
});

class ScreenMenu extends React.Component {
  render() {
    return(
      <Menu id="link_screen_menu">
        <Item onClick={this.props.newLink(this.props.db)}
              data={{test: 10}}>new link</Item>
        <Item onClick={this.props.toggleEditMode}>edit mode</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMenu);
