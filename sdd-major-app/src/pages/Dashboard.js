import React, { useEffect } from 'react'
import { Input, Tooltip, Button, IconButton, TextField, Dialog, Zoom, DialogTitle, Paper } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import shortid from 'shortid'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDetails: {
                username: "",
                email: ""
            },
            openCreateWordlist: false,
            wordlistName: "",
            wordlistDescription: ""
        }

        this.createWordlist = this.createWordlist.bind(this);
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

    // Create Wordlist
    createWordlist() {
        console.log(this.state)
        let uid = sessionStorage.getItem("uid");
        let wordlistCode = shortid.generate()
        let wordlistData = {
            wordlistName: this.state.wordlistName,
            wordlistDescription: this.state.wordlistDescription,
            wordlistCode: wordlistCode,
            uid: uid
        }

        fetch('http://sddmajordev:5000/api/wordlist/create_wordlist', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify(wordlistData)
          })
          .then(response => response.json())
          .then(data => {
              window.location = "/login"
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
                    <Tooltip title="Create New Wordlist" TransitionComponent={Zoom} arrow>
                        <IconButton aria-label="delete" style={{backgroundColor: "#FF7979", float: "right"}} onClick={() => this.setState({openCreateWordlist: true})}>
                            <CreateIcon style={{color: "white"}}/>
                        </IconButton> 
                    </Tooltip>
                    <h1 style={{textAlign: "center"}}>Hello, {this.state.userDetails.username}</h1>
                    <TextField label="Search Wordlist" variant="outlined"></TextField>
                    <Dialog open={this.state.openCreateWordlist}>
                        <DialogTitle>New Wordlist</DialogTitle>
                        <div style={{marginLeft: "5%"}}>
                            <Paper elevation={0} style={{height: "150px", width: "500px"}}>
                                <Input placeholder="Wordlist Name" onChange={(e) => this.setState({wordlistName: e.target.value})}></Input>
                                <br></br>
                                <TextField label="Description" style={{marginTop: "20px", width: "200px"}} onChange={(e) => this.setState({wordlistDescription: e.target.value})}></TextField>
                                <br></br>
                                <div style={{textAlign: "center"}}>
                                    <Button color="primary" variant="filled" onClick={this.createWordlist}>Go</Button>
                                </div>
                            </Paper>
                        </div>
                    </Dialog>
                </div>
            )
        }
    }
}