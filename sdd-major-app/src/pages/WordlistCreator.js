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
            openWord: false,
            wordToAdd: "",
            definitionToAdd: "",
            wordTranslationToAdd: "",
            imageToAdd: "",
            definitionTranslationToAdd: "",
            words: [],
            selectedWord: "none"
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
        }, () => {
            // Gets the current words to display in a wordlist
            this.getWords()
        })

        fetch('api/userbase/get_user_by_uid', {
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

    // Calls the addWord API Endpoint and then adds a given word
    // to the current wordlist
    addWord() {
        let uid = sessionStorage.getItem("uid");

        // Instantiating a new file reader to convert 
        // user selected image to blob
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            console.log(reader.result)
        })

        let wordData = {
            "uid": uid,
            "wordToAdd": this.state.wordToAdd,
            "definitionToAdd": this.state.definitionToAdd,
            "wordTranslationToAdd": this.state.wordTranslationToAdd,
            "definitionTranslationToAdd": this.state.definitionTranslationToAdd,
            "wordlistCode": this.state.wordlistCode,
            "imageToAdd": this.state.imageToAdd
        }

        fetch('/api/wordlist/add_word', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            body: JSON.stringify(wordData)
          })
          .then(response => response.json())
          .then(data => {
            this.setState({
                openWord: false
            }, () => {
                this.getWords();
            })
        })
    }

    fileToBlob(eventData) {
        const reader = new FileReader();
        const file = eventData.target.files[0];

        reader.addEventListener("load", () => {
            // convert image file to base64 string
            this.setState({
                imageToAdd: reader.result
            })
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    getWords() {
        let uid = sessionStorage.getItem("uid");

        let wordData = {
            "uid": uid,
            "wordlistCode": this.state.wordlistCode
        }

        fetch('/api/wordlist/get_words', {
            method: 'post',
            headers: {
                'Content-Type':  'application/json',
            }, 
            body: JSON.stringify(wordData)
            })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    words: data["words"]
                })
        }) 
    }

    // Changes the selected word in the side panel
    changeSelectedWord(selectedWordIndex) {
        let selectedWordData = this.state.words[selectedWordIndex]
        this.setState({
            selectedWord: selectedWordData
        }, () => {
            console.log(this.state.selectedWord)
        })
    }

    renderWordCard() {
        // Return an empty card indicating to select a word if no
        // word has been selected
        if (this.state.selectedWord === "none") {
            return (
                <Paper elevation={3} style={{width: "700px", height: "500px", borderRadius: "10px", position: "absolute", display: "relative"}}>
                    <div style={{position: "absolute", top: "65%", left: "50%", width: "300px", height: "300px", marginTop: "-150px", marginLeft: "-150px"}}>
                        <h1 style={{textAlign: "center"}}>No Word Selected</h1>
                        <p style={{textAlign: "center"}}>Please select a word to view from the panel to the left</p>
                    </div>
                </Paper>  
            )
        } else {
            return (
                <Paper elevation={3} style={{width: "700px", height: "500px", borderRadius: "10px", position: "absolute"}}>
                    <h2 style={{paddingLeft: "5%", paddingTop: "5%", textAlign: "left"}}>{this.state.selectedWord.word}</h2>
                    <h3 style={{paddingLeft: "5%", textAlign: "left", color: "grey", fontWeight: "400"}}>{this.state.selectedWord.translated_word}</h3>
                    <div style={{textAlign: "center"}}>
                        <img src={this.state.selectedWord.img} style={{position: "relative", maxWidth: "300px", maxHeight: "200px"}}></img>
                    </div>
                    <br></br>
                    <p style={{paddingLeft: "5%", paddingTop: "1%", textAlign: "left"}}>{this.state.selectedWord.definition}</p>
                    <p style={{paddingLeft: "5%", paddingTop: "1%", textAlign: "left", color: "grey"}}>{this.state.selectedWord.translated_definition}</p>
                </Paper>      
            )
        }
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
                                <div style={{textAlign: "center", paddingTop: "10%"}}>
                                    {
                                        this.state.words.map((word, index) => {
                                            // wordIndex refers to the index of the word within this.state.words
                                            // for selection
                                            let wordIndex = index
                                            return (
                                                <Button style={{width: "100%", borderRadius: "0"}} onClick={() => this.changeSelectedWord(wordIndex)}>{word.word}</Button> 
                                            )
                                        })
                                    }
                                </div>
                            </Paper>
                        </div>
                        <div style={{display: "inline-block"}}>
                            { this.renderWordCard() }
                        </div>
                    </div>
                    <Dialog fullScreen open={this.state.openWord} onClose={() => this.setState({openWord: false})}>
                        <DialogTitle>Add Word</DialogTitle>
                        <div style={{marginLeft: "5%"}}>
                            <Paper elevation={0} style={{textAlign: "center"}}>
                                <TextField label="Word in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordToAdd: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Definition in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({definitionToAdd: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Word in Alternate Language" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordTranslationToAdd: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Definition in Alternate Language" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({definitionTranslationToAdd: e.target.value})}></TextField>
                                <br></br>
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input type="file" onChange={(e) => this.fileToBlob(e)} hidden/>
                                </Button>
                                <br></br>
                                <div style={{textAlign: "center"}}>
                                    <Button color="primary" variant="filled" onClick={() => this.addWord()}>Add Word</Button>
                                </div>
                            </Paper>
                        </div>
                    </Dialog>
                </div>
            )
        }
    }
}