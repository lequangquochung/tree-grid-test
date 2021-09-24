import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() frozenColumnsInput: Number | undefined;
  @Input() toggleFilterInput: Boolean | undefined;
  @Input() dataColumnInput: Array<any> = [];
  @Output() settingEmitter = new EventEmitter<any>();

  constructor() { }
  frozenColumn: Number | undefined = 0;
  toggleFilter: Boolean | undefined = false;
  arrayOptionFrozen: Array<any> = []
  ngOnInit(): void {
    this.frozenColumn = this.frozenColumnsInput;
    this.toggleFilter = this.toggleFilterInput;
    this.arrayOptionFrozen = [{ title: "None", value: 0 }];

    this.dataColumnInput.map((e, index) => {
      if (index < this.dataColumnInput.length - 1)
        this.arrayOptionFrozen.push({ title: e.headerText, value: index + 1 })
    })

  }
  close() {
    this.settingEmitter.emit();
  }
  saveSettings() {
    this.settingEmitter.emit({
      frozenColumns: this.frozenColumn,
      toggleFilter: this.toggleFilter
    });
  }
}
