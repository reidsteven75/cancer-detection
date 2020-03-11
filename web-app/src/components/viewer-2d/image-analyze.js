import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Button from '@material-ui/core/Button'

const style = {
  content: {

  },
  button: {
    height: 60,
    width: '100%'
  }
}

class ImageUpload extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
    }
    
    this.handleClicked = this.handleClicked.bind(this)
	}

	componentDidMount() {
		this.setState({loading:false})
  }
  
  handleClicked() {
    this.props.handleImageAnalyze()
  }

  render() {
    const { disabled, text } = this.props
    const content = 
      <Button 
        style={style.button}
        variant='contained' 
        color='secondary'
        disabled={disabled}
        onClick={this.handleClicked}
      >
        {text}
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
