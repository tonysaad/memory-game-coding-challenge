import { generateCells, gameState } from '../gameState';
import { PAIRS_NO } from '../constant';
jest.useFakeTimers();

beforeEach(() => {
  // Set up our document body
  document.body.innerHTML = `<div id="container"></div>`;
  const container = document.querySelector('#container');
  gameState.init(container, PAIRS_NO);
});

test('Generated length is double of number of pairs', () => {
  expect(generateCells([1, 2])).toHaveLength(4);
});

test('Game Initialized with right number of cells', () => {
  const cells = container.querySelectorAll('div[data-index]');
  expect(cells).toHaveLength(PAIRS_NO * 2);
});

test('Counter shall show the number of moves', () => {
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.movesCount).toEqual(0);
  expect(container.querySelector('.counter').innerHTML).toEqual(
    expect.stringContaining('')
  );
  cells[0].click();
  expect(gameState.movesCount).toEqual(1);
  expect(container.querySelector('.counter').innerHTML).toEqual(
    expect.stringContaining('One')
  );
  cells[0].click();
  expect(gameState.movesCount).toEqual(1);
  expect(container.querySelector('.counter').innerHTML).toEqual(
    expect.stringContaining('One')
  );
  cells[1].click();
  expect(gameState.movesCount).toEqual(2);
  expect(container.querySelector('.counter').innerHTML).toEqual(
    expect.stringContaining(gameState.movesCount.toString())
  );
});

test('Once user click, game status changes to IN_PROGRESS', () => {
  gameState.init(container, 2);
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.current).toEqual('INIT');
  cells[0].click();
  expect(gameState.current).toEqual('IN_PROGRESS');
});

test('Once user click, Card gets flipped', () => {
  const cells = container.querySelectorAll('div[data-index]');
  //Nothing is flipped Yet ?
  expect([...cells[0].classList]).not.toContain('is-flipped');
  //Photo can't be seen in the DOM, so nobody can cheat by knowing what's the photo behind the hidden card
  expect(cells[0].innerHTML).not.toContain(gameState.gridCells[0]);
  //Good, then let's flip one card and see
  cells[0].click();
  //Yaaay, the card is flipped and have the right CSS class
  expect([...cells[0].classList]).toContain('is-flipped');
  //Fake timers in case of delay with settimeout for the flip animation
  jest.runAllTimers();
  //Now the image is there and visible
  expect(cells[0].innerHTML).toContain(gameState.gridCells[0]);
});

test('Once user click, Card gets flipped', () => {
  const cells = container.querySelectorAll('div[data-index]');
  //Nothing is flipped Yet ?
  expect([...cells[0].classList]).not.toContain('is-flipped');
  //Photo can't be seen in the DOM, so nobody can cheat by knowing what's the photo behind the hidden card
  expect(cells[0].innerHTML).not.toContain(gameState.gridCells[0]);
  //Good, then let's flip one card and see
  cells[0].click();
  //Yaaay, the card is flipped and have the right CSS class
  expect([...cells[0].classList]).toContain('is-flipped');
  //Fake timers in case of delay with settimeout for the flip animation
  jest.runAllTimers();
  //Now the image is there and visible
  expect(cells[0].innerHTML).toContain(gameState.gridCells[0]);
});

test('When cards match, add to openedCards[] & decrease their opacity', () => {
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.openedCards).toHaveLength(0);
  expect([...cells[0].classList]).not.toContain('is-opacity');
  cells[0].click();
  gameState.gridCells.some((cell, i) => {
    if (gameState.gridCells[0] === cell && i > 0) {
      cells[i].click();
      jest.runAllTimers();
      expect(gameState.openedCards).toHaveLength(2);
      expect([...cells[0].classList]).toContain('is-opacity');
      expect([...cells[i].classList]).toContain('is-opacity');
      return true;
    }
  });
});

test('When cards do not match, leave openedCards[] empty and unflip both', () => {
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.openedCards).toHaveLength(0);
  cells[0].click();
  gameState.gridCells.some((cell, i) => {
    if (gameState.gridCells[0] !== cell && i > 0) {
      cells[i].click();
      jest.runAllTimers();
      expect(gameState.openedCards).toHaveLength(0);
      expect([...cells[0].classList]).not.toContain('is-opacity');
      expect([...cells[i].classList]).not.toContain('is-opacity');
      return true;
    }
  });
});

test('isLocked on double click, do NOT trigger event listener', () => {
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.isLocked(0)).toBe(false);
  expect(gameState.isLocked(1)).toBe(false);
  cells[0].click();
  expect(gameState.isLocked(0)).toBe(true);
  cells[1].click();
  expect(gameState.isLocked(1)).toBe(true);
});

test('winning situation on 2x2 grid ? Will status be FINISHED and reset happen', () => {
  gameState.init(container, 2);
  const cells = container.querySelectorAll('div[data-index]');
  expect(gameState.openedCards).toHaveLength(0);
  cells[0].click();
  gameState.gridCells.some((cell, i) => {
    if (gameState.gridCells[0] === cell && i > 0) {
      cells[i].click();
      return true;
    }
  });
  expect(gameState.openedCards).toHaveLength(2);
  gameState.gridCells.forEach((_, i) =>
    gameState.openedCards.indexOf(i) === -1 ? cells[i].click() : null
  );
  expect(gameState.openedCards).toHaveLength(4);
  expect(gameState.current).toEqual('FINISHED');
  gameState.reset();
  expect(gameState.current).toEqual('INIT');
  expect(gameState.openedCards).toHaveLength(0);
});
