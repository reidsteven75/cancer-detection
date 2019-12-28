import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

import ImageUpload from './image-upload'
import ImageViewer from './image-viewer'
import ImageAnalyze from './image-analyze'

const style = {
  content: {
		padding: 20,
		width: '100%',
	},
	maxHeight: {
		height: '100vh'
	}
}

class Viewer extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
			image: null,
			isAnalyzeDisabled: true
		}

		this._handleImageUpload = this._handleImageUpload.bind(this)
		this._handleImageAnalyze = this._handleImageAnalyze.bind(this)
	}

	componentDidMount() {
		this.setState({loading:false})
	}

	_handleImageAnalyze() {
		const reader = new FileReader()
		let { image } = this.state
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			image.arrayBuffer = reader.result
			this.setState({image: image})
			console.log(image)
		}
		reader.readAsArrayBuffer(image)
	}

	_handleImageUpload(image) {

		const reader = new FileReader()
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			image.url = reader.result
			this.setState({
				image: image,
				isAnalyzeDisabled: false
			})
		}
		reader.readAsDataURL(image)
	}

  render() {
		
		const content = 
				<div style={style.maxHeight}>
					<ImageUpload
						handleImageUpload={this._handleImageUpload}
					/>
					<br/>
					<ImageViewer
						image={this.state.image}
					/>
					<br/>
					<ImageAnalyze
						disabled={this.state.isAnalyzeDisabled}
						handleImageAnalyze={this._handleImageAnalyze}
					/>
				</div>

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
)(Viewer))
