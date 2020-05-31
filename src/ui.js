const PLACEHOLDER_IMG =
  'https://www.theyearinpictures.co.uk/images/image-placeholder.png';

export const getCardsFragment = (cells) => {
  const fragment = document.createDocumentFragment();
  cells.forEach((element, i) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    div.setAttribute('data-index', i);
    img.classList.add('is-placeholder');
    img.src = PLACEHOLDER_IMG;
    div.appendChild(img);
    fragment.appendChild(div);
  });
  return fragment;
};

export const flipImg = (el, path) => {
  el.classList.add('is-flipped');
  setTimeout(() => {
    const img = document.createElement('img');
    img.classList.add('is-tile');
    img.src = path;
    el.appendChild(img);
  }, 50);
};

export const unFlipByIndex = (container, index) => {
  const el = container.querySelector(`[data-index='${index}']`);
  setTimeout(() => {
    el.classList.remove('is-flipped');
    el.querySelector('.is-tile').remove();
  }, 50);
};

export const unflipCards = (container, ...indexes) => {
  console.log('indexes', indexes);
  indexes.forEach((i) => unFlipByIndex(container, i));
};

export const markAsSuccess = (container, ...indexes) =>
  indexes.forEach((index) =>
    container
      .querySelector(`[data-index='${index}']`)
      .classList.add('is-opacity')
  );
