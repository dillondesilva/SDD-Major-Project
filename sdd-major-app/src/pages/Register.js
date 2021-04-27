// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AppBar, TextField, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// theme stores all the data regarding the styling
// of several UI elements
const theme = createMuiTheme({
  overrides: {
     // Overriding the default AppBar and TextField component style
    MuiAppBar: {
      // Setting its background color to be orange based
      colorPrimary: {
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
    },
  },
});

// React class component for the register page
export default class Register extends React.Component {
  constructor(props) {
    super(props);

    // State variable for this component to store the 
    // value of registration fields
    this.state = {
      emailValue: "",
      usernameValue: "",
      pwdValue: "",
      pwdConfirmValue: "",
      accountType: ""
    };
  }

  // Calls create_user API Endpoint to add a new user to the database
  registerUser() {
    fetch('/api/userbase/create_user', {
      method: 'post',
      headers: {
        'Content-Type':  'application/json',
      }, 
      // Sends the registration details in state to endpoint
      body: JSON.stringify(this.state)
    })
    // Get the response json
    .then(response => response.json())
    .then(data => {
      if (data["error"]){
        Swal.fire({
          title: 'Oops!',
          text: data["error"],
          icon: 'error',
          cancelButtonText: 'Retry'
        })
      } else {
        // Displays account was created and redirects users to login page
        alert("Account created! Proceeding to sign in page :)")
        window.location = "/login"  
      }
    })
  }

  // Renders UI elements for the registration screen
  render() {
    return (
      <div>
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
                  <TextField value={this.state.emailValue} label="Email" color="primary" variant="outlined" 
                  onChange={(e) => this.setState({emailValue: e.target.value})}/>
                  <br></br>
                  <TextField label="Username" color="primary" variant="outlined" 
                  onChange={(e) => this.setState({usernameValue: e.target.value})}/>
                  <br></br>
                  <TextField label="Password" color="primary" variant="outlined"
                  onChange={(e) => this.setState({pwdValue: e.target.value})}/>
                  <br></br>
                  <TextField label="Confirm Password" color="primary" variant="outlined"
                  onChange={(e) => this.setState({pwdConfirmValue: e.target.value})}/>
                  <br></br>
                  <br></br>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">I am a</FormLabel>
                    <RadioGroup aria-label="gender" name="gender1" style={{display: "inline"}} value={this.state.accountType}
                    onChange={(e) => this.setState({accountType: e.target.value})}>
                      <FormControlLabel value="student" control={<Radio />} label="Student" />
                      <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                    </RadioGroup>
                  </FormControl>
                  <br></br>
                  <Button onClick={() => this.registerUser()}>Go</Button>
              </ThemeProvider>  
          </div>
        </div>
      </div>
    ); 
  }
}