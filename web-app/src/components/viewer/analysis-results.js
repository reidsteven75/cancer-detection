import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import Chip from '@material-ui/core/Chip'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const style = {
  content: {
		padding: 20,
		width: '100%',
	}
}

class Viewer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
    
    this._handleClose = this._handleClose.bind(this)

	}

	componentDidMount() {
		this.setState({loading:false})
  }
  
  _handleClose() {
    this.props.handleErrorClose()
  }

  render() {

    const { results, showError, error } = this.props
		
    const content = 
        <div>
          { 
            results ? 
              <Chip 
                variant='outlined'
                label={results.tumor ? 'Tumor Detected' : 'Healthy'}
                icon={results.tumor ? <ErrorOutline /> : <CheckCircleOutlineIcon />} 
                color={results.tumor ? 'primary' : 'secondary' } 
              />
              :
              <React.Fragment/>
					}
          <Dialog
            open={showError}
            onClose={this._handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              Analysis Error
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                { error ? error.message : 'Unknown' }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this._handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
