import React from "react"
import { connect } from "react-redux";

import * as TABLES from '../constants/tables'

import { MenuProvider } from 'react-contexify'

import GridLayout from 'react-grid-layout';

import Link from '../Link';

import ByPass from '../lib/ByPass';

import IconMenu from './IconMenu';

import ScaleText from "react-scale-text";

// A GridItem is selectable with a click
// When a GridItem is selected and another click happens, the
// actions will depend on the type of the component.
//
// For a Table:
// The table will be opened in another page
// For a text:
// The text will be editable
class IconGridItem extends React.Component {
  render() {
    const {id, width, height, def} = this.props;
    return (
      <MenuProvider id="iconMenu" className="menu" data={{id}}>
        <div className="icon" style={{width, height}}>
          <ScaleText>
            <ByPass if={this.props.editMode}>
              <Link to={`/tables/${id}`}>
                <div className="scale">
                  <div className="iconName" style={{fontSize: 18, textAlign: 'center'}}>
                    {def.name}
                  </div>
                  <div className="iconImage" style={{textAlign: 'center'}}>
                    {def.icon || "📁"}
                  </div>
                </div>
              </Link>
            </ByPass>
          </ScaleText>
        </div>
      </MenuProvider>
    );
  }
}

const mapStateToProps = state => ({
  editMode: state.ui.editMode,
  db: state.db,
  defs: state.defs,
});

class DesktopGridLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    this.props.db.load(TABLES.LAYOUT,
      (layout) => (this.setState({layout: layout})))
  }

  gridLayout = () => (
    (Object.keys(this.props.tables) || []).map(t => (
      {...(this.state.layout[t] || {x: 0, y:0, w: 3, h: 4, i: t}),
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
        <div className="gridLayout">
          <IconMenu db={this.props.db}/>
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
              <div key={t} className="gridTable">
                <IconGridItem id={t} editMode={this.props.editMode}
                  width={(this.state.layout[t] ? this.state.layout[t].w : 2)*20}
                  height={(this.state.layout[t] ? this.state.layout[t].h : 2)*20}
                  def={this.props.defs[t]}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      );
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(DesktopGridLayout);
