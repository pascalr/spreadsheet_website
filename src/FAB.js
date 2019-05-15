import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import { Fab, Action } from 'react-tiny-fab'
import 'react-tiny-fab/dist/styles.min.css'
// List of icons here: https://react-icons.netlify.com/#/icons/md
import Popup from "reactjs-popup"
import TableAutocomplete from './TableAutocomplete'
import * as TABLE from './constants/tables'

import {
  MdAdd,
  MdSettings,
  MdHistory,
  MdMoreHoriz,
  MdPublish,
} from 'react-icons/md';
import { newTable, set, setDb } from "./actions"
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
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
})

const POPUP = {
  PUBLISH: 'publish',
  NEW: 'new',
  SETTINGS: 'settings',
  HISTORY: 'history',
}

class MyFAB extends React.Component {
  constructor(props) {
    super(props)
    this.state = {popup: ''}
  }
  render() {
    return (
      <div>
        <Popup open={this.state.popup === POPUP.PUBLISH} modal
          closeOnDocumentClick
          onClose={() => this.setState({popup: ''})}
        >
          <div className='modal'>
            <div className="header">Publish</div>
            <div className='content'>
              Publish as html. Publish as pdf.
            </div>
          </div>
        </Popup>
        <Popup open={this.state.popup === POPUP.NEW} modal
          closeOnDocumentClick
          onClose={() => this.setState({popup: ''})}
        >
          <div className='modal'>
            <div className="header">New table</div>
            <div className='content'>
              New empty table or create from template.<br />
              Recent templates:<br />
              All templates available:<br />
              <TableAutocomplete onSelect={(tableName) => {
                //const id = uuidv1()
                //this.props.newTable(this.props.db,this.props.defs, null, id, (vals) => {
                //  this.props.set(PATH.ROUTE,`/tables/${id}`)
                //})
                const ids = _.keys(this.props.defs).filter(k => (
                  this.props.defs[k].name === tableName
                ))
                if (ids && ids.length === 1) {
                  this.props.db.loadRecord(TABLE.TABLES,ids[0],(data) => {
                    const id = uuidv1()
                    this.props.newTable(this.props.db,this.props.defs, null, id, (vals) => {
                      this.props.setDb(this.props.db, [TABLE.TABLES,id],data)
                      this.props.set(PATH.ROUTE,`/tables/${id}`)
                    })
                  })
                }
              }}/>
            </div>
          </div>
        </Popup>
        <Popup open={this.state.popup === POPUP.SETTINGS} modal
          closeOnDocumentClick
          onClose={() => this.setState({popup: ''})}
        >
          <div className='modal'>
            <div className="header">Settings</div>
            <div className='content'>
              There are currently no settings available.
            </div>
          </div>
        </Popup>
        <Popup open={this.state.popup === POPUP.HISTORY} modal
          closeOnDocumentClick
          onClose={() => this.setState({popup: ''})}
        >
          <div className='modal'>
            <div className="header">History</div>
            <div className='content'>
              The list of recent tables:
            </div>
          </div>
        </Popup>
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
            this.setState({popup: POPUP.SETTINGS})
          }}
        >
          <MdSettings />
        </Action>
        <Action
          style={actionButtonStyles}
          text="Recent tables"
          onClick={e => {
            this.setState({popup: POPUP.HISTORY})
          }}
        >
          <MdHistory />
        </Action>
        <Action
          style={actionButtonStyles}
          text="Publish"
          onClick={e => {
            this.setState({popup: POPUP.PUBLISH})
          }}
        >
          <MdPublish />
        </Action>
        <Action
          style={actionButtonStyles}
          text="New table"
          onClick={e => {
            
            this.setState({popup: POPUP.NEW})
          }}
        >
          <MdAdd />
        </Action>
      </Fab>
    </div>
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
