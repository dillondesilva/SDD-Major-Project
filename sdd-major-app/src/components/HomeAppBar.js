import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export default function HomeAppBar() {
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

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}