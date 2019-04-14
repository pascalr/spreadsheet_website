import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Link from './Link'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

class StatusBar extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    // TODO: No internet connection
    // TODO: Not logged in, all changes are local
    // TODO: Loading...
    // TODO: Saving changes...
    return (
      <React.Fragment>
        <div className='displayFlex' style={{display: `'flex'`}}>
          <Link to='/'>Home</Link>
          <span>Everything is up to date</span>
          <span></span>
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(StatusBar)
