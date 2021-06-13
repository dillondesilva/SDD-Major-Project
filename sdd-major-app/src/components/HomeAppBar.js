import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'

export default class HomeAppBar extends React.Component {
  render() {
    return (
      <div>
            <div className="HeaderContainer">
              <div className="actions">
                <h3>
                  <Link to="/login" className="link">Sign In</Link>
                </h3> 
                <h3>
                  <Link to="/register" className="link">Register</Link>
                </h3> 
              </div>
            </div>
      </div>
    ); 
  }
}