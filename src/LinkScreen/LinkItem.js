import _ from 'lodash'
import React, { useState } from "react"
import { connect } from "react-redux";
import { Menu, Item, Submenu } from 'react-contexify'
import { MenuProvider } from 'react-contexify'
import { setDb } from "../actions";
import * as TABLE from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  setDb: (db,path,val) => dispatch(setDb(db,path,val)),
});

const handleSubmit = (props,desc,ref) => event => {
  event.preventDefault();
  props.setDb(props.db, [TABLE.SCREEN,props.id],{desc,ref})
  props.linkItem.toggleEditing()
}

const Form = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [desc, setDesc] = useState(props.desc || "");
  const [ref, setRef] = useState(props.ref || "");

  //<div onBlur={props.linkItem.toggleEditing}>
  return (
    <div>
      <form onSubmit={handleSubmit(props,desc,ref)}>
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
          type="text"
          name="desc"
          required
        />
        <input
          value={ref}
          onChange={e => setRef(e.target.value)}
          placeholder="Reference"
          type="text"
          name="ref"
          required
        />

        <button type="submit">Update</button>
        <button onClick={props.linkItem.toggleEditing}>Cancel</button>
      </form>
    </div>
  );
})

class EditLinkItemBase extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Form {...this.props}/>
      </React.Fragment>
    );
  }
}

const EditLinkItem = connect(mapStateToProps, mapDispatchToProps)(EditLinkItemBase);

class LinkItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editing: false}
  }
  toggleEditing = () => {
    this.setState({editing: !this.state.editing})
  }
  render() {
    if (this.state.editing) { return <EditLinkItem {...this.props} linkItem={this} /> }
    return(
      <React.Fragment>
        <MenuProvider id="linkMenu" data={{linkItem: this}}>
          <span className="linkDesc">{this.props.desc}</span>
        </MenuProvider>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkItem);
