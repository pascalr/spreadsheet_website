import { connect } from "react-redux"
import _ from 'lodash'
import React from 'react'
import Files from 'react-files'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = dispatch => ({
})

class Image extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
    }
  }
  componentDidMount = () => {
    const path = _.castArray('images/'+this.props.id).join('/');
    const infoPath = 'storage/'+path;
    const thisComponent = this
    this.props.db.get(infoPath, function(snapshot) {
      thisComponent.setState({downloadUrl: snapshot})
    })
  }

  onFilesChange = (files) => {
    this.setState({
      files
    }, () => {
      console.log(this.state.files)
    })
    this.props.db.stash('images/'+this.props.id,files[0])
  }

  onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  render () {
    if (this.state.downloadUrl) {
      return (
        <img src={this.state.downloadUrl} alt='[image]'/>
      )
    }
    return (
      <div>
        <Files
          ref='files'
          className='files-dropzone-gallery'
          onChange={this.onFilesChange}
          onError={this.onFilesError}
          accepts={['image/*']}
          maxFiles={1}
          maxFileSize={10000000}
          minFileSize={0}
          clickable
        >
          {
            this.state.files.length > 0
            ? <div className='files-gallery'>
              {this.state.files.map((file) =>
                <img className='files-gallery-item' src={file.preview.url} key={file.id} />
              )}
            </div>
            : <div>Drop images here</div>
          }
        </Files>
      </div>
    )
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Image)
