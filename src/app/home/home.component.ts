import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, RowDataBoundEventArgs } from '@syncfusion/ej2-angular-grids';
import {
  EditSettingsModel,
  SortSettingsModel,
  ToolbarItems,
  TreeGridComponent,
} from '@syncfusion/ej2-angular-treegrid';
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
import { contextMenuID, contextTarget, CONTEXT_MENU_ITEM } from './constants/context-menu-item';
import { DATA_COLUMNS } from './constants/data-columns';
import { sampleData } from './home.data';
import { RowInputModalComponent } from './row/row-input-modal/row-input-modal.component';
import { SettingsComponent } from './settings/settings.component';
import { StylingComponent } from './styling/styling.component';
import { DataUtils } from './utils/data.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('grid') declare grid: TreeGridComponent;
  declare quote: string;
  public isLoading = false;
  private declare loadedRecordCount: number;

  public declare columns: any[];

  public columnMenuItems = <any>[];
  public dataColumn: any = DATA_COLUMNS;
  public contextMenuItems: any[] = [...CONTEXT_MENU_ITEM];

  public data: any[] = [];
  public dataWithoutNested: any[] = [];

  // selectedRow: any[] = [];
  private isCutMode = false;
  private isShowPasteOption = false;
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

  public columnChecked: any[] = [];

  constructor(public modalService: NgbModal) {
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    // this.editSettings = { allowDeleting: true, allowEditing: true, allowEditOnDblClick: false, mode: 'Row' };

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

    // this.sortSettings = {
    //   columns: [
    //     { field: 'startDate', direction: 'Descending' },
    //     { field: 'taskName', direction: 'Descending' },
    //   ],
    //   allowUnsort: true
    // }
  }

  public uniqueIdRule: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    const element: any = args.element;
    if (element?.ej2_instances?.[0]?.enabled === false) return true;
    const existedIds: any = DataUtils.getItemIds(this.data);
    return existedIds.filter((taskID: any) => taskID == args.value)?.length === 0;
  };

  columnMenuClick(args: any): void {
    if (args.item.id === contextMenuID.editColumn) {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    }

    if (args.item.id === contextMenuID.deleteColumn) {
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = this.dataColumn;
      this.grid?.refresh();
    }
  }

  contextMenuOpen(args: any) {
    if (this.grid.getSelectedRowIndexes().length <= 1) {
      if (this.grid.getSelectedRowIndexes()[0] != args.rowInfo.rowIndex) {
        this.grid.selectRow(args.rowInfo.rowIndex, true);
      }
    }

    if (args.rowInfo.cellIndex) {
      args.cancel = true;
    }
    if (this.isShowPasteOption) {
      args.element?.classList.add('showPasteOption');
    } else {
      args.element?.classList.remove('showPasteOption');
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
    }
  }

  rowContextClick(args: any) {
    const contextId = args.item.id;
    if (contextId == contextMenuID.addRow) {
      this.openAddRowModal(args, false);
    }

    if (contextId == contextMenuID.addChildRow) {
      this.openAddRowModal(args, true);
    }

    if (contextId == contextMenuID.editRow) {
      this.openEditRowModal(args);
    }

    if (contextId == contextMenuID.deleteRow) {
      this.isLoading = true;
      this.grid.getSelectedRecords().forEach((data) => {
        this.data = DataUtils.removeRecord(this.data, data);
        this.dataWithoutNested = DataUtils.removeRecord(this.data, data);
      });
      setTimeout(() => {
        this.isLoading = false;
      });
    }

    if (contextId == contextMenuID.copyRows || contextId == contextMenuID.cutRows) {
      const lastScrollPosition = this.getLastScrollPosition();
      this.isLoading = true;
      const selectedrecords: any[] = this.grid?.getSelectedRecords();
      if (selectedrecords.length == 0) {
        return;
      }
      this.isCutMode = contextId == contextMenuID.cutRows;
      this.selectedRowForCopy = [...selectedrecords];
      this?.grid?.refreshColumns();
      setTimeout(() => {
        this.isLoading = false;
        this.scrollBackToLastPosition(lastScrollPosition);
        this.isShowPasteOption = true;
      });
    }
    if (contextId === contextMenuID.pasteSibling || contextId === contextMenuID.pasteChild) {
      this.pasteRecord(args, contextId);
    }
  }

  pasteRecord(args: any, pasteType: string) {
    const pasteTarget = args.rowInfo.rowData;
    let dataForPaste: any[] = [];

    this.selectedRowForCopy.every((row) => {
      if (DataUtils.isChildOf(dataForPaste, row)) {
        return true;
      }
      const data: any = {};
      this.columns.forEach((col) => {
        data[col.field] = row[col.field];
      });
      data['subtasks'] = this.dataWithoutNested.filter((each) => each.parentID == data.taskID);
      dataForPaste.push(data);

      return true;
    });

    if (!this.isCutMode) {
      dataForPaste = this.createNewIDForRecord(dataForPaste);
      DataUtils.setParentForRecord(dataForPaste);
    } else {
      if (dataForPaste.findIndex((d) => d.taskID == pasteTarget.taskID) >= 0) {
        this.selectedRowForCopy = [];
        this.isShowPasteOption = false;
        this.grid.refresh();
        return;
      }

      if (DataUtils.isChildOf(dataForPaste, pasteTarget)) {
        alert(`you can't paste to it's own child`);
        this.grid.refresh();
        return;
      }

      dataForPaste.forEach((data) => {
        this.data = DataUtils.removeRecord(this.data, data);
      });
      this.grid.refresh();
    }
    this.isLoading = true;
    const lastScrollPosition = this.getLastScrollPosition();
    this.pasteRow(dataForPaste, pasteTarget, pasteType);
    this.selectedRowForCopy = [];
    this.grid.refresh();
    setTimeout(() => {
      this.isLoading = false;
      this.isShowPasteOption = false;
      this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
      this.scrollBackToLastPosition(lastScrollPosition, args.rowInfo.rowIndex);
    }, 400);
  }

  columnContextClick(args: any) {
    const contextID = args?.item?.id;
    const _contextMenuItems = [...this.contextMenuItems];
    const _contextMenuIndex = _contextMenuItems.findIndex((item: any) => item.id === args.item.id);

    if (contextID === contextMenuID.toggleShowColumn) {
      this.grid?.columnChooserModule.openColumnChooser(); // give X and Y axis
    }

    if (contextID === contextMenuID.addColumn) {
      this.openModal(args.item.id);
    }

    if (contextID === contextMenuID.editColumn) {
      this.openModal(args.item.id, { field: args.column.field, text: args.column.headerText });
    }

    if (contextID === contextMenuID.deleteColumn) {
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

    if (contextID === contextMenuID.freezeColumn) {
      const lastScrollPosition = this.getLastScrollPosition();
      this.freezeColumn(args);
      this.scrollBackToLastPosition(lastScrollPosition);
    }

    if (contextID === contextMenuID.stylingColumn) {
      this.editColumnStyle(args);
    }

    if (contextID === contextMenuID.togleFilter) {
      this.toggleFilter = !this.toggleFilter;
      _contextMenuItems[_contextMenuIndex].text = `Filter ${this.toggleFilter ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];

      //change grid content height when togle filter
      this.gridBodyHeight = this.toggleFilter ? window.innerHeight - 100 : window.innerHeight - 60;
    }

    if (args.item.id === contextMenuID.multipleSort) {
      this.openModal(args.item.id, this.columns, this.columnChecked);
      // this.toggleMultiSorting = !this.toggleMultiSorting;
      // _contextMenuItems[_contextMenuIndex].text = `Mutiple Sorting ${this.toggleMultiSorting ? `Off` : `On`}`;
      // this.contextMenuItems = [..._contextMenuItems];
    }
  }

  freezeColumn(args: any) {
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
    });
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
      if (res.minWidth) {
        this.dataColumn[index].minWidth = parseInt(res.minWidth);
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
      if (res.backgroundColor) {
        this.dataColumn[index].backgroundColor = res.backgroundColor;
        document.documentElement.style.setProperty(`--backgroundColor${index + 1}`, res.backgroundColor);
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

  openAddRowModal(args: any, isPasteAsChild: boolean) {
    const maxId = DataUtils.getMaxId(this.dataWithoutNested);
    const modalRef = this.modalService.open(RowInputModalComponent);
    modalRef.componentInstance.taskID = maxId + 1;
    modalRef.componentInstance.columnSetting = this.columns;
    modalRef.componentInstance.closeModal.subscribe((res: any) => {
      if (res) {
        if (isPasteAsChild) {
          this.pasteRow([res], args.rowInfo.rowData, contextMenuID.pasteChild);
        } else {
          this.data.unshift(res);
        }

        this.dataWithoutNested.push(res);
      }
      modalRef.close();
      this.grid.refresh();
    });
  }

  openEditRowModal(args: any) {
    const editingTask = args.rowInfo.rowData;
    const modalRef = this.modalService.open(RowInputModalComponent);
    modalRef.componentInstance.columnSetting = this.columns;
    modalRef.componentInstance.editingTask = editingTask;
    modalRef.componentInstance.closeModal.subscribe((res: any) => {
      if (res) {
        const editingTarget = DataUtils.findRecord(this.data, res);
        if (editingTarget) {
          Object.keys(res).forEach((key) => {
            editingTarget[key] = res[key];
          });
        }

        // args.rowInfo.rowData = {editing,...res}
      }
      modalRef.close();
      this.grid.refresh();
    });
  }

  openModal(type: string, column?: any, columnChecked?: any): void {
    const modalRef = this.modalService.open(ComlumnComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.column = column;
    modalRef.componentInstance.columnChecked = columnChecked;
    modalRef.componentInstance.columnEmitter.subscribe((res: any) => {
      if (res.event) {
        switch (res.event.type) {
          case 'add':
            const newColumn = {
              field: `${res.event.column.text.trim()}${this.dataColumn.length}`,
              headerText: res.event.column.text,
              editType: res.event.column.columnType.includes('date') ? 'datetimepickeredit' : 'string',
              textAlign: 'Left',
              width: 150,
              minWidth: 150,
              type: res.event.column.columnType || 'string',
              fontSize: 14,
              color: '#757575',
              customAttributes: { class: `header-column-font${this.dataColumn.length + 1}` },
              backgroundColor: '#fff',
            };
            if (res.event.column.columnType.includes('date')) {
              newColumn['format'] = 'yMd';
            }
            this.dataColumn.push(newColumn);

            this.columns = [...this.dataColumn];
            break;
          case 'edit':
            const column: any = this?.grid?.getColumnByField(res.event.column.field);
            column.headerText = res.event.column.text;
            this?.grid?.refreshColumns();
            break;
          case 'mutiple-sorting':
            this.columnChecked = res.event.column;
            console.log(res.event);
            let arr: any = [];

            if (this.columnChecked.length > 0) {
              this.columnChecked.forEach((item: any) => {
                if (item.isChecked) {
                  this.grid.sortByColumn(item.name, 'Ascending', true);
                } else {
                  this.grid.removeSortColumn(item.name);
                }
              });
            }

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

  createNewIDForRecord(insertItems: any[], maxId?: any) {
    maxId = maxId ? maxId : DataUtils.getMaxId(this.dataWithoutNested);
    insertItems = insertItems.map((data: any) => {
      maxId++;
      const newData = {
        ...data,
        taskID: maxId,
        taskCode: maxId,
      };

      if (data.subtasks) {
        newData.subtasks = this.createNewIDForRecord(data.subtasks, maxId);
      }
      return newData;
    });
    return insertItems;
  }

  pasteRow(insertRecords: any[], pasteTarget: any, pasteType: string) {
    let insertTarget: any[];
    let pasteIndex: any;
    insertRecords = insertRecords.slice().reverse();
    if (pasteType == contextMenuID.pasteSibling) {
      if (pasteTarget.parentID) {
        const parentRecord: any = DataUtils.getParentOf(this.data, pasteTarget.parentID);
        pasteIndex = parentRecord.subtasks.findIndex((d: any) => d.taskID == pasteTarget.taskID);
        insertTarget = parentRecord.subtasks;
        this.setLevelForPasting(insertRecords, pasteTarget.level);
      } else {
        pasteIndex = this.data.findIndex((d) => d.taskID == pasteTarget.taskID);
        insertTarget = this.data;
      }

      insertRecords.forEach((each) => {
        insertTarget.splice(pasteIndex + 1, 0, each);
      });
    }

    if (pasteType == contextMenuID.pasteChild) {
      this.setLevelForPasting(insertRecords, pasteTarget.level + 1);
      if (pasteTarget.parentID) {
        const targetRecord: any = DataUtils.getParentOf(this.data, pasteTarget.parentID).subtasks.find(
          (each: any) => each.taskID == pasteTarget.taskID
        );
        targetRecord.subtasks = targetRecord.subtasks ? targetRecord.subtasks : [];
        insertTarget = targetRecord.subtasks;
      } else {
        const target = this.data[this.data.findIndex((d) => d.taskID == pasteTarget.taskID)];
        const targetSubtasks = target.subtasks ? target.subtasks : [];
        insertTarget = targetSubtasks;
      }

      insertRecords.forEach((each) => {
        insertTarget.unshift(each);
      });
    }
  }

  setLevelForPasting(insertRecords: any[], pasteLevel: number) {
    insertRecords.forEach((rec) => {
      rec['level'] = pasteLevel;
      if (rec.subtasks && rec.subtasks.length) {
        this.setLevelForPasting(rec.subtasks, pasteLevel + 1);
      }
    });
  }

  rowBound(args: RowDataBoundEventArgs) {
    const taskID: any = args?.data?.['taskID'];
    if (this.selectedRowForCopy.findIndex((item) => item.taskID === taskID) >= 0) {
      // @ts-ignore
      args?.row?.style?.background = this.isCutMode ? '#f8d7da' : '#d1ecf1';
    }
  }

  actionComplete(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
    }
  }

  actionBegin(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
    }

    if (args.requestType == 'filtering' || args.requestType == 'infiniteScroll') {
      if (args.requestType == 'infiniteScroll') {
        this.loadedRecordCount += this.pageSettings.pageSize;
      }

      this.infiniteOptions = { initialBlocks: this.loadedRecordCount / this.pageSettings.pageSize };
    }
  }

  getLastScrollPosition(): any {
    return this.grid.element.querySelector('.e-gridcontent .e-content')?.scrollTop;
  }

  scrollBackToLastPosition(lastScrollPosition: any, selectedRowIndex?: number) {
    setTimeout(() => {
      // @ts-ignore
      this.grid.element.querySelector('.e-gridcontent .e-content')?.scrollTop = lastScrollPosition;
      if (selectedRowIndex) {
        this.grid.selectRow(selectedRowIndex, true);
      }
    }, 500);
  }
}
