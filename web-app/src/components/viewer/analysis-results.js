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
import Slide from '@material-ui/core/Slide'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const style = {
  content: {
		width: '100%'
  },
  title: {
    fontSize: 16
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
              <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Card>
                  <CardContent>
                    <Typography 
                      style={style.title}
                      color='textPrimary' 
                      // gutterBottom
                    >
                      Results
                    </Typography>
                    <br/>
                    <Chip 
                      variant='outlined'
                      label={results.tumor ? 'Tumor Detected' : 'Healthy'}
                      icon={results.tumor ? <ErrorOutline /> : <CheckCircleOutlineIcon />} 
                      color={results.tumor ? 'primary' : 'secondary' } 
                    />
                    <br/>
                    <br/>
                    <Typography 
                      variant='body2' 
                      component='p'
                    >
                      {(results.confidence).toFixed(2) * 100}% confidence
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
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
