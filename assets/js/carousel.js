const SCROLL_RATE = 20;

const carouselEls = document.querySelectorAll('.carousel');

if (carouselEls && carouselEls.length) {

  carouselEls.forEach((el) => {
    const carousel = new Carousel(el);
  });
}


/*
* Class Carousel
*   el
*   contentEl
*   windowWidth
*   imageEls: [image1, image2]
*   activeIndex
*   prevIndex
*   navButtons: { leftButtonEl, rightButtonEl }
*   navLeadersEl,
*   navLeaderEls: [],
*/

function Carousel(el) {
  const self = this;
  this.el = el;
  this.contentEl = el.querySelector('.carousel-content');
  this.windowWidth = this.contentEl.getBoundingClientRect().width;
  this.imageEls = Array.from(this.contentEl.children);
  this.activeIndex = 0;
  this.prevIndex = 0;

  (
    {
      navButtons: this.navButtons,
      navLeadersEl: this.navLeadersEl,
      navLeaderEls: this.navLeaderEls,
    } = addNavigationElements(self, this.el)
  );

  onScrollCompletion(self);
}

function updateNavButtonVisibility(self) {
  const leftBtn = self.navButtons.leftButtonEl;
  const rightBtn = self.navButtons.rightButtonEl;

  if (leftBtn.classList.contains('hidden')) {
    leftBtn.classList.remove('hidden');
  }

  if (rightBtn.classList.contains('hidden')) {
    rightBtn.classList.remove('hidden');
  }

  if (self.activeIndex === 0) {
    self.navButtons.leftButtonEl.classList.add('hidden');
    return;
  }

  if (self.activeIndex === self.imageEls.length - 1 ) {
    self.navButtons.rightButtonEl.classList.add('hidden');
    return;
  }
}

function updateLeaderPosition(self) {
  self.navLeaderEls.forEach((leaderEl, index) => {
    if (index === self.activeIndex) {
      leaderEl.classList.add('nav-leader--active');
      return;
    }
    leaderEl.classList.remove('nav-leader--active');
  });
}

function onScrollCompletion(self) {
  updateNavButtonVisibility(self);
  updateLeaderPosition(self);
}

function addButtonMovementListener(self, buttonEl, isRightScroll=true) {
  buttonEl.addEventListener('click', () => {
    self.activeIndex += isRightScroll ? 1 : -1;
    animateScroll(self);

    onScrollCompletion(self);
  });
}

function addLeaderMovementListener(self, leaderEls) {
  leaderEls.forEach((leaderEl, index) => {
    leaderEl.addEventListener('click', (e) => {
      if (self.activeIndex === index) return;

      self.activeIndex = Array.from(leaderEl.parentNode.children).indexOf(leaderEl);
      animateScroll(self);

      onScrollCompletion(self);
  })
  })
}

function addNavigationElements(self, el) {
  const navButtons = addNavigationButtons(self, el);
  const { navLeadersEl, navLeaderEls } = addNavigationLeaders(self, el);

  return { navButtons, navLeadersEl, navLeaderEls };
}

function addNavigationButtons(self, el) {
  const leftButtonEl = document.createElement('button');
  const rightButtonEl = document.createElement('button');

  leftButtonEl.classList.add('carousel__left-btn')
  leftButtonEl.innerHTML = '<';

  rightButtonEl.classList.add('carousel__right-btn')
  rightButtonEl.innerHTML = '>';

  el.appendChild(leftButtonEl);
  el.appendChild(rightButtonEl);

  addButtonMovementListener(self, rightButtonEl);
  addButtonMovementListener(self, leftButtonEl, false);

  return { leftButtonEl, rightButtonEl };
}

function addNavigationLeaders(self, el) {
  const navLeadersEl = document.createElement('div');
  const imagesNumber = self.contentEl.children.length;
  const navLeaderEls = [];

  navLeadersEl.classList.add('nav-leaders');

  for (let i = 0; i < imagesNumber; i++) {
    const navLeaderEl = document.createElement('button');
    navLeaderEl.classList.add(
      'nav-leader',
      i === 0 ? 'nav-leader--active' : null,
    );
    navLeadersEl.appendChild(navLeaderEl);
    navLeaderEls.push(navLeaderEl);
  }

  addLeaderMovementListener(self, navLeaderEls);

  el.appendChild(navLeadersEl);

  return {navLeadersEl, navLeaderEls};
}

function animateScroll(self) {
  if (self.activeIndex === self.prevIndex) return;

  const firstImg = self.imageEls[0];
  let finalVal = -1 * self.activeIndex * self.windowWidth;
  let initialVal = -1 * self.prevIndex * self.windowWidth;

  let direction = (self.activeIndex > self.prevIndex) ? -1 : 1;
  let increment = Math.abs(self.activeIndex - self.prevIndex) * (self.windowWidth/SCROLL_RATE) * direction;

  animate(initialVal);

  function animate(val) {
    firstImg.style.marginLeft = val + 'px';
    if (Math.floor(Math.abs(finalVal - val)) === 0 ) return;
    window.requestAnimationFrame(() => animate(val + increment));
  }

  self.prevIndex = self.activeIndex;
  firstImg.style.marginLeft = finalVal + 'px';
}
