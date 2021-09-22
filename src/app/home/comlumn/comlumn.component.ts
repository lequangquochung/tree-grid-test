import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comlumn',
  templateUrl: './comlumn.component.html',
  styleUrls: ['./comlumn.component.scss'],
})
export class ComlumnComponent implements OnInit {
  @Input() type: any | undefined;
  @Input() column: any | undefined;
  @Output() columnEmitter = new EventEmitter<any>();

  constructor(private modalService: NgbModal) {}
  columnName: string = '';
  columnTitle: string = '';
  ngOnInit(): void {
    this.columnTitle = this.type === 'add' ? 'Add' : 'Edit';
    console.log(this.column);
    if (this.type === 'edit') this.columnName = this.column?.text;
  }

  close() {
    this.columnEmitter.emit({ event: false });
  }

  saveColumn() {
    this.columnEmitter.emit({
      event: {
        type: this.type,
        column: {
          ...this.column,
          text: this.columnName,
        },
      },
    });
  }
}
