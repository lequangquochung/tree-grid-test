import { map } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUid } from '@syncfusion/ej2-grids';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-comlumn',
  templateUrl: './comlumn.component.html',
  styleUrls: ['./comlumn.component.scss'],
})
export class ComlumnComponent implements OnInit {
  @Input() declare type: any;
  @Input() declare column: any;
  @Input() declare columnChecked: any;
  @Output() columnEmitter = new EventEmitter<any>();

  declare form: FormGroup;

  cols: any[] = [];
  sortingType: boolean = false;
  rowSelected: any[] = [];

  columnName: string = '';
  columnTitle: string = '';
  columnType: string = '';
  columnTypeData: any = ['text', 'number', 'date', 'boolean', 'dropdown'];

  allowChangeDefaultValue = true;
  hasDefaultValue = false;
  defaultValue: any = null;

  dropdownItem: any[] = [];
  dropDownItemString: string[] = [];
  declare oldDropDownItem: any[];
  declare errorMsg: string;

  constructor() {}

  ngOnInit(): void {
    const fb = new FormBuilder();
    this.form = fb.group({
      colArr: fb.array([]),
    });

    this.columnTitle = this.type === 'add' ? 'Add' : 'Edit';
    if (this.type === 'edit') {
      console.log(this.column);

      this.columnName = this.column?.text;
      this.columnType = this.column.columnType == 'string' ? 'text' : this.column.columnType;
      this.allowChangeDefaultValue = this.column.allowEditing;
      this.hasDefaultValue = this.column.hasDefaultValue ? true : false;
      if (this.hasDefaultValue) {
        this.defaultValue = this.column.defaultValue;
      }

      if (this.columnType == 'dropdown') {
        this.oldDropDownItem = [];
        this.column.dropDownItem.forEach((each: any) => {
          const dropDownItem = { name: each, id: getUid('') };
          this.dropdownItem.push({ ...dropDownItem });
          this.oldDropDownItem.push({ ...dropDownItem });
        });
        this.dropDownItemString = this.dropdownItem.map((each) => each.name);
      }
    } else if (this.type === 'mutiple-sorting') {
      this.sortingType = true;
      this.columnTitle = 'Multil Sorting';
      this.getColumns(this.column, 'field');
      this.columnChecked.forEach((each: any) => {
        this.cols.find((col) => col.colName == each.name).isChecked = each.isChecked;
      });

      this.rowSelected = [...this.columnChecked];
    } else {
      this.sortingType = false;
    }
  }

  close() {
    this.columnEmitter.emit();
  }

  onChangeColumnType(args: any): void {
    this.columnType = args.value;
    this.dropdownItem = [];
    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  defaultValueChange(event: any) {
    switch (this.columnType) {
      case 'dropdown':
        this.defaultValue = event.itemData.value;
        break;
      case 'date':
        this.defaultValue = event;
        break;
      case 'boolean':
        this.defaultValue = event.target.checked;
        break;
      case 'number':
        if (event.target.value < 0) {
          event.target.value = 0;
        }
        this.defaultValue = event.target.value;
        break;
      default:
        this.defaultValue = event.target.value;
        break;
    }
  }

  getColumns(arr: any[], key: any): any {
    let array: any[] = [];
    Object.keys(arr).forEach(function eachKey(index) {
      let isVisible = arr[index]['visible'] === false ? false : true;

      if (isVisible) {
        let param = {
          name: arr[index][key],
          headerText: arr[index]['headerText'],
        };
        array.push(param);
      }
    });
    this.cols = array.map((col) => {
      return {
        colName: col.name,
        isChecked: false,
        header: col.headerText,
      };
    });
    return this.cols;
  }

  saveColumn() {
    this.errorMsg = '';
    const columnTarget: any = {
      ...this.column,
      text: this.columnName,
      columnType: this.columnType,
      hasDefaultValue: this.hasDefaultValue,
      defaultValue: null,
    };

    if (this.columnType == 'dropdown') {
      if (this.dropdownItem.length == 0) {
        this.errorMsg = 'must have at least 1 option for dropdown item';
        return;
      }

      let isError = false;

      this.dropdownItem.every((each) => {
        if (each.name == '') {
          this.errorMsg = `dropdown item can't be empty`;
          isError = true;
          return false;
        }

        if (this.dropdownItem.filter((i) => i.id != each.id).findIndex((i) => i.name == each.name) >= 0) {
          this.errorMsg = 'duplicate dropdown item';
          isError = true;
          return false;
        }
        return true;
      });

      if (isError) {
        return;
      }

      const dropDownItem = this.dropdownItem.map((each) => each.name);
      columnTarget['oldDropDownItem'] = this.oldDropDownItem;
      columnTarget['dropDownItem'] = dropDownItem;
    }

    if (columnTarget.hasDefaultValue) {
      if (this.columnType == 'boolean') {
        this.defaultValue = this.defaultValue ? true : false;
      }
      const formControlValidator = new FormControl(this.defaultValue, Validators.required);
      if (formControlValidator.invalid) {
        this.errorMsg =
          '  The entered data does not match the data type, please review the Column Type to check the data type';
        return;
      }
      columnTarget.defaultValue = this.defaultValue;
    }

    if (columnTarget.columnType.includes('text')) {
      columnTarget.columnType = 'string';
    }

    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: columnTarget,
      },
    });
  }

  onCheckboxChange(e: any) {
    const colArr: FormArray = this.form.get('colArr') as FormArray;

    if (e.target.checked) {
      let param = {
        name: e.target.value,
        isChecked: true,
      };
      this.rowSelected.push(param);
      console.log(this.rowSelected);
    } else {
      for (let i = 0; i < this.rowSelected.length; i++) {
        if (this.rowSelected[i]['name'] === e.target.value) {
          this.rowSelected[i]['isChecked'] = false;
        }
      }
      console.log(this.rowSelected);
    }
  }

  addDropdownItem() {
    const addedDropDownItem = { name: 'new item', id: getUid('') };
    this.dropdownItem.push(addedDropDownItem);
    if (this.type == 'edit') {
      const matchedOldItem = this.oldDropDownItem.find((item) => item.name == addedDropDownItem.name);
      if (matchedOldItem) {
        matchedOldItem['changed'] = false;
        matchedOldItem['deleted'] = false;
      }
    }
    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  dropDownItemChange(event: any, id: number) {
    const editTargerItem = this.dropdownItem.find((item) => item.id == id);
    editTargerItem.name = event.target.value.trim();
    if (this.type == 'edit') {
      const editTargetOldItem = this.oldDropDownItem.find((item) => item.id == id);
      if (editTargetOldItem) {
        editTargetOldItem['changed'] = editTargerItem.name != editTargetOldItem.name;
        editTargetOldItem['itemNewValue'] = event.target.value.trim();
        return;
      }

      const matchedOldItem = this.oldDropDownItem.find((item) => item.name == editTargerItem.name);
      if (matchedOldItem) {
        matchedOldItem['changed'] = false;
        matchedOldItem['deleted'] = false;
      }
    }

    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  deleteDropDownItem(id: number) {
    this.dropdownItem = this.dropdownItem.filter((item) => item.id != id);
    if (this.type == 'edit') {
      const editTargetOldItem = this.oldDropDownItem.find((item) => item.id == id);
      editTargetOldItem['deleted'] = true;
    }

    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  mutipleSorting() {
    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: [...this.rowSelected],
      },
    });
  }
}
