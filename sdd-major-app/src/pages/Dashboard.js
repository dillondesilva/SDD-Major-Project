import React from 'react'
import { Tooltip, IconButton, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

export default class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <Tooltip title="Add Teacher">
                <IconButton aria-label="delete" style={{backgroundColor: "#ff9988", float: "right"}}>
                    <AddIcon />
                </IconButton> 
                </Tooltip>
                <h1 style={{textAlign: "center"}}>Hello, Dillon</h1>
                <TextField label="Search Wordlist" variant="outlined"></TextField>
            </div>
        )
    }
}