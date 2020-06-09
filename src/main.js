import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/main.css';
import Game from './components/Game';

const App = () => {
  return (
    <div className="container">
      <h1>Card Matching Memory Game</h1>
      <h2>
        Coding challenge for <strong>Next Matter</strong>
      </h2>
      <Game />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
