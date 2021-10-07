import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, RowDataBoundEventArgs } from '@syncfusion/ej2-angular-grids';
import { EditSettingsModel, SortSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Freeze, Page, Reorder, Resize, RowDD, Selection, TreeGrid } from '@syncfusion/ej2-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { CONTEXT_MENU_ITEM } from './context-menu-item';
import { DATA_COLUMNS } from './data-columns';
import { sampleData } from './home.data';
import { SettingsComponent } from './settings/settings.component';
import { StylingComponent } from './styling/styling.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('grid') declare grid: GridComponent;
  declare quote: string;
  public isLoading = false;

  public declare columns: any[];

  public columnMenuItems = <any>[];
  public dataColumn: any = DATA_COLUMNS;
  public contextMenuItems: any = CONTEXT_MENU_ITEM;

  public data = <any>[];
  public dataWithoutNested: object[] = [];

  selectedRow: Array<any> = [];
  selectedRowForCopy: Array<any> = [];

  public declare pageSettings: any;
  public declare commands: any;
  public declare toolbarOptions: ToolbarItems[];
  public declare sortSettings: SortSettingsModel;
  public declare editSettings: EditSettingsModel;
  public declare filterSettings: any;

  public declare gridBodyHeight: number;

  public declare toggleFilter: Boolean;
  public declare toggleMultiSorting: Boolean;
  public declare frozenColumns: number;
  public declare multiSelect: any;

  constructor(public modalService: NgbModal) {
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    //infinite scroll setting
    this.pageSettings = { pageSize: 20 };
    this.gridBodyHeight = window.innerHeight - 100;

    this.frozenColumns = 0;
    this.toggleMultiSorting = true;
    this.toggleFilter = true;
    this.multiSelect = { type: 'Multiple' };

    this.columns = [...this.dataColumn];

    this.commands = [
      { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
      { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
      { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
      { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } },
    ];
  }

  ngOnInit() {
    // Allow Drag / Drop to change order row
    TreeGrid.Inject(RowDD, Selection);

    // Allow Drag / Drop to change order column
    TreeGrid.Inject(Reorder, Page);

    // Allow Resize column
    TreeGrid.Inject(Page, Resize);

    // Allow Freeze
    TreeGrid.Inject(Freeze);

    this.data = sampleData;
    this.getFullRecordWithoutNested(this.data);
  }

  public uniqueIdRule: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    const element: any = args.element;
    if (element?.ej2_instances?.[0]?.enabled === false) return true;
    const existedIds: any = this.getIds(this.data);
    return existedIds.filter((taskID: any) => taskID == args.value)?.length === 0;
  };

  updateColumns(newColumns: any) {
    this.dataColumn = this.columns = newColumns;
  }

  columnMenuClick(args: any): void {
    if (args.item.id === 'edit') {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    } else if (args.item.id === 'delete') {
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
      try {
        this.grid?.clearSorting();
        this.grid?.clearFiltering();
        this.grid?.clearGrouping();
        this.grid?.goToPage(1);
        this.grid?.refreshColumns();
      } catch (e) {
        console.log(e);
      }
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
              editType: res.event.column.columnType.includes('date') ? 'datetimepickeredit' : 'string',
              textAlign: 'Left',
              width: 150,
              type: res.event.column.columnType || 'string',
              fontSize: 14,
              color: '#757575',
              customAttributes: { class: `header-column-font${this.dataColumn.length + 1}` },
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

  contextMenuClick(args: any): void {
    const _contextMenuItems = [...this.contextMenuItems];
    const _contextMenuIndex = _contextMenuItems.findIndex((item: any) => item.id === args.item.id);
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
      // this.data = [...this.data];
      this?.grid?.refreshColumns();
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
      // this?.grid?.refreshColumns();
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

    if (args?.item?.id === 'show-hide-column') {
      this.grid?.columnChooserModule.openColumnChooser(); // give X and Y axis
    }

    if (args.item.id === 'add') {
      this.openModal(args.item.id);
    }

    if (args.item.id === 'edit') {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    }
    if (args.item.id === 'delete') {
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
      this.grid?.clearSorting();
    }

    if (args.item.id === 'freeze') {
      this.grid?.clearSelection(); //if freeze while still select row => error
      //reset collumn re ordering
      this.columns = this.columns.map((column: any) => {
        column.allowReordering = true;
        return column;
      });

      //index of chosen froze column
      let index = this.dataColumn.findIndex((column: any) => column.field === args.column.field) + 1;

      //block re ordering for all the columns on the leftside of chosen froze column
      this.columns.forEach((column: any) => {
        if (column.index < index) {
          column.allowReordering = false;
        }
      });

      //reset frozen
      if (this.frozenColumns > 0 && index == this.frozenColumns) {
        this.frozenColumns = 0;
        return;
      }
      this.frozenColumns = index;
    }

    if (args.item.id === 'filter') {
      this.toggleFilter = !this.toggleFilter;
      _contextMenuItems[_contextMenuIndex].text = `Filter ${this.toggleFilter ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];

      //change grid content height when togle filter
      this.gridBodyHeight = this.toggleFilter ? window.innerHeight - 100 : window.innerHeight - 60;
    }

    if (args.item.id === 'mutiple-sorting') {
      this.toggleMultiSorting = !this.toggleMultiSorting;
      _contextMenuItems[_contextMenuIndex].text = `Mutiple Sorting ${this.toggleMultiSorting ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];
    }

    if (args.item.id === 'styling') {
      let index = this.dataColumn.findIndex((column: any) => column.field === args.column.field);
      console.log(args.column);
      const modalRef = this.modalService.open(StylingComponent);
      modalRef.componentInstance.column = this.dataColumn[index];
      modalRef.componentInstance.columnEmitter.subscribe((res: any) => {
        if (res.alignValue) {
          this.dataColumn[index].textAlign = res.alignValue;
        }
        if (res.columnType) {
          this.dataColumn[index].type = res.columnType;
        }
        if (res.columnValue) {
          this.dataColumn[index].headerText = res.columnValue;
        }
        if (res.color) {
          this.dataColumn[index].color = res.color;
          document.documentElement.style.setProperty(`--color${index + 1}`, res.color);
        }
        if (res.fontSize) {
          this.dataColumn[index].fontSize = res.fontSize;
          document.documentElement.style.setProperty(`--fontSize${index + 1}`, `${res.fontSize}px`);
        }
        if (res.textWrap) {
          this.dataColumn[index].textWrap = res.textWrap;
          document.documentElement.style.setProperty(`--textWrap${index + 1}`, res.textWrap);
          if (res.textWrap === 'break-word') {
            document.documentElement.style.setProperty(`--textOverFlow${index + 1}`, `inherit`);
            document.documentElement.style.setProperty(`--whiteSpace${index + 1}`, `inherit`);
            document.documentElement.style.setProperty(`--marginColumn${index + 1}`, `inherit`);
            document.documentElement.style.setProperty(`--heightColumn${index + 1}`, `auto`);
          } else {
            document.documentElement.style.setProperty(`--textOverFlow${index + 1}`, `ellipsis`);
            document.documentElement.style.setProperty(`--whiteSpace${index + 1}`, `nowrap`);
            document.documentElement.style.setProperty(`--marginColumn${index + 1}`, `-7px`);
            document.documentElement.style.setProperty(`--heightColumn${index + 1}`, `25px`);
          }
        }
        this.columns = [...this.dataColumn];
        modalRef.close();
      });
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
      case 'toggleFilter':
        this.toggleFilter = !this.toggleFilter;
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

  actionBegin(args: any): void {
    console.log(this.gridBodyHeight);
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
    }
  }

  getIds(datasets: any[]) {
    const dataStr = JSON.stringify(datasets);
    const ids = dataStr.match(/"taskID":\w+/g)?.map((e) => e.replace('"taskID":', ''));
    return ids;
  }
}
