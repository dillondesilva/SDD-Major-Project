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

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      emailValue: "",
      usernameValue: "",
      pwdValue: "",
      pwdConfirmValue: "",
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
      console.log('Success:', data);
    })
    .catch((err) => {
        console.log(err);
    });
  }

  // useEffect(() => {
  //   testConnectionToLocalServer();
  // }, []);
  registerUser() {
    fetch('http://sddmajordev:5000/api/userbase/create_user', {
      method: 'post',
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
      <div>
        <div className="App">
          <header className="App-header">
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
                <Button onClick={() => this.registerUser()}>Go</Button>
            </ThemeProvider>
          </header>
        </div>
      </div>
    ); 
  }
}