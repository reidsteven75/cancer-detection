import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import axios from 'axios'

import ImageUpload from './image-upload'
import ImageViewer from './image-viewer'
import ImageAnalyze from './image-analyze'
import AnalysisResults from './analysis-results'

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
			analysisResults: null,
			isAnalyzeDisabled: true,
			isAnalyzing: false
		}

		this._handleErrorClose = this._handleErrorClose.bind(this)
		this._handleImageUpload = this._handleImageUpload.bind(this)
		this._handleImageAnalyze = this._handleImageAnalyze.bind(this)
	}

	componentDidMount() {
		this.setState({loading:false})
	}

	_handleErrorClose() {
		this.setState({analysisError: null})
	}

	_handleImageAnalyze() {
		let { image } = this.state
		let bodyFormData = new FormData()
		bodyFormData.append('image', image)

		this.setState({
			isAnalyzing: true,
			analysisResults: null,
			analysisError: null
		}, () => {
			axios({
				method: 'post',
				url: this.props.api + '/image/analyze',
				data: bodyFormData,
				headers: {'Content-Type': 'multipart/form-data' }
				})
				.then((res) => {
					if (res.data.error === true) {
						this.setState({
							analysisResults: null,
							analysisError: res.data
						})
					}
					else {
						this.setState({
							analysisResults: res.data,
							analysisError: null
						})
					}
				})
				.catch((res) => {
					this.setState({
						analysisResults: null,
						analysisError: {
							error: true,
							message: 'web app request error'
						}
					})
				})
				.finally(() => {
					this.setState({isAnalyzing: false})
				})
		})
		
	}

	_handleImageUpload(image) {

		const reader = new FileReader()
		this.setState({
			image: null,
			analysisResults: null
		}, () => {
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
		})
	}

  render() {
		
		const content = 
				<div style={style.maxHeight}>
					<ImageUpload
						disabled={this.state.isAnalyzing}
						handleImageUpload={this._handleImageUpload}
					/>
					<br/>
					<ImageViewer
						image={this.state.image}
						isAnalyzing={this.state.isAnalyzing}
					/>
					<br/>
					<ImageAnalyze
						text={this.state.isAnalyzing ? 'Analyzing...' : 'Analyze'}
						disabled={this.state.isAnalyzeDisabled || this.state.isAnalyzing}
						handleImageAnalyze={this._handleImageAnalyze}
					/>
					<br/>
					<AnalysisResults
						handleErrorClose={this._handleErrorClose}
						showError={this.state.analysisError ? true : false}
						error={this.state.analysisError}
						results={this.state.analysisResults}
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
