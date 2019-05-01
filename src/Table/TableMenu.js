import _ from 'lodash'
import React from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'

import { addColumn, deleteTable, addColumnUnder } from '../actions'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  addColumn: (db) => ((props) => dispatch(addColumn(db, props.def))),
  addColumnUnder: (db) => ((props) => dispatch(addColumnUnder(db, props.def))),
  //deleteTable: (props) => dispatch(deleteTable()),
});

class TableMenu extends React.Component {
  render() {
    const {db} = this.props
    return(
      <Menu id="tableMenu">
        <Item onClick={this.props.addColumn(db)}>add column</Item>
        <Item onClick={this.props.addColumnUnder(db)}>add column under</Item>
        {/*<Item onClick={this.props.deleteTable}>delete table</Item>*/}
        {/*(def && def.cols) ?
          <Submenu label="order by">
            {_.values(_.mapValues(def.cols, 'name')).map((n,i) => (
              <Item key={i} onClick={() => alert('works')}>{n}</Item>
            ))}
          </Submenu> : null*/}
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMenu);
