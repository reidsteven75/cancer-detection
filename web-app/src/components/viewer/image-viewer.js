import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { Zoom } from '@material-ui/core'

const style = {
  content: {
    width: '100%',
    
  },
  imageContainer: {
    border: '1px solid lightgray',
    height: '300px'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageDarken: {
    opacity: 0.2,
    width: '100%',
    height: '100%'
  },
  analyzer: {
    position: 'relative',
    top: '-180px'
  }
}

class ImageViewer extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
		}
	}

	componentDidMount() {
		this.setState({loading:false})
  }
  
  componentDidUpdate() {

	}

  render() {
    const { image, isAnalyzing } = this.props

    const content = 
      <div style={style.imageContainer}>
        
        {
          image ? 
            <Zoom in={true}>
              <img 
                style={isAnalyzing ? style.imageDarken : style.image}
                src={image.url} 
                alt=''
              />
            </Zoom>
            :
            <React.Fragment/>
        }

        { isAnalyzing ?
            <CircularProgress 
              color='secondary' 
              style={style.analyzer}
            />
            :
            <React.Fragment/> 
        }
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
)(ImageViewer))
