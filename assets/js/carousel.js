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
    const firstImg = self.imageEls[0];
    const marginLeft = parseInt(firstImg.style.marginLeft);

    // set left boundary limit
    if (!isRightScroll && (!marginLeft || Math.abs(marginLeft) < 10)) return ;
    // set right boundary limit
    if (isRightScroll && (Math.abs(marginLeft) > ((self.imageEls.length - 2) * self.windowWidth))) {
      return;
    }

    self.activeIndex += isRightScroll ? 1 : -1;

    const scrollDistance = isRightScroll ? -self.windowWidth : self.windowWidth;
    firstImg.style.marginLeft = (marginLeft || 0) + scrollDistance + 'px';
    onScrollCompletion(self);
  });
}

function addLeaderMovementListener(self, leaderEls) {
  leaderEls.forEach((leaderEl, index) => {
    leaderEl.addEventListener('click', (e) => {
      if (self.activeIndex === index) return;

      self.activeIndex = Array.from(leaderEl.parentNode.children).indexOf(leaderEl);
      const firstImg = self.imageEls[0];

      firstImg.style.marginLeft = -self.activeIndex * self.windowWidth + 'px';
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
