import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  bgClass: string | undefined = 'book';
  canSpan: boolean | undefined = undefined;
  coolDown: boolean = false;
  isHeld: boolean = false;
  lastMousePosX: number | undefined;
  ul: HTMLElement | null = null;
  constructor() {}
  ngOnInit(): void {
    window.addEventListener('resize', this.setScrollInit);
    this.ul = document.querySelector('.list');
    this.setScrollInit();
  }

  setScrollInit(): void {
    const ul: HTMLUListElement | null = document.querySelector('.list');
    if (!ul) return;
    const { offsetWidth, scrollWidth } = ul;
    const scrollwidth = scrollWidth - offsetWidth;
    ul.scrollLeft = scrollwidth / 2;
  }
  firstInitCheck() {
    if (this.canSpan === undefined) {
      this.canSpan = false;
      return;
    }
  }
  resetElements = () => {
    const right: HTMLElement | null = document.querySelector(
      '.list .right article'
    );
    const left: HTMLElement | null = document.querySelector(
      '.list .left article'
    );
    const active: HTMLElement | null = document.querySelector(
      '.list .active article'
    );
    right?.removeAttribute('style');
    left?.removeAttribute('style');
    active?.removeAttribute('style');
  };
  checkScrollPosition(scrollLeft: number, scrollwidth: number) {
    const right: HTMLElement | null = document.querySelector(
      '.list .right article'
    );
    const left: HTMLElement | null = document.querySelector(
      '.list .left article'
    );
    const active: HTMLElement | null = document.querySelector(
      '.list .active article'
    );
    if (!right || !left || !active) return null;

    if (scrollLeft <= (scrollwidth * 30) / 100) {
      this.resetElements();
      return 0;
    }
    if (
      scrollLeft > scrollwidth / 2 &&
      scrollLeft >= (scrollwidth * 70) / 100
    ) {
      this.resetElements();
      return 2;
    }

    const length = scrollwidth * 0.7;
    const myscrollLeft = scrollLeft - scrollwidth * 0.15;
    const op = myscrollLeft / length;
    if (op > 0.5) {
      const style = {
        right: {
          scale: op >= 1 ? 1 : 0.7 + (op - 0.5),
          left: (op - 0.5) * -100,
          opacity: Math.round((0.5 + (op - 0.5)) * 100) / 100,
        },
        left: {
          opacity: Math.round((0.5 - (op - 0.5)) * 100) / 100,
          scale: 0.7 - (op - 0.5),
        },
        active: {
          opacity: Math.round((1 - (op - 0.5)) * 100) / 100,
          scale: op >= 1 ? 0.7 : 1 - (op - 0.5),
          left: (op - 0.5) * -100,
        },
      };
      right.style.transform = `scale(${style.right.scale})`;
      active.style.transform = `scale(${style.active.scale})`;
      left.style.transform = `scale(${style.left.scale})`;

      right.style.left = `${style.right.left}%`;
      active.style.left = `${style.active.left}%`;

      left.style.opacity = `${style.left.opacity}`;
      right.style.opacity = `${style.right.opacity}`;
      active.style.opacity = `${style.active.opacity}`;
    } else if (op < 0.5) {
      const style = {
        left: {
          scale: 1.2 - op >= 1 ? 1 : 1.2 - op,
          left: (op - 0.5) * -100,
          opacity: Math.round((0.5 + (0.5 - op)) * 100) / 100,
        },
        right: {
          opacity: Math.round((0.5 - (0.5 - op)) * 100) / 100,
          scale: 0.7 - (0.5 - op),
        },
        active: {
          opacity: Math.round((1 - (0.5 - op)) * 100) / 100,
          scale: op <= 0 ? 0.7 : 1 - (0.5 - op),
          left: (op - 0.5) * -100,
        },
      };
      left.style.transform = `scale(${style.left.scale})`;
      right.style.transform = `scale(${style.right.scale})`;
      active.style.transform = `scale(${style.active.scale})`;

      left.style.left = `${style.left.left}%`;
      active.style.left = `${style.active.left}%`;

      left.style.left = `${style.left.left}%`;

      right.style.opacity = `${style.right.opacity}`;
      left.style.opacity = `${style.left.opacity}`;
      active.style.opacity = `${style.active.opacity}`;
    }
    this.canSpan = false;
    return null;
  }

  reOrderCards(index: number) {
    const right = document.querySelector('.list .right');
    const left = document.querySelector('.list .left');
    const active = document.querySelector('.list .active');

    if (!index) {
      left?.classList.replace('left', 'active');
      right?.classList.replace('right', 'left');
      active?.classList.replace('active', 'right');
    } else if (index === 2) {
      left?.classList.replace('left', 'right');
      right?.classList.replace('right', 'active');
      active?.classList.replace('active', 'left');
    }
  }

  checkCoolDown() {
    if (!this.coolDown || !this.ul) return false;
    this.ul?.classList.add('pause');
    this.setScrollInit();
    return true;
  }

  mouseDownHandler() {
    this.isHeld = true;
  }
  mouseUpHandler() {
    this.isHeld = false;
    this.setScrollInit();
    this.resetElements();
  }

  dragHandler(e: MouseEvent): void {
    if (!this.isHeld) return;
    const { clientX, clientY } = e;
    if (this.lastMousePosX === undefined) {
      this.lastMousePosX = clientX;
      return;
    }
    let op: number;
    if (clientX > this.lastMousePosX) op = -10;
    else if (clientX < this.lastMousePosX) op = 10;
    else return;
    this.lastMousePosX = clientX;
    if (!this.ul) return;
    this.ul.scrollLeft += op;
  }

  scrollHandler(): void {
    // ignore first scroll
    this.firstInitCheck();
    if (!this.ul) return;
    const isCooldown = this.checkCoolDown();
    if (isCooldown) return;
    let index = 1;
    this.canSpan = true;
    const { scrollLeft, offsetWidth, scrollWidth } = this.ul;
    const scrollwidth = scrollWidth - offsetWidth;

    const checkPos = this.checkScrollPosition(scrollLeft, scrollwidth);
    if (checkPos === null) return;
    this.coolDown = true;
    this.canSpan = false;
    index = checkPos;
    this.reOrderCards(index);
    const activeChild: HTMLElement | null = document.querySelector(
      '.list .active article'
    );
    this.bgClass = activeChild?.className;
    this.ul.scrollLeft = scrollwidth / 2;
    index = 1;
    setTimeout(() => {
      this.ul?.classList.remove('pause');
      this.coolDown = false;
    }, 250);
  }
}
