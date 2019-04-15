import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import { newTable } from "./actions";
import Latex from 'react-latex'
import parse from 'parenthesis'

const tableLinkProps = (state) => ({
  db: state.db,
  defs: state.defs,
})
const tableLinkDispatch = (dispatch) => ({
  newTable: (db, defs, name) => () => dispatch(newTable(db,defs,name)),
})

const TableLink = connect(tableLinkProps,tableLinkDispatch)((props) => {
  if (props.defs == null) { return null }
  const defId = _.keys(props.defs).find(e => props.defs[e].name === props.name)
  if (defId) {
    return <Link to={'tables/'+defId}>{props.defs[defId].name}</Link>
  } else {
    if (props.name) {
      newTable(props.db,props.defs,props.name)
      return 'creating table...'
    } else {
      return 'invalid table name'
    }
  }
})

const cmd_fontSize = (args) => {
  return <span style={{fontSize: args[0]}}>{args[1]}</span>
}

const cmd_table = (args) => {
  return <TableLink name={args[0]}/>
}
const cmd_a = (args) => {
  return <a href={args[0]}>{args.length > 1 ? args[1] : args[0]}</a>
}

const COMMANDS = {
  fontSize: cmd_fontSize,
  table: cmd_table,
  a: cmd_a,
}

window.a = (link) => {
  return <a href={link}>{link}</a>
}

  /*window.a = (link) => {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');
  const isAbsolutePath = r.test(link)
  if (isAbsolutePath) {
    window.location = link;
  } else {
    window.location = 'http://' + link;
  }
}*/

// TODO: Pipes
// eg: Hello | fontSize(40px)
//
// ca serait le genre de chose que ca serait nice faire des tests...
// "1 + 1" => "2"
// "tablea1!A1 + 10" => "12"
// fontSize(10)(Hello!)
// 'Hello!' | fontSize(10)
// fontSize(10,Hello!)
// fontSize(10)(color(red))(Hello)
// Hello | fontSize(10) | color(red)
class Command extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  parseArgs = (cmd) => {
    const str = (cmd[1].length === 1) ? cmd[1][0]
      : cmd[1][0]+this.parseArg(cmd[1][1])+cmd[1][2];
    return str.split(',')
  }

  parseArg = (cmdStr) => {
    const cmd = parse(cmdStr) // Parse parentheses
    //const sub = cmd.slice(1)
    //const vals = sub.split(',')
    const first = cmd[0]
    const lastChar = first.slice(-1)
    if (lastChar === '(') {
      const cmdName = first.slice(0,-1)
      if (COMMANDS.hasOwnProperty(cmdName)) {
        const args = this.parseArgs(cmd)
        return COMMANDS[cmdName](args)
      }
    } else if (lastChar === '{') {
      return 'TODO'
    }
    //const cmdName = vals[0]
    return <span className='error'>unkown command</span>
  }

  parseCmd = () => {
    const cmd = '' + this.props.cmd
    if (!cmd) { return <span className='error'>empty cmd</span>}

    if (cmd.charAt(0) === '=') {
      return this.parseArg(cmd.slice(1))
    } else {
      return <span>{cmd}</span>
    }
  }

  render = () => this.parseCmd()
}

export default Command
