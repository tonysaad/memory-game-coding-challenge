import { TILES } from './constant';
import { shuffle, preloadImg } from './utils';
import { getCardsFragment, unflipCards, markAsSuccess, flipImg } from './ui';

export const gameState = {
  pairsNo: 3, //We multiply this number by two to draw a grid of an even number
  init() {
    this.current = 'INIT';
    this.container = document.querySelector('#game');
    this.pairsNo = parseInt(this.pairsNo);
    this.gridCells = this.generateCells();
    this.firstCard = undefined;
    this.secondCard = undefined;
    this.openedCards = [];
    this.movesCount = 0;
    this.container.addEventListener(
      'click',
      this.flipEventListener.bind(gameState)
    );
    const fragment = getCardsFragment(this.gridCells);
    const counter = document.createElement('span');
    counter.classList.add('counter');
    fragment.appendChild(counter);
    this.container.appendChild(fragment);
  },
  generateCells() {
    const newGridCells = [];
    this.gameTiles = shuffle(TILES).slice(0, this.pairsNo);
    this.gameTiles.forEach((tile) => {
      newGridCells.push(...Array(2).fill(tile));
      preloadImg(tile);
    });
    return shuffle(newGridCells);
  },
  flipEventListener(e) {
    const {
      target: { parentNode },
    } = e;
    const cardIndex = parseInt(parentNode.getAttribute('data-index'));
    if (this.isLocked(cardIndex)) {
      return;
    }
    document.querySelector('.counter').innerHTML = ++this.movesCount;
    if (this.current === 'INIT') {
      this.current = 'IN_PROGRESS';
    }
    flipImg(parentNode, this.gridCells[cardIndex]);
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
      cardIndex === this.firstCard ||
      cardIndex === this.secondCard ||
      this.openedCards.indexOf(cardIndex) !== -1 ||
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
        this.container.removeEventListener(
          'click',
          this.flipEventListener.bind(gameState)
        );
        setTimeout(
          () =>
            confirm('YOU HAVE WONNNNN!!!!!, want to re-play ?') && this.reset(),
          100
        );
      }
    }
  },
  reset() {
    this.container.innerHTML = '';
    this.init();
  },
};
