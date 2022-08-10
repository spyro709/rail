import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  el: any;
  constructor() {
    this.el = document.querySelector('.book');
  }

  ngOnInit(): void {}

  hoverHandler() {
    document.querySelector('.book')?.classList.add('small');
    document.querySelector('.movie')?.classList.add('in');
  }
  leaveHanlder() {
    document.querySelector('.book')?.classList.remove('small');
    document.querySelector('.movie')?.classList.remove('in');
  }
}
