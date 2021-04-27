// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, TextField, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// theme stores all the data regarding the styling
// of several UI elements
const theme = createMuiTheme({
  overrides: {
    // Overriding the default AppBar and TextField component style
    MuiAppBar: {
      colorPrimary: {
        // Setting its background color to be orange based
        backgroundColor: '#FFA474',
      },
    },
    MuiTextField: {
      // Setting its background color to be orange based
      colorPrimary: {
        backgroundColor: '#FFA474',
      },
    },
  },
  // Main color for elements in the orange shade
  palette: {
    primary: {
      main: "#ffa474",
    }
  },
});

// React class component for login
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    // State variable for this component to store the 
    // value of email and password fields
    this.state = {
      emailValue: "",
      pwdValue: ""
    };
  }

  // Calls verify_user API endpoint to authenticate
  // a user to the dashboard
  loginUser() {
    fetch('/api/userbase/verify_user', {
      method: 'post',
      headers: {
        'Content-Type':  'application/json',
      }, 
      // Sending the current state with the current email/password
      // value to Auth API
      body: JSON.stringify(this.state)
    })
    // Get the response json and then set the access token
    // as well as uid in session storage
    .then(response => response.json())
    .then(data => {
      sessionStorage.setItem("access_token", data.access_token)
      sessionStorage.setItem("uid", data.uid)
      // Send user to the dashboard
      window.location = "/dashboard";
    })
  }

  // Renders UI elements for the login screen
  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
            <AppBar color='primary' theme={theme}>
              <div style={{display: "inline-block"}}>
                <h3 style={{marginRight: "100px", display: "inline-block", textDecoration: "none"}}>
                  <Link to="/login" style={{textDecoration: "none"}}>Sign In</Link>
                </h3> 
                <h3 style={{marginRight: "100px", display: "inline-block"}}>
                  <Link to="/register">Register</Link>
                </h3> 
              </div>
            </AppBar>
        </ThemeProvider>
        <div style={{marginTop: "10%"}}>
          <ThemeProvider theme={theme}>
              <TextField label="Email" color="primary" variant="outlined" onChange={(e) => this.setState({emailValue: e.target.value})}/>
              <br></br>
              <TextField label="Password" color="primary" variant="outlined" onChange={(e) => this.setState({pwdValue: e.target.value})}/>
              <Button onClick={() => this.loginUser()}>Go</Button>
          </ThemeProvider>
        </div>
      </div>
    ); 
  }
}