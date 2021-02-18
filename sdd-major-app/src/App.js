import logo from './logo.svg';
import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Route path="/">
        <Home/>
      </Route>
    </Router>
  );
}

export default App;
