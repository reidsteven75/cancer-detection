import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

const style = {
  content: {
		padding: 20,
		width: '100%',
	},
	maxHeight: {
		height: '100vh'
	}
}

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
		}
	}

  render() {
		
    let content
    if (this.state.loading === true) {
			content = <CircularProgress/>
		}
    else {
      content = 
				<div
					style={style.maxHeight}
				>
					Content
				</div>
    }
    return (
			<div style={style.content}>
				{content}
			</div>
    )
  }
}

export default withRouter(compose(
  withStyles(style),
  withWidth(),
)(Dashboard))
