import React, { useEffect } from 'react'
import { Tooltip, IconButton, TextField, Dialog, DialogTitle, Zoom } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import Carousel from 'react-material-ui-carousel'


export default class WordlistCreator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDetails: {
                username: "",
                email: ""
            },
            openCreateWordlist: false
        }
    }

    // Adding user details pre render
    componentWillMount() {
        let uid = sessionStorage.getItem("uid");
        fetch('http://sddmajordev:5000/api/userbase/get_user_by_uid', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify({"uid": uid})
          })
          .then(response => response.json())
          .then(data => {
              this.setState({userDetails: data})
        })
    }

    render() {
        var items = [
            {
                name: "Random Name #1",
                description: "Probably the most random thing you have ever seen!"
            },
            {
                name: "Random Name #2",
                description: "Hello World!"
            }
        ]

        if (this.state.accountType === "student") {
            // Return Student Dashboard
        } else {
            // Return Teacher Dashboard
            return (
                <div>
                    <Tooltip title="Add Student" TransitionComponent={Zoom} arrow>
                        <IconButton aria-label="delete" style={{backgroundColor: "#FF7979", float: "right"}}>
                            <AddIcon style={{color: "white"}}/>
                        </IconButton> 
                    </Tooltip>
                    <IconButton aria-label="delete" style={{backgroundColor: "#FF7979", float: "right"}}> onClick={() => { this.setState({openCreateWordlist: true})}} >
                        <CreateIcon style={{color: "white"}}/>
                    </IconButton> 
                    <h1 style={{textAlign: "center"}}>Hello, {this.state.userDetails.username}</h1>
                    <TextField label="Search Wordlist" variant="outlined"></TextField>
                    <Dialog open={this.state.openCreateWordlist}>
                        <DialogTitle>Hey</DialogTitle>
                    </Dialog>
                </div>
            )
        }
    }
}