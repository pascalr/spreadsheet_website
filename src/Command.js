import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import { newTable } from "./actions";
import Latex from 'react-latex'
import parse from 'parenthesis'
import Image from './Image'

import MathJax from 'react-mathjax'

const tex = `f(x) = \\int_{-\\infty}^\\infty
    \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}
    \\,d\\xi`

window.exampleTex = () => { 
    return (
        <MathJax.Provider>
            <div>
                This is an inline math formula: <MathJax.Node inline formula={'a = b'} />
                And a block one:
 
                <MathJax.Node formula={tex} />
            </div>
        </MathJax.Provider>
    );
}

window.tex = (formula) => {
    return (
        <MathJax.Provider>
                <MathJax.Node formula={formula} />
        </MathJax.Provider>
    );
}

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

const makeAbsoluteURL = (url) => {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');
  const isAbsolutePath = r.test(url)
  return (isAbsolutePath) ? url : 'http://' + url;
}

const addDotCom = (url) => {
  const r = new RegExp('\\.+', 'i');
  const hasDot = r.test(url)
  return (hasDot) ? url : url + '.com';
}

window.$ = (address) => {
  const {table,def} = window.context
  const row = address.split(/[A-Z]+/)[1]
  const columnName = address.split(/[0-9]+/)[0]
  const colId = _.keys(def.cols).filter(k => (def.cols[k].name === columnName))
  return table[row][colId]
}

// TODO: Afficher les options dans l'autocomplete
window.meteo = (ville,options={lang: 'fr'}) => {
  if (options.lang === 'en') {
    return <iframe title="Environment Canada Weather" width="287px" height="191px"
      src="//weather.gc.ca/wxlink/wxlink.html?cityCode=qc-136&amp;lang=e"
      allowtransparency="true"
      frameborder="0">
    </iframe>
  }
  return <iframe title="Météo Environnement Canada" width="287px" height="191px" src="//meteo.gc.ca/wxlink/wxlink.html?cityCode=qc-136&amp;lang=f" allowtransparency="true" frameborder="0"></iframe>
}

window.test = addDotCom

// Makes a valid url
const validURL = (url) => {
  return addDotCom(makeAbsoluteURL(url))
}

window.img = (src) => {
  return <img src={src} alt={'[img]'}/>
}

window.image = (id) => {
  return id ? <Image id={id}/> : 'Image id required'
}

window.figure = (id) => (window.center(window.image(id)))

window.title = (str) => {
  return <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '2rem'}}>{str}</div> 
}

window.subtitle = (str) => {
  return <div style={{marginLeft: '5%', textDecoration: 'underline', fontSize: '1.5rem'}}>{str}</div> 
}

window.underline = (str) => {
  return <div style={{textDecoration: 'underline'}}>{str}</div> 
}

window.bold = (str) => {
  return <div style={{fontWeight: 'bold'}}>{str}</div> 
}

window.center = (str) => {
  return <div style={{textAlign: 'center'}}>{str}</div> 
}

window.favicon = (site) => {
  const url = validURL(site)
  // Trick: Use the browser to parse the url
  const a = document.createElement('a') 
  a.href = url
  const path = a.origin + '/favicon.ico'
  return <img width='14px' height='14px' src={path} alt={'[ico]'}/>
}

window.bookmark = (site,name) => {
  return (
    <React.Fragment>
      {window.favicon(site)}
      {window.a(site,name)}
    </React.Fragment>
  )
}

window.a = (link,name) => {
  const url = validURL(link)
  return <a href={url}>{name ? name : link}</a>
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
