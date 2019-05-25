import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'
import * as PATH from './constants/paths'

const mapStateToProps = state => {
  const loadingObjs = _.get(state.cache.root, PATH.UI_LOADING)
  return ({
    loading: _.keys(loadingObjs).reduce((acc,curr) => {
      return acc || loadingObjs[curr]
    },false),
  })
}

const mapDispatchToProps = dispatch => ({
})

class StatusBar extends React.Component {
  render = () => {
    // TODO: No internet connection
    // TODO: Not logged in, all changes are local
    // TODO: Saving changes...
    return (
      <React.Fragment>
        <div className='displayFlex' style={{display: `'flex'`}}>
          <Link to='/'>Home</Link>
          { this.props.loading
            ? <span>Loading...</span>
            : <span>Everything is up to date</span>
          }
          <span></span>
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(StatusBar)
