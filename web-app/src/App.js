import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import teal from '@material-ui/core/colors/teal'

import Header from './components/header'
import Viewer2D from './components/viewer-2d'
import Viewer3D from './components/viewer-3d'
import NotFound from './components/not-found'

const HTTPS = (process.env.HTTPS === 'true')
const PROD = (process.env.NODE_ENV === 'production')
const API = (HTTPS ? 'https://' : 'http://') + process.env.HOST + (PROD ? '' : ':' + process.env.API_PORT) + '/api'

const features = {

}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      light: teal['A200'],
      main: teal['A400'],
      dark: teal['A700'],
    }
  },
  typography: {
    useNextVariants: true,
  },
})

const viewer2D = () => {
  return (
    <Viewer2D
      api={API}
      features={features}
    />
  )
}

const viewer3D = () => {
  return (
    <Viewer3D
      api={API}
      features={features}
    />
  )
}

const notFound = () => {
  return (
    <NotFound/>
  )
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Router>
            <Header/>
            <main className='App-main'>
              
              <Switch>
                <Route path='/' exact component={viewer3D} />
                <Route path='/viewer/2d' component={viewer2D} />  
                <Route path='/viewer/3d' component={viewer3D} /> 
                <Route component={notFound} />   
              </Switch>

            </main>
          </Router>
        </div> 
      </MuiThemeProvider>
    )
  }
}

export default (App)
