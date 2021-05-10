// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Paper, TextField, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// React class component for mode selection page
export default class ModeSelection extends React.Component {
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <h1>Mode Selection</h1>
                <div style={{paddingTop: "10px"}}>
                    <Button variant="outlined" onClick={() => {window.location = `/quiz/${this.props.match.params.id}`}}>Quiz Me</Button>
                </div>
                <p>More modes coming soon</p>
            </div>
        )
    }
}