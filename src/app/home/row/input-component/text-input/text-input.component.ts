import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class RowInputComponent implements OnInit {
  @Input() declare formControl: any;
  @Input() declare columnInfo: any;

  declare inputType: string;

  constructor() {}

  ngOnInit(): void {
    switch (this.columnInfo.type) {
      case 'number':
        this.inputType = 'number';
        break;
      case 'date':
        this.inputType = 'date';
        break;
      default:
        this.inputType = 'text';
        break;
    }
  }

  datePickerOnChange(value: any) {
    this.formControl.setValue(value);
  }

  valueOnChange(event: any): void {
    let value = event.target.value;
    if (this.inputType == 'number') {
      if (value < 0 || isNaN(value)) {
        event.target.value = 0;
        return;
      }
    }
    this.formControl.setValue(value);
  }

  onInput(event: any) {
    if (this.inputType == 'number') {
      if (Number.isNaN(event.key)) {
        return false;
      }
    }
    return true;
  }
}
