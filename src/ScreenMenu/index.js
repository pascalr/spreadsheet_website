import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'

import { toggleEditMode } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapDispatchToProps = (dispatch) => ({
  toggleEditMode: () => dispatch(toggleEditMode())
});

// withDispatch(React.Component)
// this.dispatch(toggleEditMode())
class RawScreenMenu extends React.Component {
  render() {
    return(
      <Menu id="screen_menu">
        <Submenu label="add table">
          <Item onClick={onClickMenu}><input type='text' /></Item>
          {Object.keys(this.props.defs || {}).map(d => (
            <Item onClick={this.props.screen.addTable(d)} key={d}>{d}</Item>
          ))}
        </Submenu>
        <Item onClick={this.props.defsHandler.newTable} data={{test: 10}}>new table</Item>
        <Item onClick={this.props.toggleEditMode}>edit mode</Item>
      </Menu>
    );
  }
}

const ScreenMenu = connect(null, mapDispatchToProps)(RawScreenMenu);

export default ScreenMenu;
