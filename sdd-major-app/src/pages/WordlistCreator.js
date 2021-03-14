import React, { useEffect } from 'react'
import { Paper, Card, CardContent } from '@material-ui/core'
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
            wordlistCode: ""
        }
    }

    // Adding user details pre render
    componentWillMount() {
        let uid = sessionStorage.getItem("uid");
        // this.setState({
        //     wordlistCode: wordlistCode
        // })

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
                    <h1 style={{textAlign: "left",}}>10 IST</h1>
                    <div style={{display: "inline-block"}}>
                        <Paper elevation={8} style={{width: "400px", height: "500px", borderRadius: "10px"}}>
                            <h2 style={{padding: "5%"}}>Your Words</h2>
                        </Paper>
                    </div>
                </div>
            )
        }
    }
}