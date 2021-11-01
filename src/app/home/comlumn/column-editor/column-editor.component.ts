import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getUid } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-column-editor',
  templateUrl: './column-editor.component.html',
  styleUrls: ['./column-editor.component.scss'],
})
export class ColumnEditorComponent implements OnInit {
  @Input() targetColumn: any;
  @Input() declare isColumnHasValue: boolean;
  @Output() closeModal = new EventEmitter<any>();

  columnTypeData: any = ['text', 'number', 'date', 'boolean', 'dropdown'];
  alignType: any = ['Left', 'Center', 'Right'];
  textWrapType: any = ['normal', 'break-word'];

  dropDownDataTypeItem: any[] = [];
  oldDropDownItem: any[] = [];
  dropDownItemString: string[] = []; //this is for the default value of dropdown data type

  declare formInput: FormGroup;
  declare errMsg: string;
  declare isError: boolean;

  constructor() {}

  ngOnInit(): void {
    // if (this.isColumnHasValue) {
    //   this.columnTypeData = ['text'];
    //   if (this.targetColumn.type != 'string') {
    //     this.columnTypeData.push(this.targetColumn.type);
    //   }
    // }

    if (this.targetColumn.type == 'dropdown') {
      this.targetColumn.dropDownItem.forEach((each: any) => {
        const dropDownItem = { name: each, id: getUid('') };
        this.dropDownDataTypeItem.push({ ...dropDownItem });
        this.oldDropDownItem.push({ ...dropDownItem });
      });
      this.dropDownItemString = this.dropDownDataTypeItem.map((each) => each.name);
    }

    const fb = new FormBuilder();
    this.formInput = fb.group({
      type: [this.targetColumn.type == 'string' ? 'text' : this.targetColumn.type, Validators.required],
      headerText: [this.targetColumn.headerText, Validators.required],
      minWidth: [this.targetColumn.minWidth, Validators.required],
      fontSize: [this.targetColumn.fontSize, Validators.required],
      color: [this.targetColumn.color, Validators.required],
      backgroundColor: [this.targetColumn.backgroundColor, Validators.required],
      textAlign: [this.targetColumn.textAlign, Validators.required],
      textWrap: [this.targetColumn.textWrap, Validators.required],
      // hasDefaultValue: this.targetColumn.hasDefaultValue,
      defaultValue: this.targetColumn.defaultValue,
    });
  }

  save() {
    this.errMsg = '';
    this.isError = false;
    if (this.formInput.invalid) {
      this.isError = true;
      this.errMsg = 'Please fills all required field';
      return;
    }

    if (this.getFormValue('type') == 'dropdown') {
      if (this.dropDownDataTypeItem.length == 0) {
        this.isError = true;
        this.errMsg = 'must have at least 1 option for dropdown item';
        return;
      }
      this.dropDownDataTypeItem.every((each) => {
        if (each.name == '') {
          this.errMsg = `dropdown item can't be empty`;
          this.isError = true;
          return false;
        }

        if (this.dropDownDataTypeItem.filter((i) => i.id != each.id).findIndex((i) => i.name == each.name) >= 0) {
          this.errMsg = 'duplicate dropdown item';
          this.isError = true;
          return false;
        }
        return true;
      });

      if (this.isError) {
        return;
      }
    }
    if (this.getFormValue('type') == 'boolean') {
      this.setFormValue(this.getFormValue('defaultValue') ? true : false, 'defaultValue');
    }

    // if (this.getFormValue('hasDefaultValue')) {
    //   if (this.getFormValue('type') == 'boolean') {
    //     this.setFormValue(this.getFormValue('defaultValue') ? true : false, 'defaultValue');
    //   } else if (!this.getFormValue('defaultValue')) {
    //     this.isError = true;
    //     this.errMsg = 'Please input default value for this column';
    //     return;
    //   }
    // }
    const editedColumn = this.formatNewColumnValue(this.formInput.value);
    this.closeModal.emit(editedColumn);
  }

  formatNewColumnValue(value: any) {
    const newColumnValue = {
      ...value,
      type: value.type == 'text' ? 'string' : value.type,
    };

    if (this.getFormValue('type') == 'dropdown') {
      newColumnValue['oldDropDownItem'] = this.oldDropDownItem;
      newColumnValue['dropDownItem'] = this.dropDownItemString;
    }
    return newColumnValue;
  }

  dataTypeOnChange(event: any) {
    this.setFormValue(event.value, 'type');
    this.setFormValue(null, 'defaultValue');
  }

  addDropdownItem() {
    const addedDropDownItem = { name: 'new item', id: getUid('') };
    this.dropDownDataTypeItem.push(addedDropDownItem);

    const matchedOldItem = this.oldDropDownItem.find((item) => item.name == addedDropDownItem.name);
    if (matchedOldItem) {
      matchedOldItem['changed'] = false;
      matchedOldItem['deleted'] = false;
    }

    this.dropDownItemString = this.dropDownDataTypeItem.map((each) => each.name);
  }

  dropDownItemChange(event: any, id: number) {
    const editTargetItem = this.dropDownDataTypeItem.find((item) => item.id == id);
    editTargetItem.name = event.target.value.trim();

    const editTargetOldItem = this.oldDropDownItem.find((item) => item.id == id);

    if (editTargetOldItem) {
      editTargetOldItem['changed'] = editTargetItem.name != editTargetOldItem.name;
      editTargetOldItem['itemNewValue'] = event.target.value.trim();
    } else {
      const matchedOldItem = this.oldDropDownItem.find((item) => item.name == editTargetItem.name);
      if (matchedOldItem) {
        matchedOldItem['changed'] = false;
        matchedOldItem['deleted'] = false;
      }
    }

    this.dropDownItemString = this.dropDownDataTypeItem.map((each) => each.name);
  }

  deleteDropDownItem(id: number) {
    this.setFormValue(null, 'defaultValue');
    this.dropDownDataTypeItem = this.dropDownDataTypeItem.filter((item) => item.id != id);
    const editTargetOldItem = this.oldDropDownItem.find((item) => item.id == id);
    if (editTargetOldItem) {
      editTargetOldItem['deleted'] = true;
    }

    this.dropDownItemString = this.dropDownDataTypeItem.map((each) => each.name);
  }

  setNumberValue(event: any, target: string) {
    const numVal = Number.parseFloat(event.target.value);
    this.setFormValue(numVal, target);
  }

  setFormValue(value: any, target: string) {
    this.formInput.controls[target].setValue(value);
  }

  getFormValue(target: string) {
    return this.formInput.controls[target].value;
  }

  close() {
    this.closeModal.emit(false);
  }
}
