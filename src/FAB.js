import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import { Fab, Action } from 'react-tiny-fab'
import 'react-tiny-fab/dist/styles.min.css'
// List of icons here: https://react-icons.netlify.com/#/icons/md
import {
  MdAdd,
  MdSettings,
  MdMoreHoriz,
} from 'react-icons/md';
import { newTable, set } from "./actions"
import uuidv1 from 'uuid/v1'
import * as PATH from './constants/paths'

const position = {
      bottom: 0,
      right: 0,
    }
const event  = 'click'

const mainButtonStyles = {
      backgroundColor: '#e74c3c',
    }
const actionButtonStyles = {
      backgroundColor: '#ffffff',
      color: '#34495e',
}

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
})

const mapDispatchToProps = dispatch => ({
  newTable: (db,defs,name,id,callback) => dispatch(newTable(db,defs,name,id,callback)),
  set: (path, val) => dispatch(set(path,val)),
})

class MyFAB extends React.Component {
  render() {
    return (
      <Fab
        mainButtonStyles={mainButtonStyles}
        position={position}
        icon={<MdMoreHoriz />}
        event={event}
      >
        <Action
          style={actionButtonStyles}
          text="Edit settings"
          onClick={e => {
          }}
        >
          <MdSettings />
        </Action>
        <Action
          style={actionButtonStyles}
          text="New table"
          onClick={e => {
            const id = uuidv1()
            this.props.newTable(this.props.db,this.props.defs, null, id, (vals) => {
              this.props.set(PATH.ROUTE,`/tables/${id}`)
            })
          }}
        >
          <MdAdd />
        </Action>
      </Fab>
    )
  }
}

    /*export const renderFAB = c =>
  <Fab
    mainButtonStyles={mainButtonStyles}
    position={position}
    icon={<MdMoreHoriz />}
    event={event}
  >
    <Action
      style={actionButtonStyles}
      text="Email"
      onClick={e => {
        alert('I printed the event to the console.');
        console.log(e);
      }}
    >
      <MdEmail />
    </Action>
    <Action
      style={actionButtonStyles}
      text="Notifications"
      onClick={() => alert('Here is your notification.')}
    >
      <MdNotifications />
    </Action>
    <Action style={actionButtonStyles} text="Fullscreen" onClick={() => alert('What?')}>
      <MdPages />
    </Action>
    <Action style={actionButtonStyles} text="Search" onClick={() => alert('No search...')}>
      <MdSearch />
    </Action>
    <Action style={actionButtonStyles} text="Editor" onClick={e => console.log(e)}>
      <MdCode />
    </Action>
    <Action
      style={actionButtonStyles}
      text="Like it!"
      onClick={() => alert('This is fantastic!')}
    >
      <MdFavorite />
    </Action>
  </Fab>*/

export default connect(mapStateToProps,mapDispatchToProps)(MyFAB)
