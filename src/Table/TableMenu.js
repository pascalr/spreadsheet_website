import _ from 'lodash'
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
  addColumn: (db, def) => (() => dispatch(addColumn(db, def))),
  deleteTable: () => dispatch(deleteTable()),
});

class TableMenu extends React.Component {
  render() {
    const {db, def} = this.props
    return(
      <Menu id="tableMenu">
        <Item onClick={this.props.addColumn(db,def)}>add column</Item>
        <Item onClick={this.props.deleteTable}>delete table</Item>
        {(def && def.cols) ?
          <Submenu label="order by">
            {_.values(_.mapValues(def.cols, 'name')).map((n,i) => (
              <Item key={i} onClick={() => alert('works')}>{n}</Item>
            ))}
          </Submenu> : null}
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMenu);
