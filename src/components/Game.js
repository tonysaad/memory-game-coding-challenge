import React, { useState, useEffect } from 'react';
import {
  PAIRS_NO,
  TILES,
  PLACEHOLDER_IMG,
  STATUSES,
} from '../helpers/constant';
import { shuffle, preloadImg, timeElapsed } from '../helpers/utils';

const generateCells = (gameTiles) => {
  const newGridCells = [];
  gameTiles.forEach((tile) => {
    newGridCells.push(...Array(2).fill(tile));
  });
  return shuffle(newGridCells);
};

const Game = () => {
  const [pairsNo, _] = useState(PAIRS_NO);
  const [currentStatus, setCurrentStatus] = useState(STATUSES.INIT);
  const [gridCells, setGridCells] = useState([]);
  const [firstCard, setFirstCard] = useState();
  const [secondCard, setSecondCard] = useState();
  const [matchedCards, setMatchedCards] = useState([]);
  const [movesCount, setMovesCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const is = (status) => currentStatus === status;
  useEffect(() => {
    gridCells.forEach((img) => preloadImg(img));
  }, [gridCells]);
  useEffect(() => {
    if (movesCount === 0 && !is(STATUSES.INIT)) {
      setCurrentStatus(STATUSES.INIT);
    } else if (movesCount === 1) {
      setStartTime(Date.now());
      setCurrentStatus(STATUSES.IN_PROGRESS);
    } else if (matchedCards.length === gridCells.length) {
      setCurrentStatus(STATUSES.FINISHED);
    }
  }, [movesCount, matchedCards]);
  useEffect(() => {
    if (is(STATUSES.INIT)) {
      setGridCells(generateCells(shuffle(TILES).slice(0, pairsNo)));
      setMatchedCards([]);
      setFirstCard();
      setSecondCard();
    }
  }, [currentStatus]);
  const flipCard = (cardIndex) => {
    if (
      is(STATUSES.FINISHED) ||
      isNaN(cardIndex) ||
      matchedCards.concat([firstCard, secondCard]).indexOf(cardIndex) !== -1
    ) {
      return;
    }
    setMovesCount(movesCount + 1);
    if (typeof firstCard === 'undefined') {
      setFirstCard(cardIndex);
    } else if (typeof secondCard === 'undefined') {
      setSecondCard(cardIndex);
      if (gridCells[firstCard] === gridCells[cardIndex]) {
        setMatchedCards([...matchedCards, firstCard, cardIndex]);
      }
    } else {
      setFirstCard(cardIndex);
      setSecondCard(undefined);
    }
  };
  return (
    <div
      id="game"
      className={`grid pt-5 ${is(STATUSES.FINISHED) ? 'isSolved' : ''}`}>
      {gridCells.map((cell, i) => {
        const isMatched = matchedCards.indexOf(i) !== -1;
        const isFlipped = i === firstCard || i === secondCard;
        return (
          <div
            className={`tile ${
              isMatched
                ? 'is-opacity is-flipped'
                : isFlipped
                ? 'is-flipped'
                : 'is-placeholder'
            }`}
            key={i}
            onClick={() => flipCard(i)}>
            <img src={isMatched || isFlipped ? cell : PLACEHOLDER_IMG} />
          </div>
        );
      })}
      {movesCount ? (
        <div
          className="modal"
          onClick={() => is(STATUSES.FINISHED) && setMovesCount(0)}>
          {`Congrats, You have won! You've done ${movesCount} moves in ${timeElapsed(
            startTime
          )} seconds. Click to play again`}
        </div>
      ) : null}
    </div>
  );
};

export default Game;
