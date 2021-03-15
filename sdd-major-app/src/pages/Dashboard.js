import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
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
            existingWordlists: {},
            openCreateWordlist: false,
            wordlistName: "",
            wordlistDescription: ""
        }

        this.createWordlist = this.createWordlist.bind(this);
        this.getWordlists = this.getWordlists.bind(this);
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
        this.getWordlists();
    }

    getWordlists() {
        let uid = sessionStorage.getItem("uid");
        console.log(uid)
        fetch('http://sddmajordev:5000/api/wordlist/get_all_wordlists', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify({"uid": uid})
          })
          .then(response => response.json())
          .then(data => {
              console.log(data)
              this.setState({
                  existingWordlists: data.wordlists
              })
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
              window.location = `/edit/${wordlistCode}`
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
                <div style={{overflow: "hidden"}}>
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
                    <br></br>
                    <div>
                        <Paper style={{width: "950px", height: "100%", margin: "0", float: "right"}} elevation={3}>
                            <div style={{margin: "3%"}}>
                                <h1>Your Wordlists</h1>
                                <TextField label="Search Wordlist" variant="outlined" size="small"></TextField>
                                <Paper style={{width: "800px", minHeight: "100vh", marginTop: "1%"}} elevation={5}>
                                {
                                    Object.keys(this.state.existingWordlists).map((wordlistCode) => {
                                        let wordlistData = this.state.existingWordlists[wordlistCode]
                                        return (
                                            <div>
                                                <Link to="/edit/487y743">{wordlistData.wordlist_name}</Link>
                                                <br></br>
                                            </div>
                                        )
                                    })
                                }
                                </Paper>
                            </div>
                        </Paper>
                    </div>
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