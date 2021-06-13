// Importing React and necessary dependencies for project
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';  
import HomeAppBar from '../components/HomeAppBar'
import '../css/Home.css'

export default class Home extends React.Component {
  render() {
    return (
      <div className="App">
          <HomeAppBar></HomeAppBar>
          <br></br>
          <h4 className="motto">Language in the classroom made easy</h4>
          <p className="mottoSubText">Automated learning solution for EALD students</p>
          <img src="/client/logopurple.png" className="frontLogo"></img>
          <div className="actionButtons">
            <Link to="/register/">
              <button>
                Get Started
              </button>
            </Link>
          </div>
      </div>
    ); 
  }
}