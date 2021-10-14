import { map } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUid } from '@syncfusion/ej2-grids';

@Component({
  selector: 'app-comlumn',
  templateUrl: './comlumn.component.html',
  styleUrls: ['./comlumn.component.scss'],
})
export class ComlumnComponent implements OnInit {
  @Input() type: any | undefined;
  @Input() column: any | undefined;
  @Input() columnChecked: any | undefined;
  @Output() columnEmitter = new EventEmitter<any>();

  declare form: FormGroup;

  cols: any[] = [];
  sortingType: boolean = false;
  rowSelected: any[] = [];

  columnName: string = '';
  columnTitle: string = '';
  columnType: string = 'text';
  columnTypeData: any = ['text', 'number', 'date', 'boolean', 'dropdown'];

  dropdownItem: any[] = [];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    const fb = new FormBuilder();
    this.form = fb.group({
      colArr: fb.array([]),
    });

    this.columnTitle = this.type === 'add' ? 'Add' : 'Edit';
    if (this.type === 'edit') {
      this.columnName = this.column?.text;
      this.columnType = this.column.columnType;
      if (this.columnType == 'dropdown') {
        this.column.dropDownItem.forEach((each: any) => {
          this.dropdownItem.push({ name: each, id: getUid('') });
        });
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
    this.columnEmitter.emit({ event: false });
  }

  onChangeColumnType(args: any): void {
    this.columnType = args.value;
    if (this.columnType == 'dropdown') {
      this.dropdownItem = [];
    }
  }

  addDropdownItem() {
    this.dropdownItem.push({ name: 'new item', id: getUid('') });
  }

  dropDownItemChange(event: any, id: number) {
    this.dropdownItem.find((item) => item.id == id).name = event.target.value.trim();
  }

  deleteDropDownItem(id: number) {
    this.dropdownItem = this.dropdownItem.filter((item) => item.id != id);
  }

  declare dropDownItemError: string;
  saveColumn() {
    this.dropDownItemError = '';
    const columnTarget: any = {
      ...this.column,
      text: this.columnName,
      columnType: this.columnType,
    };

    if (this.columnType == 'dropdown') {
      if (this.dropdownItem.length == 0) {
        this.dropDownItemError = 'must have at least 1 option for dropdown item';
        return;
      }

      let isDropdownItemError = false;

      this.dropdownItem.every((each) => {
        if (each.name == '') {
          this.dropDownItemError = `dropdown item can't be empty`;
          isDropdownItemError = true;
          return false;
        }

        if (this.dropdownItem.filter((i) => i.id != each.id).findIndex((i) => i.name == each.name) >= 0) {
          this.dropDownItemError = 'duplicate dropdown item';
          isDropdownItemError = true;
          return false;
        }
        return true;
      });

      if (isDropdownItemError) {
        return;
      }

      const dropDownItem = this.dropdownItem.map((each) => each.name);
      columnTarget['dropDownItem'] = dropDownItem;
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

  mutipleSorting() {
    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: [...this.rowSelected],
      },
    });
  }
}
