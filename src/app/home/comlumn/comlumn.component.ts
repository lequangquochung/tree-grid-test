import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comlumn',
  templateUrl: './comlumn.component.html',
  styleUrls: ['./comlumn.component.scss'],
})
export class ComlumnComponent implements OnInit {
  @Input() listColumnData: any | undefined;
  @Output() columnEmitter = new EventEmitter<any>();

  constructor(private modalService: NgbModal) {}
  columnName: string = '';

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveColumn() {
    this.columnEmitter.emit([
      ...this.listColumnData,
      { field: this.columnName.trim(), headerText: this.columnName, textAlign: 'Right', width: '80' },
    ]);
    this.columnName = '';
  }
}
