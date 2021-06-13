// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Input, Tooltip, Button, IconButton, TextField, Dialog, Zoom, DialogTitle, Paper } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import shortid from 'shortid'
import '../css/Dashboard.css'

// React class component for the Dashboard
export default class Dashboard extends React.Component {
    // Constructor has all the detail
    constructor(props) {
        super(props);

        this.state = {
            userDetails: {
                username: "",
                email: "",
                accountType: "",
                addCode: ""
            },
            existingWordlists: {}, // an object with all the current wordlists stored
            openCreateWordlist: false, // boolean handling whether a 'new wordlist' creation dialog should open,
            openAddStudent: false, // boolean handling whether the 'adding teacher' dialog should open,
            addStudentCode: "", // string storing the short code for a student account
            wordlistName: "", // name of wordlist in process of creation
            wordlistDescription: "" // description of wordlist in process of creation
        }

        // Binding the use of these functions to constructor to be referenced
        this.createWordlist = this.createWordlist.bind(this);
        this.getWordlists = this.getWordlists.bind(this);
        this.addStudent = this.addStudent.bind(this);
    }

    // Adding user details pre render
    componentWillMount() {
        let uid = sessionStorage.getItem("uid");
        fetch('api/userbase/get_user_by_uid', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify({"uid": uid})
          })
          // Get the response json
          .then(response => response.json())
          .then(data => {
              // Sets the userDetails state to store whatever the server returned
              this.setState({
                  userDetails: data
              }, () => {
                    // gets the wordlists to be displayed in the dashboard
                    this.getWordlists();
              })
        })
    }

    // Gets all the wordlists for a user based off their UID
    getWordlists() {
        let uid = sessionStorage.getItem("uid");
        if (this.state.userDetails.accountType === "teacher") {
            // Call the get_all_wordlists API Endpoint
            fetch('api/wordlist/get_all_wordlists', {
                method: 'post',
                headers: {
                'Content-Type':  'application/json',
                }, 
                body: JSON.stringify({"uid": uid})
            })
            // Get response json
            .then(response => response.json())
            .then(data => {
                // Add our existing wordlists to display from whatever 
                // wordlists the server returned
                this.setState({
                    existingWordlists: data.wordlists
                })
            })
        } else {
            // Call the get_assigned_wordlists API Endpoint for a student
            fetch('api/userbase/get_assigned_wordlists', {
                method: 'post',
                headers: {
                'Content-Type':  'application/json',
                }, 
                body: JSON.stringify({"uid": uid})
            })
            // Get response json
            .then(response => response.json())
            .then(data => {
                // Add our existing wordlists to display from whatever 
                // wordlists the server returned
                this.setState({
                    existingWordlists: data.wordlists
                })
            }) 
        }  
    }

    // Create Wordlist
    createWordlist() {
        let uid = sessionStorage.getItem("uid");

        // Generates a short id for wordlists
        let wordlistCode = shortid.generate()

        // Wordlist data to send to server
        let wordlistData = {
            wordlistName: this.state.wordlistName,
            wordlistDescription: this.state.wordlistDescription,
            wordlistCode: wordlistCode,
            uid: uid
        }

        // Calls API endpoint for creating a wordlist
        fetch('api/wordlist/create_wordlist', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify(wordlistData)
          })
          // Get response json
          .then(response => response.json())
          .then(data => {
              // send users to the wordlist editor with the corresponding wordlist code
              window.location = `/edit/${wordlistCode}`
        }) 
    }

    // Adds a new student to a teacher account
    addStudent() {
        let uid = sessionStorage.getItem("uid");
        let addStudentData = {
            uid: uid,
            studentCode: this.state.addStudentCode
        }

        // Calls API endpoint for creating a wordlist
        fetch('api/userbase/add_student', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify(addStudentData)
          })
          // Get response json
          .then(response => response.json())
          .then(data => {
            this.setState({
                openAddStudent: false
            }, () => {
                if ("error" in data) {
                    Swal.fire({
                        title: 'Oops!',
                        text: data["error"],
                        icon: 'error',
                        cancelButtonText: 'Retry'
                        })
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: "Student Added",
                        icon: 'success',
                        cancelButtonText: 'Retry'
                    })
                }
            })
        }) 
    }

    // Returns UI elements on screen for the dashboard
    render() {
        if (this.state.userDetails.accountType === "student") {
            return (
                <div style={{overflow: "hidden"}}>
                    <h1 style={{textAlign: "center"}}>Hello, {this.state.userDetails.username}</h1>
                    <br></br>
                    <div>
                        <Paper style={{width: "950px", height: "100%", margin: "0", float: "right"}} elevation={3}>
                            <div style={{margin: "3%"}}>
                                <h1 className="yourWordlists">Your Wordlists</h1>
                                <p>Please provide your teachers with the following code {this.state.userDetails.addCode}</p>
                                <p></p>
                                <Paper style={{width: "800px", minHeight: "100vh", marginTop: "1%"}} elevation={5}>
                                {
                                    Object.keys(this.state.existingWordlists).map((wordlistCode) => {
                                        let wordlistData = this.state.existingWordlists[wordlistCode]
                                        return (
                                            <div>
                                                <Link to={`/view/${wordlistCode}`}>
                                                    <button className="wordlistLink"to={`/view/${wordlistCode}`}>
                                                        {wordlistData.wordlist_name}
                                                    </button>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                                </Paper>
                            </div>
                        </Paper>
                    </div>
                </div> 
            )
        } else {
            // Return Teacher Dashboard
            return (
                <div style={{overflow: "hidden"}}>
                    <Tooltip title="Add Student" TransitionComponent={Zoom} arrow>
                        <IconButton aria-label="delete" style={{backgroundColor: "#FF7979", float: "right"}} onClick={() => this.setState({openAddStudent: true})}>
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
                                <h1 className="yourWordlists">Your Wordlists</h1>
                                {/* <TextField label="Search Wordlist" variant="outlined" size="small"></TextField> */}
                                <Paper style={{width: "800px", minHeight: "100vh", marginTop: "1%"}} elevation={5}>
                                {
                                    Object.keys(this.state.existingWordlists).map((wordlistCode) => {
                                        let wordlistData = this.state.existingWordlists[wordlistCode]
                                        return (
                                            <div>
                                                <Link to={`/edit/${wordlistCode}`}>{wordlistData.wordlist_name}</Link>
                                                <br></br>
                                            </div>
                                        )
                                    })
                                }
                                </Paper>
                            </div>
                        </Paper>
                    </div>
                    <Dialog open={this.state.openCreateWordlist} onClose={() => this.setState({openCreateWordlist: false})} >
                        <DialogTitle>New Wordlist</DialogTitle>
                        <div>
                            <Paper elevation={0} style={{height: "40vh"}}>
                                <div style={{padding: "5vh"}}>
                                    <Input placeholder="Wordlist Name" onChange={(e) => this.setState({wordlistName: e.target.value})}></Input>
                                    <br></br>
                                    <TextField label="Description" style={{marginTop: "20px", width: "200px"}} onChange={(e) => this.setState({wordlistDescription: e.target.value})}></TextField>
                                    <br></br>
                                    <div style={{textAlign: "center"}}>
                                        <Button color="primary" variant="filled" onClick={this.createWordlist}>Go</Button>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </Dialog>
                    <Dialog open={this.state.openAddStudent} onClose={() => this.setState({openAddStudent: false})} >
                        <DialogTitle>Add Student</DialogTitle>
                        <div>
                            <Paper elevation={0} style={{height: "30vh", overflow: "hidden"}}>
                                <div style={{padding: "5vh"}}>
                                    <Input placeholder="Student Code" onChange={(e) => this.setState({addStudentCode: e.target.value})}></Input>
                                    <br></br>
                                    <br></br>
                                    <div style={{textAlign: "center"}}>
                                        <Button color="primary" variant="filled" onClick={this.addStudent}>Add Student</Button>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </Dialog>
                </div>
            )
        }
    }
}