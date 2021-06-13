// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Paper, TextField, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

// React class component for quiz mode
export default class Quiz extends React.Component {
    constructor(props) {
        super(props);

        // State variable for this component to store userDetails,
        // as well as any details about a word being added in
        // progress
        this.state = {
            userDetails: {
                username: "",
                email: ""
            },
            wordlistCode: "", // short id for wordlist
            openWord: false, // is the dialog for creating a wordlist panel open?
            wordToAdd: "", // a string storing the word to add
            definitionToAdd: "", // a string storing the definition to add
            wordTranslationToAdd: "", // a string storing the translation of a word
            imageToAdd: "", // stores the base64 image string
            definitionTranslationToAdd: "", // a string storing the translation of a word definition
            words: [], // an array of words currently in the list
            selectedWord: "none", // the currently selected word in the viewer,
            answerValue: "", // the current value of the user typed in answer,
            currentRandomWordData: {}, // Random word data of the current word
            targetLanguage: "fr", // 
            isWordLoading: true
        }
    }

    // Adding user details pre render
    componentDidMount() {
        let uid = sessionStorage.getItem("uid");

        // Gets the wordlist code from the URL parameters
        let wordlistCode = this.props.match.params.id;
        this.setState({
            wordlistCode: wordlistCode
        }, () => {
            // Gets the current words to display in a wordlist
            this.getWords();
        })

        // Calling API Endpoint to get user details based
        // off the UID in sessionStorage
        fetch('/api/userbase/get_user_by_uid', {
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
                this.setState({userDetails: data});
        })
    }

    // Translates some given text into the target language in state
    translateText(translateData) {
        fetch('/api/translate/basic_translate', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(translateData)
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
    }
    
    // Gets all the current words
    getWords() {
        let uid = sessionStorage.getItem("uid");

        // Comprises a query to put in database for 
        // this specific wordlists's words
        let wordlistData = {
            "uid": uid,
            "wordlistCode": this.state.wordlistCode,
            "targetLanguage": this.state.targetLanguage
        }

        // Calling the get_words API endpoint
        fetch('/api/wordlist/get_words_with_translations', {
            method: 'post',
            headers: {
                'Content-Type':  'application/json',
            }, 
            // Sending wordlistData info to server
            body: JSON.stringify(wordlistData)
            })
            // Get the response json
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // for (let word in data["words"]) {
                //     let translateData = {
                //         textToTranslate: data["words"][word]["word"], 
                //         targetLanguage: this.state.targetLanguage
                //     }

                //     let translatedWord = this.translateText(translateData);
                //     console.log("bro", data["words"][word])
                //     data["words"][word]["translated_word"] = translatedWord;

                //     translateData.textToTranslate = data["words"][word]["definition"]; 
                //     let translatedDefinition = this.translateText(translateData); 
                //     data["words"][word]["translated_definition"] = translatedDefinition;
                // }

                // Setting the words to displayed from state to be server's
                // response with words
                this.setState({
                    words: data["words"]
                }, () => {
                    this.generateWordData();
                })

            })
        }

    // Generates random word data to be displayed 
    generateWordData() {
        let randomWordDataIndex = Math.floor(Math.random() * this.state.words.length);
        let randomWordData = this.state.words[randomWordDataIndex];
        console.log(this.state.words)
        this.setState({
            currentRandomWordData: randomWordData,
            isWordLoading: false
        })
    }

    // Randomises the card for quizzing on display
    generateQuizCard() {
        // Gets a random word's data from the array. randomWordDataIndex
        // is the index location of the word data
        if (this.state.isWordLoading !== true) {
            let currentRandomWordData = this.state.currentRandomWordData;
            console.log(currentRandomWordData.translated_definition)
            return (
                <div>
                    <h2>{currentRandomWordData.translated_word}</h2>
                    <img src={currentRandomWordData.img} style={{maxWidth: "100px"}}></img>
                </div>
            )       
        }   
    }

    // Checks the answer a user typed in
    checkAnswer() {
        if (this.state.answerValue.toLowerCase() === this.state.currentRandomWordData.word.toLowerCase()) {
            Swal.fire("Correct!")
            this.generateWordData();
        }
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <h1>Quiz Mode</h1>
                <div style={{textAlign: "center", display: "inline-block"}}>
                    <Paper style={{width: "120vh", height: "80vh"}} elevation={10}>
                        {this.generateQuizCard()}
                        <TextField placeholder="Word in English" value={this.state.answerValue} onChange={(e) => this.setState({answerValue: e.target.value})}></TextField>
                        <br></br>
                        <br></br>
                        <Button variant="outlined" onClick={() => this.checkAnswer()}>Check my answer</Button>
                    </Paper>
                </div>
            </div>
        )
    }
}