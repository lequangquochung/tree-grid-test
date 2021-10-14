import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
})
export class DropdownInputComponent implements OnInit {
  @Input() declare formControl: any;
  @Input() declare columnInfo: any;

  constructor() {}

  ngOnInit(): void {}

  dropDownItemChanged(event: any) {
    this.formControl.setValue(event.itemData.value);
  }
}
