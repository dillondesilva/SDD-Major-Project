import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, TextField, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import HomeAppBar from '../components/HomeAppBar'

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#FFA474',
      },
    },
    MuiTextField: {
      colorPrimary: {
        backgroundColor: '#FFA474',
      },
    },
  },
  palette: {
    primary: {
      main: "#ffa474",
    },
    secondary: {
      main: green[500],
    },
  },
});

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      emailValue: "",
      usernameValue: "",
      pwdValue: "",
      pwdConfirmValue: "",
      accountType: ""
    };

    // Refs
    this.email = React.createRef();
    this.pwd = React.createRef();
    this.pwdConfirm = React.createRef();
  }

  testConnectionToLocalServer() {
    return fetch("https://sddmajordev:5000/test")
    .then(response => response.json())
    .then(data => {

      alert("Registration successful. Please proceed to login page");
    })
    .catch((err) => {
        console.log(err);
    });
  }

  registerUser() {
    fetch('/api/userbase/create_user', {
      method: 'post',
      headers: {
        'Content-Type':  'application/json',
      }, 
      body: JSON.stringify(this.state)
    })
    .then(response => response.json())
    .then(data => {
      alert("Account created! Proceeding to sign in page :)")
      window.location = "/login"
    })
  }

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