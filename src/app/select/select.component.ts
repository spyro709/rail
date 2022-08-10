import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  constructor() {}

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
