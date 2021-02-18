import React, { useEffect } from 'react';
import { AppBar, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export default function Home() {
  const theme = createMuiTheme({
    overrides: {
      MuiAppBar: {
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


  function testConnectionToLocalServer() {
    fetch("https://localhost:5000/test")
    .then((response) => {
        let data = response.json();
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    });
  }

  useEffect(() => {
    testConnectionToLocalServer();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <AppBar color='primary' theme={theme}>
            <div style={{display: "inline-block"}}>
              <h3 style={{marginRight: "100px", display: "inline-block"}}>Sign In</h3> 
              <h3 style={{marginRight: "100px", display: "inline-block"}}>Register</h3>  
            </div>
          </AppBar>
        </ThemeProvider>
      </header>
    </div>
  );
}