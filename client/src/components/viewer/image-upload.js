import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Dropzone from 'react-dropzone'
import Button from '@material-ui/core/Button'
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined'

const style = {
  content: {

  },
  button: {
    width: '100%'
  },
  dropZone: {
    width: '100%',
    border: 'none'
  },
  uploadIcon: {
    fontSize: 40
  }
}

class ImageUpload extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
    }
    
    this.handleUpload = this.handleUpload.bind(this)
	}

	componentDidMount() {
		this.setState({loading:false})
  }
  
  handleUpload(image) {
    this.props.handleImageUpload(image[0])
  }

  render() {
		
    const content = 
    <Button 
      style={style.button}
      variant='contained' 
      color='primary'
    >
      <Dropzone 
        onDrop={image => this.handleUpload(image)}
      >
        {({getRootProps, getInputProps}) => (
          <section
            style={style.dropZone}
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <BackupOutlinedIcon 
                style={style.uploadIcon}
              />
            </div>
          </section>
        )}
      </Dropzone>
    </Button>

    return (
			<div style={style.content}>
				{ this.state.loading ? <CircularProgress/> : content }
			</div>
    )
  }
}

export default withRouter(compose(
  withStyles(style),
  withWidth(),
)(ImageUpload))
