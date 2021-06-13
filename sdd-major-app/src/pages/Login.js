// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AppBar, TextField, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import HomeAppBar from '../components/HomeAppBar';
import '../css/Login.css';

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
      if (Object.keys(data).includes("error")) {
        Swal.fire({
          title: 'Oops!',
          text: data["error"],
          icon: 'error',
          cancelButtonText: 'Retry'
        })
      } else {
        sessionStorage.setItem("access_token", data.access_token)
        sessionStorage.setItem("uid", data.uid)
        // Send user to the dashboard
        window.location = "/dashboard";
      }
    })
  }

  // Renders UI elements for the login screen
  render() {
    return (
      <div className="App">
        <HomeAppBar></HomeAppBar> 
        <div className="loginView">
          <h2 className="loginTitle">Login</h2>
          <div>
              <input className="accountDetailInput" placeholder="Email" onChange={(e) => this.setState({emailValue: e.target.value})}></input>
          </div>
          <div>
              <input type="password" className="accountDetailInput" placeholder="Password" onChange={(e) => this.setState({pwdValue: e.target.value})}></input>
          </div>
          <div className="goButton">
              <button onClick={() => this.loginUser()}>Go!</button>
          </div>
        </div>
      </div>
    ); 
  }
}