import { connect } from "react-redux"
import _ from 'lodash'
import React from 'react'
import Files from 'react-files'

class Image extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }

  onFilesChange = (files) => {
    this.setState({
      files
    }, () => {
      console.log(this.state.files)
    })
  }

  onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  render () {
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

export default Image
