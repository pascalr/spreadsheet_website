import _ from 'lodash'
import React, { useState } from "react"
import { connect } from "react-redux"
import { MenuProvider } from 'react-contexify'
import { setDb } from "../actions"
import * as TABLE from '../constants/tables'
import Select from 'react-select'
import Link from '../Link'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = (dispatch) => ({
  setDb: (db,path,val) => dispatch(setDb(db,path,val)),
});

const handleSubmit = (props,desc,ref) => event => {
  event.preventDefault();
  props.setDb(props.db, [TABLE.SCREEN,props.id],{desc,ref: ref.value})
  props.linkItem.toggleEditing()
}

function optionsFromDefs(defs) {
  return _.keys(defs).map(k => (
    {value: `/tables/${k}`, label: defs[k].name}
  ))
}

const Form = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [desc, setDesc] = useState(props.desc || "");
  const [ref, setRef] = useState(props.linkRef || "");

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
        {/*<input
          value={ref}
          onChange={e => setRef(e.target.value)}
          placeholder="Reference"
          type="text"
          name="ref"
          required
        />*/}
        <Select
          value={ref}
          options={optionsFromDefs(props.defs)}
          onChange={e => setRef(e)}
          classNamePrefix='selectInput'
        />

        <button type="submit">Update</button>
        <button onClick={props.linkItem.toggleEditing}>Cancel</button>
      </form>
    </div>
  );
})

class EditLinkItem extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Form {...this.props}/>
      </React.Fragment>
    );
  }
}

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
          {this.props.linkRef ?
            <Link to={this.props.linkRef}>
              <span className="linkDesc">{this.props.desc}</span>
            </Link> :
            <span className="linkDesc">{this.props.desc}</span>
          }
        </MenuProvider>
      </React.Fragment>
    );
  }
}

export default LinkItem;
