import React, { useEffect } from 'react'
import { Paper, Button, Card, CardContent, IconButton, TextField, Dialog, DialogTitle, Input } from '@material-ui/core'
import image from '../public/theboard.png'
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router';

export default class WordlistCreator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDetails: {
                username: "",
                email: ""
            },
            wordlistCode: "",
            openWord: false
        }
    }

    // Adding user details pre render
    componentWillMount() {
        let uid = sessionStorage.getItem("uid");
        // this.setState({
        //     wordlistCode: wordlistCode
        // })

        let wordlistCode = this.props.match.params.id;
        this.setState({
            wordlistCode: wordlistCode
        })

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
                    <h1 style={{paddingLeft: "2%"}}>10 IST</h1>
                    <div style={{marginLeft: "2%"}}>
                        <div style={{display: "inline-block", marginRight: "40%"}}>
                            <Paper elevation={3} style={{width: "400px", height: "500px", borderRadius: "10px", position: "absolute"}}>
                                <div style={{display: "inline-block", width: "100%"}}>
                                    <div style={{position: "absolute", paddingLeft: "5%", paddingTop: "5%",}}>
                                        <h2 style={{textAlign: "left"}}>Your Words</h2>
                                        <h3 style={{textAlign: "left", color: "grey", fontWeight: "400"}}>Jou woorde</h3>
                                    </div>
                                    <div style={{paddingRight: "5%", paddingTop: "12%"}}>
                                        <IconButton aria-label="delete" style={{backgroundColor: "#FF7979", float: "right"}} onClick={() => this.setState({openWord: true})}>
                                            <AddIcon style={{color: "white"}}/>
                                        </IconButton> 
                                    </div>
                                </div>
                            </Paper>
                        </div>
                        <div style={{display: "inline-block"}}>
                            <Paper elevation={3} style={{width: "700px", height: "500px", borderRadius: "10px", position: "absolute"}}>
                                <h2 style={{paddingLeft: "5%", paddingTop: "5%", textAlign: "left"}}>Vectors</h2>
                                <h3 style={{paddingLeft: "5%", textAlign: "left", color: "grey", fontWeight: "400"}}>Vektore</h3>
                                <div style={{textAlign: "center"}}>
                                    <img src={image} style={{position: "relative", maxWidth: "300px"}}></img>
                                </div>
                                <br></br>
                                <p style={{paddingLeft: "5%", paddingTop: "1%", textAlign: "left"}}>Lopsem ipsum</p>
                            </Paper>
                        </div>
                    </div>
                    <Dialog fullScreen open={this.state.openWord} onClose={() => this.setState({openWord: false})}>
                        <DialogTitle>Add Word</DialogTitle>
                        <div style={{marginLeft: "5%"}}>
                            <Paper elevation={0} style={{textAlign: "center"}}>
                                <TextField label="Word in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordlistName: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Definition in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordlistDescription: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Word in Alternate Language" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordlistDescription: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Definition in Alternate Language" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordlistDescription: e.target.value})}></TextField>
                                <br></br>
                                <Button variant="contained" component="label">
                                    Upload File
                                    <input type="file" hidden/>
                                </Button>
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