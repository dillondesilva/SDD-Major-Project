// Importing React and necessary dependencies for project
import React, { useEffect } from 'react'
import { Paper, Button, IconButton, 
    TextField, Dialog, 
    DialogTitle, Input,
    Stepper, Step,
    StepLabel, StepContent,
    Select, MenuItem} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import '../css/WordlistCreator.css';

// React class component for wordlist creation
export default class WordlistCreator extends React.Component {
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
            selectedWord: "none", // the currently selected word in the viewer
            openAssignWordlist: false, // should the dialog box for managing students to a wordlist be open
            assignedStudents: [], // assignedStudents stores student names assigned to the wordlist
            students: [], // students stores the possible options for assignments
            studentsToAdd: [], // stores the students to add to a wordlist during the assignment process,
            activeAddStep: 0, // stores the active step in the add word process
            targetLanguage: "en", // target language for translation
        }
    }

    // Adding user details pre render
    componentWillMount() {
        let uid = sessionStorage.getItem("uid");

        // Gets the wordlist code from the URL parameters
        let wordlistCode = this.props.match.params.id;
        this.setState({
            wordlistCode: wordlistCode
        }, () => {
            // Gets the current words to display in a wordlist
            this.getWords();
            this.getStudents();
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

        // An object with all the data for the word to be added
        let wordData = {
            "uid": uid,
            "wordToAdd": this.state.wordToAdd,
            "definitionToAdd": this.state.definitionToAdd,
            "wordlistCode": this.state.wordlistCode,
            "imageToAdd": this.state.imageToAdd
        }

        // Calling the API Endpoint for adding a word
        fetch('/api/wordlist/add_word', {
            method: 'post',
            headers: {
              'Content-Type':  'application/json',
            }, 
            // Sending word data to add
            body: JSON.stringify(wordData)
          })
          // Get the response json
          .then(response => response.json())
          .then(data => {
            // Setting the add new word panel to be closed
            this.setState({
                openWord: false,
                imageToAdd: "",
                definitionToAdd:  "",
                wordToAdd: ""
            }, () => {
                // Refresh the words displayed
                this.getWords();
            })
        })
    }

    // When the file input has been changed, event handler
    // is fileToBlob() which takes the data and finds the file
    fileToBlob(eventData) {
        // Instantiating a new file reader to convert 
        // user selected image to blob 
        const reader = new FileReader();
        const file = eventData.target.files[0];

        // Converts intoo a data blob and stores in state
        reader.addEventListener("load", () => {
            // convert image file to base64 string
            this.setState({
                imageToAdd: reader.result
            })
        }, false);

        // If there is a file, do use the reader instance
        // to convert file into a data blob
        if (file) {
            reader.readAsDataURL(file);
        }
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
        fetch('/api/wordlist/get_words', {
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
                for (let word in data["words"]) {
                    console.log(data["words"][word])

                    let translateData = {
                        textToTranslate: data["words"][word]["word"], 
                        targetLanguage: this.state.targetLanguage
                    }

                    fetch('/api/translate/basic_translate', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(translateData)
                    })
                    .then(response => response.json())
                    .then(d => {
                        data["words"][word]["translated_word"] = d.res.TranslatedText
                    })

                    translateData.textToTranslate = data["words"][word]["definition"]; 

                    fetch('/api/translate/basic_translate', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(translateData)
                    })
                    .then(response => response.json())
                    .then(d => {
                        data["words"][word]["translated_definition"] = d.res.TranslatedText
                    })
                }
                // Setting the words to displayed from state to be server's
                // response with words
                this.setState({
                    words: data["words"]
                })
        }) 
    }

    // Gets the current students under a teacher and updates
    // the state of known students
    getStudents() {
        let uid = sessionStorage.getItem("uid");

        // Getting students that belong to a teacher
        fetch('/api/userbase/get_students', {
            method: 'post',
            headers: {
                'Content-Type':  'application/json',
            }, 
            body: JSON.stringify({"uid": uid})
            })
            // Get the response json
            .then(response => response.json())
            .then(data => {
                // Sets the students state to store whatever the server returned
                this.setState({students: data["students"]})
        }) 
    }

    // Changes the selected word in the side panel from a given index
    // This is the event handler for when a word is pressed for viewing
    changeSelectedWord(selectedWordIndex) {
        // Gets the current word data of the selected index
        let selectedWordData = this.state.words[selectedWordIndex]
        // Change the selected word
        this.setState({
            selectedWord: selectedWordData
        }, () => {
            // Debug statement to check selectedWord has appeared correctly
            console.log(this.state.selectedWord)
        })
    }

    // This is called by a map function for each word
    renderWordCard() {
        // Return an empty card indicating to select a word if no
        // word has been selected
        if (this.state.selectedWord === "none") {
            return (
                <Paper elevation={3} style={{width: "700px", height: "500px", borderRadius: "10px", position: "absolute", display: "relative"}}>
                    <div style={{position: "absolute", top: "65%", left: "50%", width: "300px", height: "300px", marginTop: "-150px", marginLeft: "-150px"}}>
                        <h1 style={{textAlign: "center"}} className="wordTitle">No Word Selected</h1>
                        <p style={{textAlign: "center"}} className="wordDefinition">Please select a word to view from the panel to the left</p>
                    </div>
                </Paper>  
            )
        } else {
            // Return a styled word card with the appropriate information and image
            return (
                <Paper elevation={3} style={{width: "700px", height: "500px", borderRadius: "10px", position: "absolute"}}>
                    <h2 style={{paddingLeft: "5%", paddingTop: "5%", textAlign: "left"}} className="wordTitle">{this.state.selectedWord.word}</h2>
                    <h3 style={{paddingLeft: "5%", textAlign: "left", color: "grey", fontWeight: "400"}} className="translatedWord">{this.state.selectedWord.translated_word}</h3>
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

    // Adds students to a wordlist following the assignment process
    addStudentsToWordlist() {
        // addRequestData stores all the data to send to server for assigning wordlists
        // to students
        let addRequestData = {
            studentsToAdd: this.state.studentsToAdd,
            wordlistCode: this.state.wordlistCode
        };

        fetch('/api/userbase/add_students_to_wordlist', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addRequestData)
        })
        // Get the response json
        .then(response => response.json())
        .then(data => {
            // Re render the current students assigned to the list
            this.getStudents()
        }) 
    }

    // Allows for the target language to be changed and new words retrieved
    changeTargetLanguage(e) {
        this.setState({
            targetLanguage: e.target.value
        }, () => {
            this.getWords();
        })
    }

    // Renders UI elements for the wordlist editor
    render() {
        if (this.state.accountType === "student") {
            // Return Student Wordlist Editor (not implemented yet)
        } else {
            const steps = [
                {
                    stepName: "Enter Word in English"
                },
                {
                    stepName: "Choose Translation Data"
                },
                {
                    stepName: "Add Images"
                }
            ]
            // Return Teacher Wordlist Editor UI Elements
            return (
                <div>
                    <div style={{paddingTop: "1%"}}>
                        <div style={{paddingRight: "1%", display: "inline"}}>
                            <Button style={{float: "right"}} onClick={() => this.setState({openAssignWordlist: true})}>Assign Wordlist</Button>
                        </div>
                    </div>
                    <div style={{marginLeft: "2%"}}>
                        <div style={{display: "inline-block", marginRight: "40%"}}>
                            <Paper elevation={3} style={{width: "400px", height: "500px", borderRadius: "10px", position: "absolute"}}>
                                <div>
                                    <div className="languageSelector">
                                        <div style={{position: "absolute", paddingLeft: "5%", paddingTop: "5%",}}>
                                            <h2 style={{textAlign: "left"}} className="yourWords">Your Words</h2>
                                            <Select value={this.state.targetLanguage} onChange={(e) => { this.changeTargetLanguage(e) }}>
                                                <MenuItem value="en">English</MenuItem>
                                                <MenuItem value="fr">French</MenuItem>
                                            </Select>
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
                                {/* <Paper style={{width: "250px", height: "250px", textAlign: "center"}}>
                                    <TextField value={this.state.wordToAdd} onChange={(e) => {this.setState({wordToAdd: e.target.value})}}></TextField>
                                </Paper> */}
                                {/* <Stepper style={{width: "60%"}} activeStep={this.state.activeAddStep}>
                                    {steps.map((label, index) => {  
                                        const stepProps = {};  
                                        const labelProps = {};  
                                        return (  
                                            <Step>  
                                                <StepLabel>{label.stepName}</StepLabel> 
                                            </Step>  
                                        );  
                                    })}  
                                    {/* <Step>
                                        <p>Word in English</p>
                                    </Step>
                                    <Step>
                                        <p>Choose Translation Data</p>
                                    </Step>
                                    <Step>
                                        <p>Add Image</p>
                                    </Step> */}
                                {/* </Stepper> */}
                                <TextField label="Word in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({wordToAdd: e.target.value})}></TextField>
                                <br></br>
                                <TextField label="Definition in English" variant="outlined" style={{marginTop: "20px", width: "80%"}} onChange={(e) => this.setState({definitionToAdd: e.target.value})}></TextField>
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
                    <Dialog open={this.state.openAssignWordlist} onClose={() => this.setState({openAssignWordlist: false})} maxWidth={"md"} fullWidth={true}>
                        <DialogTitle>Assign Students</DialogTitle>
                        <div style={{marginLeft: "5%"}}>
                            <Paper elevation={0} style={{textAlign: "center"}}>
                            <Autocomplete
                            multiple
                            value={this.state.studentsToAdd}
                            options={this.state.students}
                            getOptionLabel={(option) => option[1]}
                            style={{ width: 300 }}
                            onChange={(event, value) => this.setState({studentsToAdd: value})}
                            renderInput={(params) => <TextField {...params} label="Search for student" variant="outlined" />}
                            />
                            <Button onClick={() => this.addStudentsToWordlist()}>Add</Button>
                                {
                                    this.state.students.map((student, index) => {
                                        return (
                                            <p>{student[1]}</p>  
                                        )
                                    })
                                }
                            </Paper>
                        </div>
                    </Dialog>
                </div>
            )
        }
    }
}