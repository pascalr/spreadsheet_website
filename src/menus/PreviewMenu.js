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
});

class PreviewMenu extends React.Component {

  render() {
    const {db} = this.props;
    return(
      <Menu id="previewMenu">
        <Item onClick={() => (null)}>delete</Item>
      </Menu>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewMenu);
