import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from "./views/home"

export default function App() {
  return (
    <div className="App">
      <header className="App-header" style={{paddingBottom: "32px"}}>
        <Home />
      </header>
    </div>
  );
}
