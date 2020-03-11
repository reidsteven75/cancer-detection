import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
// import * from 'xtk'

// xtk: http://api.goxtk.com/

const style = {
  content: {
		padding: 20,
		width: '100%',
	},
	maxHeight: {
		height: '100vh'
	}
}

class Viewer3D extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true
		}
		this.renderer = React.createRef()
	}

	componentDidMount() {
		this.setState({loading:false})

		const X = window.X
		let r = new X.renderer3D()
		r.container = this.renderer.current
		r.init()
		const scan = new X.mesh()
		scan.file = '/data/pressure.vtk'
		r.add(scan)
		r.render()
		console.log(r)
	}


  render() {
		
		const content = 
				<div style={style.maxHeight} ref={this.renderer}>
					3D Viewer
				</div>

    return (
			<div style={style.content}>
				{ content }
			</div>
    )
  }
}

export default withRouter(compose(
  withStyles(style),
  withWidth(),
)(Viewer3D))
