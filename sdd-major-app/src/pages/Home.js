import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import HomeAppBar from '../components/HomeAppBar'
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
    return fetch("https://sddmajordev:5000/test")
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
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
        <HomeAppBar/>
      </header>
    </div>
  );
}