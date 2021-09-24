import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CommandModel,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  RowDataBoundEventArgs,
  SortSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Freeze, Page, Reorder, Resize, RowDD, Selection, TreeGrid } from '@syncfusion/ej2-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { sampleData } from './home.data';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  public data = <any>[];
  public dataWithoutNested: object[] = [];
  public pageSettings: PageSettingsModel | undefined;
  public sortSettings: SortSettingsModel | undefined;
  public editSettings: EditSettingsModel | undefined;
  public commands: CommandModel | undefined;
  public columnMenuItems = <any>[];
  selectedRow: Array<any> = [];
  selectedRowForCopy: Array<any> = [];

  public toolbarOptions: ToolbarItems[] | Object[] | undefined;
  public frozenColumns: number | undefined;
  public contextMenuItems: any = [
    { text: 'Copy with headers', target: '.e-content', id: 'copywithheader' },
    'Copy',
    { text: 'Copy selected rows', target: '.e-content', id: 'copyrows' },
    { text: 'Cut', target: '.e-content', id: 'cut' },
    { text: 'Paste as sibling', target: '.e-content', id: 'pastesibling' },
    { text: 'Paste as child', target: '.e-content', id: 'pasteschild' },
    { text: 'Turn off multi select mode', target: '.e-content', id: 'multiselect' },
    'Edit',
    'Delete',
    'Save',
    'Cancel',
  ];
  @ViewChild('grid') public grid: GridComponent | undefined;
  public toggleFilter: Boolean | undefined;

  public columns: any;
  public dataColumn: any = [
    { field: 'taskID', headerText: 'Task ID', textAlign: 'Left', isPrimaryKey: true },
    { field: 'taskName', headerText: 'Task Name', textAlign: 'Left' },
    { field: 'startDate', headerText: 'Start Date', textAlign: 'Left', format: 'yMd', editType: 'datetimepickeredit' },
    { field: 'duration', headerText: 'Duration', textAlign: 'Left' },
  ];
  multiSelect: any;
  constructor(public modalService: NgbModal) {}

  ngOnInit() {
    // Allow Drag / Drop to change order row
    TreeGrid.Inject(RowDD, Selection);

    // Allow Drag / Drop to change order column
    TreeGrid.Inject(Reorder, Page);

    // Allow Resize column
    TreeGrid.Inject(Page, Resize);

    // Allow Freeze
    TreeGrid.Inject(Freeze);

    this.frozenColumns = 0;
    this.data = sampleData;
    this.getFullRecordWithoutNested(this.data);
    this.columns = [...this.dataColumn];
    this.pageSettings = { pageSize: 20 };
    // @ts-ignore
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.toolbarOptions = [
      'Add',
      'Edit',
      'Delete',
      {
        align: 'Right',
        text: 'Add Column',
        tooltipText: 'Add Column',
        prefixIcon: 'fas fa-columns',
        id: 'addColumnAction',
      },
      {
        align: 'Right',
        text: 'Setting',
        tooltipText: 'Setting',
        prefixIcon: 'fas fa-cogs',
        id: 'openModalSetting',
      },
    ];
    // @ts-ignore
    this.commands = [
      { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
      { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
      { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
      { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } },
    ];
    this.columnMenuItems = [
      { text: 'Edit', id: 'edit' },
      { text: 'Delete', id: 'delete' },
    ];
    this.multiSelect = { type: 'Multiple' };
  }

  updateColumns(newColumns: any) {
    this.dataColumn = this.columns = newColumns;
  }

  columnMenuClick(args: any): void {
    if (args.item.id === 'edit') {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    } else if (args.item.id === 'delete') {
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
    }
  }

  openModal(type: string, column?: any): void {
    const modalRef = this.modalService.open(ComlumnComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.column = column;
    modalRef.componentInstance.columnEmitter.subscribe((res: any) => {
      if (res.event) {
        switch (res.event.type) {
          case 'add':
            this.dataColumn.push({
              field: `${res.event.column.text.trim()}${this.dataColumn.length}`,
              headerText: res.event.column.text,
              textAlign: 'Right',
              width: '80',
            });
            this.columns = [...this.dataColumn];
            break;
          case 'edit':
            const column: any = this?.grid?.getColumnByField(res.event.column.field);
            column.headerText = res.event.column.text;
            this?.grid?.refreshColumns();
            break;
          default:
            break;
        }
        modalRef.close();
      } else modalRef.close();
    });
  }

  contextMenuClick(args: MenuEventArgs): void {
    if (args?.item?.id === 'cut') {
      const selectedrecords: object[] = this.grid?.getSelectedRecords() || [];
      this.selectedRow = selectedrecords;
      this.selectedRowForCopy = [];
      this.data = [...this.data];
    }

    if (args?.item?.id === 'copyrows') {
      const selectedrecords: object[] = this.grid?.getSelectedRecords() || [];
      this.selectedRowForCopy = selectedrecords;
      this.selectedRow = [];
      this.data = [...this.data];
    }

    if (args?.item?.id === 'pasteschild' || args?.item?.id === 'pastesibling') {
      const selectedrecords: object[] = this.grid?.getSelectedRecords() || [];
      const selectedItem: any = selectedrecords[0];

      if (!selectedItem) {
        alert('Please select a row to paste');
        return;
      }
      const isCopy = this.selectedRowForCopy.length ? true : false;
      let dataForPaste = isCopy ? this.selectedRowForCopy : this.selectedRow;

      dataForPaste = this.createNewIDForRecord(dataForPaste);
      let newData = this.pasteRow(this.data, selectedItem, dataForPaste, args?.item?.id);
      if (!isCopy) {
        // remove cutted item
        newData = this.removeCuttedItem(newData, this.selectedRow);
      }
      // reset copy and cut item
      this.selectedRowForCopy = [];
      this.selectedRow = [];

      // reset data
      this.data = [...newData];
    }

    if (args?.item?.id === 'multiselect') {
      if (this.multiSelect.type == 'Single') {
        this.multiSelect = { type: 'Multiple' };
        this.contextMenuItems = this.contextMenuItems.map((element: any) => {
          if (element.id == 'multiselect') {
            element.text = 'Turn off multi select mode';
          }
          return element;
        });
      } else {
        this.multiSelect = { type: 'Single' };
        this.contextMenuItems = this.contextMenuItems.map((element: any) => {
          if (element.id == 'multiselect') {
            element.text = 'Turn on multi select mode';
          }
          return element;
        });
      }
    }
    return;
  }

  rowBound(args: RowDataBoundEventArgs) {
    const taskID: any = args?.data?.['taskID'];
    if (this.selectedRow.find((item) => item.taskID === taskID)) {
      // @ts-ignore
      args?.row?.style?.background = '#f8d7da';
    }
    if (this.selectedRowForCopy.find((item) => item.taskID === taskID)) {
      // @ts-ignore
      args?.row?.style?.background = '#d1ecf1';
    }
  }

  getFullRecordWithoutNested(data: object[]): any {
    data.map((record: any) => {
      this.dataWithoutNested.push(record);
      if (record.subtasks && record.subtasks.length) {
        this.getFullRecordWithoutNested(record.subtasks);
      }
    });
  }

  toolbarClick(args: MenuEventArgs) {
    switch (args?.item?.id) {
      case 'openModalSetting':
        this.openModalSetting();
        break;
      case 'addColumnAction':
        this.openModal('add');
        break;
      default:
        return;
    }
  }

  openModalSetting() {
    const modalRef = this.modalService.open(SettingsComponent);
    modalRef.componentInstance.frozenColumnsInput = this.frozenColumns;
    modalRef.componentInstance.toggleFilterInput = !!this.toggleFilter;
    modalRef.componentInstance.dataColumnInput = this.dataColumn;
    modalRef.componentInstance.settingEmitter.subscribe((res: any) => {
      if (res) {
        this.frozenColumns = res.frozenColumns;
        this.toggleFilter = !!res.toggleFilter;
      }
      modalRef.close();
    });
  }

  getRootOfItem(data: object[], item: any): any {
    const findItem: any = data.find((record: any) => record.taskID === item.taskID);
    if (!findItem && item?.parentItem?.taskID) {
      return this.getRootOfItem(data, item?.parentItem);
    }

    return { findItem, data };
  }

  createNewIDForRecord(insertItems: object[]) {
    insertItems = insertItems.map((data: any) => {
      let newID = Math.floor(Math.random() * 100000000);
      while (this.dataWithoutNested.find((record: any) => record.taskID === newID)) {
        newID = Math.floor(Math.random() * 100000000);
      }
      const newData = {
        ...data,
        taskID: newID,
      };

      if (data.subtasks) {
        newData.subtasks = this.createNewIDForRecord(data.subtasks);
      }
      return newData;
    });
    return insertItems;
  }

  pasteRow(data: any, item: any, insertRecords: object[], pasteType: string) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].taskID === item.taskID) {
        switch (pasteType) {
          case 'pastesibling':
            for (let j = 0; j < insertRecords.length; j++) {
              data.splice(i + 1, 0, insertRecords[j]);
            }
            break;
          case 'pasteschild':
            insertRecords = insertRecords.map((record: any) => {
              record.parentItem = item;
              return record;
            });
            data[i].subtasks =
              data[i].subtasks && data[i].subtasks.length ? data[i].subtasks.concat(insertRecords) : insertRecords;
            break;
          default:
            break;
        }
        return data;
      }
      if (data[i].subtasks) {
        const found = this.pasteRow(data[i].subtasks, item, insertRecords, pasteType);
        if (found) return data;
      }
    }
    return false;
  }

  removeCuttedItem(data: object[], insertRecords: object[]): any {
    data = data.map((record: any) => {
      const item: any = insertRecords.find((item: any) => item.taskID === record.taskID);
      if (!item && record.subtasks) {
        record.subtasks = this.removeCuttedItem(record.subtasks, insertRecords);
      }
      if (!item) return record;
    });
    data = data.filter((item) => item);
    return data;
  }

  actionComplete(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Record of ' + args.rowData['taskID'] : 'New Record';
    }
  }
}
