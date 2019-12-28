import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import compose from 'recompose/compose'
import withWidth from '@material-ui/core/withWidth'

const style = {

}

class Header extends Component {

	constructor(props) {
		super(props)
		this.state = {

		}
	}
	

  render() {
		return (
			<div>
				<AppBar 
					position='static'
					color='secondary'
				>
					<Toolbar>
						<Typography 
							variant='h6' 
							color='textPrimary' 
						>
							Cancer Detection
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
		)
	} 
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
  withStyles(style),
  withWidth(),
)(Header))
