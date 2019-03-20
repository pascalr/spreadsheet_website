import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { toggleEditMode, addTableToScreen, newTable } from "../actions";

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = (dispatch) => ({
  toggleEditMode: () => dispatch(toggleEditMode()),
  newTable: (db, defs) => () => dispatch(newTable(db,defs)),
  addTableToScreen: (screen, name) => () => dispatch(addTableToScreen(screen, name))
});

class ScreenMenu extends React.Component {
  render() {
    return(
      <Menu id="screen_menu">
        <Submenu label="add table">
          <Item onClick={onClickMenu}><input type='text' /></Item>
          {Object.keys(this.props.defs || {}).map(d => (
            <Item onClick={this.props.addTableToScreen(this.props.screen, d)} key={d}>{d}</Item>
          ))}
        </Submenu>
        <Item onClick={this.props.newTable(this.props.db,this.props.defs)}
              data={{test: 10}}>new table</Item>
        <Item onClick={this.props.toggleEditMode}>edit mode</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMenu);
