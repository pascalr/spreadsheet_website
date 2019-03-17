import React from "react"
import { connect } from "react-redux";

import * as TABLES from '../constants/tables'

import GridLayout from 'react-grid-layout';

import {Link} from 'react-router-dom';


// A GridItem is selectable with a click
// When a GridItem is selected and another click happens, the
// actions will depend on the type of the component.
//
// For a Table:
// The table will be opened in another page
// For a text:
// The text will be editable
class GridItem extends React.Component {
  render() {
    return (
      <div>
        <Link to={`/tables/${this.props.name}`}>{this.props.name}</Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { editMode: state.editMode };
};

class DesktopGridLayout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {editMode: false}
  }

  componentDidMount = () => {
    this.props.db.load(TABLES.LAYOUT,
      (layout) => (this.setState({layout: layout})))
  }

  gridLayout = () => (
    (Object.keys(this.props.tables) || []).map(t => (
      {...(this.state.layout[t] || {x: 0, y:0, w: 2, h: 2, i: t}),
        static: !this.props.editMode}
    ))
  )

  onLayoutChange = (layout) => {
    let layoutByName = layout.reduce((acc,currVal) => {
      const {x,y,w,h,i} = currVal;
      acc[currVal.i] = {x,y,w,h,i};
      return acc;
    }, {})
    this.props.db.set(TABLES.LAYOUT, layoutByName);
    // FIXME: This renders twice for nothing I think
    this.setState({layout: layoutByName})
  }

  render() {
    if (this.state.layout) {
      return(
        <GridLayout className="layout"
                    compactType={null}
                    cols={100}
                    autoSize={true}
                    layout={this.gridLayout()}
                    onLayoutChange={this.onLayoutChange}
                    preventCollision={true}
                    style={{height: '2810px'}}
                    margin={[0,0]}
                    rowHeight={20}
                    width={100*20}>
          {Object.keys(this.props.tables || {}).map(t => (
            /* isResizable="false" dependemment du type */
            <div key={t} className="gridTable" style={{
              width: (this.state.layout[t] ? this.state.layout[t].w : 2)*20,
              height: (this.state.layout[t] ? this.state.layout[t].h : 2)*20,}}
            >
              <GridItem name={t}/>
            </div>
          ))}
        </GridLayout>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(DesktopGridLayout);
