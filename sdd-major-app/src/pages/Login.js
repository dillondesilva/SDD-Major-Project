import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
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

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      emailValue: "",
      pwdValue: ""
    };

    // Refs
    this.email = React.createRef();
    this.pwd = React.createRef();
  }

  loginUser() {
    fetch('http://sddmajordev:5000/api/userbase/login_user', {
      method: 'get',
      headers: {
        'Content-Type':  'application/json',
      }, 
      body: JSON.stringify(this.state)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ThemeProvider theme={theme}>
              <TextField label="Email" color="primary" variant="outlined" onChange={(e) => this.setState({emailValue: e.target.value})}/>
              <br></br>
              <TextField label="Password" color="primary" variant="outlined" onChange={(e) => this.setState({pwdValue: e.target.value})}/>
              <Button onClick={() => this.loginUser()}>Go</Button>
          </ThemeProvider>
        </header>
      </div>
    ); 
  }
}