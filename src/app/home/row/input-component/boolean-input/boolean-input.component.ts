import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './boolean-input.component.html',
  styleUrls: ['./boolean-input.component.scss'],
})
export class BooleanInputComponent implements OnInit {
  @Input() declare formControl: any;
  @Input() declare columnInfo: any;

  constructor() {}

  ngOnInit(): void {
    this.formControl.setValue(this.formControl.value ? true : false);
  }

  checkboxOnChange(event: any) {
    this.formControl.setValue(event.target.checked);
    // console.log(event.target.checked)
  }
}
