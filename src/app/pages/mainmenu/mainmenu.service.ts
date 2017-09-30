import { Injectable } from '@angular/core';

@Injectable()
export class MainmenuService {
  selectedItem = 0;

  constructor() { }

  setSelectedItem(n: number) {
    this.selectedItem = n;
  }
  getSelectedItem(): number {
    return this.selectedItem;
  }
}
