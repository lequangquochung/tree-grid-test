import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class RowInputComponent implements OnInit {
  @Input() declare formControl: any;
  @Input() declare columnInfo: any;
  // @Output() valueChange = new EventEmitter<any>();

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

  valueOnChange(event: any): void {
    let value = event.target.value;
    if (this.inputType == 'number') {
      if (value < 0) {
        event.target.value = 0;
        return;
      }
    }
    this.formControl.setValue(value);
  }

  handleFocusOut(event: any) {
    this.formControl.touched = true;
  }
}
