import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, RowDataBoundEventArgs } from '@syncfusion/ej2-angular-grids';
import { EditSettingsModel, SortSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import {
  Freeze,
  InfiniteScrollSettingsModel,
  Page,
  Reorder,
  Resize,
  RowDD,
  Selection,
  TreeGrid,
} from '@syncfusion/ej2-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { contextTarget, CONTEXT_MENU_ITEM } from './constants/context-menu-item';
import { DATA_COLUMNS } from './constants/data-columns';
import { sampleData } from './home.data';
import { SettingsComponent } from './settings/settings.component';
import { StylingComponent } from './styling/styling.component';
import { DataUtils } from './utils/data.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('grid') declare grid: GridComponent;
  declare quote: string;
  public isLoading = false;
  private declare loadedRecordCount: number;

  public declare columns: any[];

  public columnMenuItems = <any>[];
  public dataColumn: any = DATA_COLUMNS;
  public contextMenuItems: any[] = [...CONTEXT_MENU_ITEM];

  public data = <any>[];
  public dataWithoutNested: object[] = [];

  // selectedRow: any[] = [];
  private isCutMode = false;
  private selectedRowForCopy: any[] = [];

  public declare pageSettings: any;
  public declare commands: any;
  public declare toolbarOptions: ToolbarItems[];
  public declare sortSettings: SortSettingsModel;
  public declare editSettings: EditSettingsModel;
  public declare filterSettings: any;
  public declare infiniteOptions: InfiniteScrollSettingsModel;

  public declare gridBodyHeight: number;

  public declare allowDragAndDrop: boolean;
  public declare toggleFilter: Boolean;
  public declare toggleMultiSorting: Boolean;
  public declare frozenColumns: number;
  public declare multiSelect: any;

  constructor(public modalService: NgbModal) {
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.editSettings = { allowEditing: true, mode: 'Row' };

    //infinite scroll setting
    this.pageSettings = { pageSize: 50 };
    this.loadedRecordCount = this.pageSettings.pageSize;
    this.gridBodyHeight = window.innerHeight - 100;
    this.infiniteOptions = { initialBlocks: 1 };

    this.frozenColumns = 0;
    this.toggleMultiSorting = true;
    this.toggleFilter = true;
    this.multiSelect = { type: 'Multiple' };

    this.columns = [...this.dataColumn];
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
    this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
  }

  public uniqueIdRule: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    const element: any = args.element;
    if (element?.ej2_instances?.[0]?.enabled === false) return true;
    const existedIds: any = DataUtils.getItemIds(this.data);
    return existedIds.filter((taskID: any) => taskID == args.value)?.length === 0;
  };

  columnMenuClick(args: any): void {
    if (args.item.id === 'edit') {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    } else if (args.item.id === 'delete') {
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
      this.grid?.refresh();
    }
  }

  contextMenuClick(args: any): void {
    const target = args.item.target;
    switch (target) {
      case contextTarget.column:
        this.columnContextClick(args);
        break;
      case contextTarget.row:
        this.rowContextClick(args);
        break;
      default:
        break;
    }
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

  rowContextClick(args: any) {
    if (args?.item?.id == 'copyrows' || args?.item?.id == 'cut') {
      const selectedrecords: any[] = this.grid?.getSelectedRecords();
      if (selectedrecords.length == 0) {
        return;
      }
      this.isCutMode = args?.item?.id == 'cut';
      this.selectedRowForCopy = [...selectedrecords];

      this?.grid?.refreshColumns();
      this.showPasteOption();
    }
    if (args?.item?.id === 'pasteschild' || args?.item?.id === 'pastesibling') {
      this.selectedRowForCopy = [];
      this.showPasteOption(false);
      this.grid.refreshColumns();
      //   const selectedrecords: object[] = this.grid?.getSelectedRecords() || [];
      //   const selectedItem: any = selectedrecords[0];

      //   if (!selectedItem) {
      //     alert('Please select a row to paste');
      //     return;
      //   }
      //   const isCopy = this.selectedRowForCopy.length ? true : false;
      //   let dataForPaste = isCopy ? this.selectedRowForCopy : this.selectedRow;

      //   dataForPaste = this.createNewIDForRecord(dataForPaste);
      //   let newData = this.pasteRow(this.data, selectedItem, dataForPaste, args?.item?.id);
      //   if (!isCopy) {
      //     // remove cutted item
      //     newData = this.removeCuttedItem(newData, this.selectedRow);
      //   }
      //   // reset copy and cut item
      //   this.selectedRowForCopy = [];
      //   this.selectedRow = [];

      //   // reset data
      //   this.data = [...newData];
      //   // this?.grid?.refreshColumns();
    }
  }

  showPasteOption(isShow = true) {
    const contextMenuElement = document.getElementById('_gridcontrol_cmenu');
    if (isShow) {
      contextMenuElement?.classList.add('showPasteOption');
    } else {
      contextMenuElement?.classList.remove('showPasteOption');
    }
  }

  columnContextClick(args: any) {
    const _contextMenuItems = [...this.contextMenuItems];
    const _contextMenuIndex = _contextMenuItems.findIndex((item: any) => item.id === args.item.id);

    if (args?.item?.id === 'show-hide-column') {
      this.grid?.columnChooserModule.openColumnChooser(); // give X and Y axis
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
      if (this.frozenColumns > 0) {
        this.grid.clearSelection();
        this.infiniteOptions = { initialBlocks: 1 };
        this.loadedRecordCount = this.pageSettings.pageSize;

        this.frozenColumns = 0;
        this.columns = this.columns.map((column: any) => {
          column.allowReordering = true;
          return column;
        });
      }
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
      this.grid?.clearSorting();
    }

    if (args.item.id === 'freeze') {
      this.freezeColumn(args);
    }

    if (args.item.id === 'styling') {
      this.editColumnStyle(args);
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
  }

  freezeColumn(args: any) {
    const lastScrollPosition = this.grid.element.querySelector('.e-gridcontent .e-content')?.scrollTop;
    this.isLoading = true;
    let freezeColumnIndex = this.dataColumn.findIndex((column: any) => column.field === args.column.field) + 1;
    //reset collumn re ordering
    this.columns = this.columns.map((column: any) => {
      column.allowReordering = true;
      return column;
    });

    //block re ordering for all the columns on the leftside of chosen froze column
    this.columns.forEach((column: any) => {
      if (column.index < freezeColumnIndex) {
        column.allowReordering = false;
      }
    });

    //reset frozen
    if (this.frozenColumns > 0 && freezeColumnIndex == this.frozenColumns) {
      freezeColumnIndex = 0;
    }
    this.frozenColumns = freezeColumnIndex;

    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => {
        // @ts-ignore
        this.grid.element.querySelector('.e-gridcontent .e-content')?.scrollTop = lastScrollPosition;
      }, 600);
    }, 300);
  }

  editColumnStyle(args: any) {
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

  // pasteRow(data: any, item: any, insertRecords: object[], pasteType: string) {
  //   for (let i = 0; i < data.length; i++) {
  //     if (data[i].taskID === item.taskID) {
  //       switch (pasteType) {
  //         case 'pastesibling':
  //           for (let j = 0; j < insertRecords.length; j++) {
  //             data.splice(i + 1, 0, insertRecords[j]);
  //           }
  //           break;
  //         case 'pasteschild':
  //           insertRecords = insertRecords.map((record: any) => {
  //             record.parentItem = item;
  //             return record;
  //           });
  //           data[i].subtasks =
  //             data[i].subtasks && data[i].subtasks.length ? data[i].subtasks.concat(insertRecords) : insertRecords;
  //           break;
  //         default:
  //           break;
  //       }
  //       return data;
  //     }
  //     if (data[i].subtasks) {
  //       const found = this.pasteRow(data[i].subtasks, item, insertRecords, pasteType);
  //       if (found) return data;
  //     }
  //   }
  //   return false;
  // }

  // createNewIDForRecord(insertItems: object[]) {
  //   insertItems = insertItems.map((data: any) => {
  //     let newID = Math.floor(Math.random() * 100000000);
  //     while (this.dataWithoutNested.find((record: any) => record.taskID === newID)) {
  //       newID = Math.floor(Math.random() * 100000000);
  //     }
  //     const newData = {
  //       ...data,
  //       taskID: newID,
  //     };

  //     if (data.subtasks) {
  //       newData.subtasks = this.createNewIDForRecord(data.subtasks);
  //     }
  //     return newData;
  //   });
  //   return insertItems;
  // }

  // removeCuttedItem(data: object[], insertRecords: object[]): any {
  //   data = data.map((record: any) => {
  //     const item: any = insertRecords.find((item: any) => item.taskID === record.taskID);
  //     if (!item && record.subtasks) {
  //       record.subtasks = this.removeCuttedItem(record.subtasks, insertRecords);
  //     }
  //     if (!item) return record;
  //   });
  //   data = data.filter((item) => item);
  //   return data;
  // }

  rowBound(args: RowDataBoundEventArgs) {
    const taskID: any = args?.data?.['taskID'];
    if (this.selectedRowForCopy.findIndex((item) => item.taskID === taskID) >= 0) {
      // @ts-ignore
      args?.row?.style?.background = this.isCutMode ? '#f8d7da' : '#d1ecf1';
    }
  }

  actionComplete(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Record of ' + args.rowData['taskID'] : 'New Record';
    }
  }

  actionBegin(args: any): void {
    // console.log(args.requestType)
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
    }

    if (args.requestType == 'filtering' || args.requestType == 'infiniteScroll') {
      if (args.requestType == 'infiniteScroll') {
        this.loadedRecordCount += this.pageSettings.pageSize;
      }

      this.infiniteOptions = { initialBlocks: this.loadedRecordCount / this.pageSettings.pageSize };
    }
  }
}
