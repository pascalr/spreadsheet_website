import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import { newTable } from "./actions"
import Image from './Image'
import ABCJS from 'abcjs/midi'

import MathJax from 'react-mathjax'

import 'abcjs/abcjs-midi.css'

const tex = `f(x) = \\int_{-\\infty}^\\infty
    \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}
    \\,d\\xi`


class PrintABC extends React.Component {
  componentDidMount = () => {
    var ex = "T: Cooley's\n" +
    "M: 4/4\n" +
    "L: 1/8\n" +
    "R: reel\n" +
    "K: Emin\n" +
    "|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\n" +
    "EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\n" +
    "|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\n" +
    "eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|";
    const content = this.props.content || ex
    ABCJS.renderAbc(this.div, content);
    ABCJS.renderMidi(this.divMidi, content);
  }
  render() {
    return (
      <React.Fragment>
        <div ref={el => this.div=el}/>
        <div ref={el => this.divMidi=el}id="midi"></div>
      </React.Fragment>
    )
  }
}

window.abc = (content)  => {
  return <PrintABC content={content}/>
}

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
    return <Link to={'/tables/'+defId}>{props.defs[defId].name}</Link>
  } else {
    if (props.name) {
      newTable(props.db,props.defs,props.name)
      return 'creating table...'
    } else {
      return 'invalid table name'
    }
  }
})

window.table = (name) => {
  return <TableLink name={name}/>
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
      src="https://weather.gc.ca/wxlink/wxlink.html?cityCode=qc-136&amp;lang=e"
      allowtransparency="true"
      frameBorder="0">
    </iframe>
  }
  return <iframe title="Météo Environnement Canada" width="287px" height="191px" src="https://meteo.gc.ca/wxlink/wxlink.html?cityCode=qc-136&amp;lang=f" allowtransparency="true" frameBorder="0"></iframe>
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

const COMMANDS = {
  img: {desc: 'Renders an image with the html <img> tag.', args: [{name: 'src', type: 'string', desc: 'the url of the image'}]},
  tex: {desc: 'Renders a TeX equation using MathJax', args: [{name: 'formula', type: 'string', desc: 'the TeX formula'}]},
  image: {desc: 'Renders a field to upload or drop an image', args: [{name: 'id', type: 'string', desc: 'the id to reference the image'}]},
  figure: {desc: 'Renders a centered image', args: [{name: 'id', type: 'string', desc: 'the id to reference the figure'}]},
  $: {desc: 'Gets the value at the given spreadsheet reference', args: [{name: 'address', type: 'string', desc: 'the spreadsheet reference'}]},
  meteo: {desc: 'Affiche la meteo d\'environment canada', args: [{name: 'ville', type: 'string', desc: 'la ville'},{name: 'options', type: 'Object', desc: 'lang: fr ou en'}]},
  title: {desc: '', args: [{name: '', type: '', desc: ''}]},
  subtitle: {desc: '', args: [{name: '', type: '', desc: ''}]},
  center: {desc: '', args: [{name: '', type: '', desc: ''}]},
  bold: {desc: '', args: [{name: '', type: '', desc: ''}]},
  underline: {desc: '', args: [{name: '', type: '', desc: ''}]},
  favicon: {desc: '', args: [{name: '', type: '', desc: ''}]},
  bookmark: {desc: '', args: [{name: '', type: '', desc: ''}]},
  a: {desc: '', args: [{name: '', type: '', desc: ''}]},
}
export { COMMANDS }
