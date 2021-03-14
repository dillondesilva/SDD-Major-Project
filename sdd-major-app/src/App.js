import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WordlistCreator from './pages/WordlistCreator';

function App() {
  return (
    <Router>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/register">
        <Register/>
      </Route>
      <Route path="/dashboard">
        <Dashboard/>
      </Route>
      <Route path="/edit/:id" >
        <WordlistCreator/>
      </Route>
    </Router>
  );
}

export default App;
