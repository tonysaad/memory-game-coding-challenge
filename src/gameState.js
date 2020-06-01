import { TILES, PAIRS_NO } from './constant';
import { shuffle, preloadImg } from './utils';
import {
  getCardsFragment,
  unflipCards,
  markAsSuccess,
  flipImg,
  updateCounter,
} from './ui';

export const generateCells = (gameTiles) => {
  const newGridCells = [];
  gameTiles.forEach((tile) => {
    newGridCells.push(...Array(2).fill(tile));
    preloadImg(tile);
  });
  return shuffle(newGridCells);
};

export const gameState = {
  init(container, pairsNo = PAIRS_NO) {
    this.current = 'INIT';
    this.pairsNo = parseInt(pairsNo);
    this.gameTiles = shuffle(TILES).slice(0, this.pairsNo);
    this.gridCells = generateCells(this.gameTiles);
    this.firstCard = undefined;
    this.secondCard = undefined;
    this.openedCards = [];
    this.movesCount = 0;
    this.startTime = 0;
    this.container = container || this.container;
    this.container.addEventListener(
      'click',
      this.flipEventListener.bind(gameState)
    );
    this.container.appendChild(getCardsFragment(this.gridCells));
  },
  flipEventListener(e) {
    const { target } = e;
    const el = target.hasAttribute('data-index') ? target : target.parentNode;
    const cardIndex = parseInt(el.getAttribute('data-index'));
    if (
      this.current === 'FINISHED' &&
      [...target.classList].includes('modal')
    ) {
      return this.reset();
    }
    if (this.isLocked(cardIndex)) {
      return;
    }
    updateCounter(++this.movesCount);
    if (this.current === 'INIT') {
      this.current = 'IN_PROGRESS';
      this.startTime = Date.now();
    }
    flipImg(el, this.gridCells[cardIndex]);
    if (typeof this.firstCard === 'undefined') {
      this.firstCard = cardIndex;
    } else if (typeof this.secondCard === 'undefined') {
      this.secondCard = cardIndex;
      this.checkMatched();
    } else {
      unflipCards(
        this.container,
        ...[this.firstCard, this.secondCard].filter(
          (i) => this.openedCards.indexOf(i) === -1
        )
      );
      this.firstCard = cardIndex;
      this.secondCard = undefined;
    }
  },
  isLocked(cardIndex) {
    return (
      this.openedCards
        .concat([this.firstCard, this.secondCard])
        .indexOf(cardIndex) !== -1 ||
      isNaN(cardIndex) ||
      this.current === 'FINISHED'
    );
  },
  checkMatched() {
    const isMatched =
      this.gridCells[this.firstCard] === this.gridCells[this.secondCard];
    if (isMatched) {
      this.openedCards.push(this.firstCard, this.secondCard);
      markAsSuccess(this.container, this.firstCard, this.secondCard);
      if (this.openedCards.length === this.gridCells.length) {
        this.current = 'FINISHED';
        this.container.classList.add('isSolved');
        this.container.removeEventListener(
          'click',
          this.flipEventListener.bind(gameState)
        );
        const modal = this.container.querySelector('.modal');
        if (modal) {
          modal.classList.add('isVisible');
          modal.innerHTML = `Congrats, You have won! You've done ${
            this.movesCount
          } moves in ${Math.ceil(
            (Date.now() - this.startTime) / 1000
          )} seconds. Click to play again`;
        }
      }
    }
  },
  reset() {
    const modal = this.container.querySelector('.modal');
    if (modal) {
      modal.classList.remove('isVisible');
    }
    this.container.classList.remove('isSolved');
    this.container.innerHTML = '';
    this.init();
  },
};
