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

  // declare formInput: FormGroup;
  declare form: FormGroup;

  cols: any[] = [];
  sortingType: boolean = false;
  rowSelected: any[] = [];

  columnName: string = '';
  columnTitle: string = '';
  columnType: string = '';
  // columnTypeData: any = ['Text', 'Num', 'Date', 'Boolean', 'DropDownList'];
  columnTypeData: any = [
    { id: 'text', text: 'Text' },
    { id: 'number', text: 'Num' },
    { id: 'date', text: 'Date' },
    { id: 'boolean', text: 'Boolean' },
    { id: 'dropdown', text: 'DropDownList' },
  ];
  fields: Object = { text: 'text', value: 'id' };

  alignType: any = ['Left', 'Center', 'Right'];
  textWrapType: any = ['normal', 'break-word'];

  allowChangeDefaultValue = true;
  // hasDefaultValue = false;
  defaultValue: any = null;
  // minWidth:any = 20;

  dropdownItem: any[] = [];
  dropDownItemString: string[] = [];
  declare oldDropDownItem: any[];
  declare errorMsg: string;

  dataDefaultValue = {
    width: 150,
    minWidth: 150,

    fontSize: 14,
    textAlign: 'Left',
    allowEditing: true,

    color: '#757575',
    backgroundColor: '#fff',
    textWrap: 'normal',
    // customAttributes: { class: `header-column-font${this.dataColumn.length + 1}` }
  };

  constructor() {}

  ngOnInit(): void {
    this.columnTitle = this.type === 'add' ? 'Add' : 'Edit';

    const fb = new FormBuilder();
    this.form = fb.group({
      minWidth: [this.dataDefaultValue.minWidth, Validators.required],
      fontSize: [this.dataDefaultValue.fontSize, Validators.required],
      color: [this.dataDefaultValue.color, Validators.required],
      backgroundColor: [this.dataDefaultValue.backgroundColor, Validators.required],
      textAlign: [this.dataDefaultValue.textAlign, Validators.required],
      textWrap: [this.dataDefaultValue.textWrap, Validators.required],
    });
  }

  close() {
    this.columnEmitter.emit();
  }

  onChangeColumnType(args: any): void {
    console.log(args);
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
      // hasDefaultValue: this.hasDefaultValue,
      defaultValue: this.defaultValue,
      minWidth: this.form.controls['minWidth'].value,
      fontSize: this.form.controls['fontSize'].value,
      color: this.form.controls['color'].value,
      backgroundColor: this.form.controls['backgroundColor'].value,
      textAlign: this.form.controls['textAlign'].value,
      textWrap: this.form.controls['textWrap'].value,
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

      // if (this.getFormValue('type') == 'boolean') {
      //   this.setFormValue(this.getFormValue('defaultValue') ? true : false, 'defaultValue');
      // }

      const dropDownItem = this.dropdownItem.map((each) => each.name);
      columnTarget['dropDownItem'] = dropDownItem;
    }

    if (this.columnType == 'boolean') {
      columnTarget.defaultValue = this.defaultValue ? true : false;
    }

    if (columnTarget.columnType.includes('text')) {
      columnTarget.columnType = 'string';
    }
    // console.log(columnTarget.columnType);
    // console.log(columnTarget.textWrap)
    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: columnTarget,
      },
    });
  }

  onCheckboxChange(e: any) {
    // const colArr: FormArray = this.form.get('colArr') as FormArray;

    if (e.target.checked) {
      let param = {
        name: e.target.value,
        isChecked: true,
      };
      this.rowSelected.push(param);
      // console.log(this.rowSelected);
    } else {
      for (let i = 0; i < this.rowSelected.length; i++) {
        if (this.rowSelected[i]['name'] === e.target.value) {
          this.rowSelected[i]['isChecked'] = false;
        }
      }
      // console.log(this.rowSelected);
    }
  }

  addDropdownItem() {
    const addedDropDownItem = { name: 'new item', id: getUid('') };
    this.dropdownItem.push(addedDropDownItem);
    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  dropDownItemChange(event: any, id: number) {
    const editTargerItem = this.dropdownItem.find((item) => item.id == id);
    editTargerItem.name = event.target.value.trim();
    this.dropDownItemString = this.dropdownItem.map((each) => each.name);
  }

  deleteDropDownItem(id: number) {
    this.defaultValue = null;
    this.dropdownItem = this.dropdownItem.filter((item) => item.id != id);
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

  setNumberValue(event: any, target: string) {
    const numVal = Number.parseFloat(event.target.value);
    this.setFormValue(numVal, target);
  }

  getFormValue(target: string) {
    return this.form.controls[target].value;
  }

  setFormValue(value: any, target: string) {
    if (target === 'textWrap') {
      if (value.target.checked) {
        let textWrapValue = (this.dataDefaultValue.textWrap = 'break-word');
        this.form.controls[target].setValue(textWrapValue);
      } else {
        let textWrapValue = (this.dataDefaultValue.textWrap = 'normal');
        this.form.controls[target].setValue(textWrapValue);
      }
    } else {
      this.form.controls[target].setValue(value);
    }
  }
}
