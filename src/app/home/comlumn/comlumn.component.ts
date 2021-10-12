import { map } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comlumn',
  templateUrl: './comlumn.component.html',
  styleUrls: ['./comlumn.component.scss'],
})
export class ComlumnComponent implements OnInit {
  @Input() type: any | undefined;
  @Input() column: any | undefined;
  @Input() columnChecked: any | undefined;

  declare form: FormGroup;
  cols: any[] = [];
  sortingType: boolean = false;
  rowSelected: any[] = [];

  @Output() columnEmitter = new EventEmitter<any>();
  columnTypeData: any = ['string', 'number', 'date'];
  constructor(private modalService: NgbModal) {}
  columnName: string = '';
  columnType: string = 'string';
  columnTitle: string = '';

  ngOnInit(): void {
    // console.log(this.column)
    const fb = new FormBuilder();

    this.form = fb.group({
      colArr: fb.array([]),
    });
    console.log(this.columnChecked);

    this.columnTitle = this.type === 'add' ? 'Add' : 'Edit';
    if (this.type === 'edit') {
      this.columnName = this.column?.text;
    } else if (this.type === 'mutiple-sorting') {
      this.sortingType = true;
      this.columnTitle = 'Multil Sorting';
      this.getColumns(this.column, 'field');
      this.columnChecked.forEach((each: any) => {
        console.log(each);
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
  }

  saveColumn() {
    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: {
          ...this.column,
          text: this.columnName,
          columnType: this.columnType,
        },
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

  getColumns(arr: any[], key: any): string[] {
    let array: string[] = [];
    Object.keys(arr).forEach(function eachKey(index) {
      let isVisible = arr[index]['visible'] === false ? false : true;

      if (isVisible) {
        let name = arr[index][key];
        array.push(name);
      }
    });
    this.cols = array.map((col) => {
      return {
        colName: col,
        isChecked: false,
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
