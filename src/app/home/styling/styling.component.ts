import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-styling',
  templateUrl: './styling.component.html',
  styleUrls: ['./styling.component.scss'],
})
export class StylingComponent implements OnInit {
  @Input() column: any | undefined;
  @Output() columnEmitter = new EventEmitter<any>();
  constructor(private modalService: NgbModal) {}
  columnTypeData: any = ['string', 'number', 'boolean', 'date', 'datetime'];

  alignType: any = ['Left', 'Center', 'Right'];

  textWrapType: any = ['normal', 'break-word'];

  public fields: Object = { text: 'label', value: 'id' };

  columnType: string = '';
  columnValue: string = '';
  columnMinWidth: any = 0;
  fontSize: string = '';
  color: string = '';
  backgroundColor: string = '';
  alignValue: any = '';
  textWrapValue: string = '';

  ngOnInit(): void {
    this.alignValue = this.column?.textAlign;
    this.columnType = this.column?.type;
    this.columnValue = this.column?.headerText;
    this.color = this.column?.color;
    this.fontSize = this.column?.fontSize;
    this.textWrapValue = this.column?.textWrap;
    this.columnMinWidth = this.column?.minWidth;
    this.backgroundColor = this.column?.backgroundColor;
  }

  close() {
    this.columnEmitter.emit({ event: false });
  }

  saveColumn() {
    this.columnEmitter.emit({
      alignValue: this.alignValue,
      columnType: this.columnType,
      columnValue: this.columnValue,
      color: this.color,
      fontSize: this.fontSize,
      textWrap: this.textWrapValue,
      minWidth: this.columnMinWidth,
      backgroundColor: this.backgroundColor,
    });
  }

  onChangeColumnType(args: any): void {
    this.columnType = args.value;
  }

  onChangeAlignType(args: any): void {
    this.alignValue = args.value;
  }

  onChangeTextWrapType(args: any): void {
    this.textWrapValue = args.value;
  }
}
