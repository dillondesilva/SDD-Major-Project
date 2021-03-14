import React from 'react'

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

export default class DashboardAppBar extends React.Component {
  render() {
      <div>
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
      </div>
  }
}