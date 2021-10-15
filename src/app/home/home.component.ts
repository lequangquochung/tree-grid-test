import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class HomeComponent implements OnInit, AfterViewInit {
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
  private isDropMode = true;
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
  public treeColumnIndex: number = 2;

  constructor(public modalService: NgbModal) {
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    // this.editSettings = { allowDeleting: true, allowEditing: true, allowEditOnDblClick: false, mode: 'Row' };

    //infinite scroll setting
    this.pageSettings = { pageSize: 50 };
    this.loadedRecordCount = this.pageSettings.pageSize;
    this.infiniteOptions = { initialBlocks: 1 };

    this.frozenColumns = 0;
    this.toggleMultiSorting = true;
    this.toggleFilter = true;
    this.multiSelect = { type: 'Multiple' };

    this.columns = [...this.dataColumn];
  }
  ngAfterViewInit(): void {
    setInterval(() => {
      this.tableElement = document.querySelector('.e-content .e-table');
      if (this.tableElement.offsetHeight <= window.innerHeight) {
        this.gridBodyHeight = this.tableElement.offsetHeight - 5;
      } else {
        this.gridBodyHeight = this.toggleFilter ? window.innerHeight - 100 : window.innerHeight - 60;
      }
    }, 1000);
  }

  declare tableElement: any;

  ngOnInit() {
    if (this.isTouchScreendevice()) {
      this.isDropMode = false;
    }
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

  contextMenuOpen(args: any) {
    if (this.grid.getSelectedRowIndexes().length <= 1) {
      if (this.grid.getSelectedRowIndexes()[0] != args.rowInfo.rowIndex) {
        this.grid.selectRow(args.rowInfo.rowIndex, true);
      }
    }

    if (!this.isDropMode && args.rowInfo.cellIndex > 1) {
      args.cancel = true;
    }

    if (this.isDropMode && args.rowInfo.cellIndex) {
      args.cancel = true;
    }

    if (this.isShowPasteOption) {
      args.element?.classList.add('showPasteOption');
    } else {
      args.element?.classList.remove('showPasteOption');
    }

    if (this.isTouchScreendevice()) {
      args.element?.classList.add('showDragDropOption');
    } else {
      args.element?.classList.remove('showDragDropOption');
    }
  }
  // check touch screen
  isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
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
        this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
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
    if (contextId === contextMenuID.dragAndDrop) {
      const lastScrollPosition = this.getLastScrollPosition();
      this.isLoading = true;
      this.isDropMode = !this.isDropMode;
      setTimeout(() => {
        this.isLoading = false;
        this.scrollBackToLastPosition(lastScrollPosition);
      }, 500);
    }
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
      const targetColumn = args.column;
      this.openModal(args.item.id, {
        field: targetColumn.field,
        text: targetColumn.headerText,
        columnType: targetColumn.type,
        dropDownItem: targetColumn.dropDownItem,
      });
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

      if (this.treeColumnIndex === args.column.index || 'taskCode' === args.column.field) {
        alert("Can't delete this column");
        return;
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
      _contextMenuItems[_contextMenuIndex].text = `Filter Columns ${this.toggleFilter ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];

      //change grid content height when togle filter
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
          this.pasteRow([res], args.rowInfo.rowData, contextMenuID.pasteSibling);
        }
        this.dataWithoutNested.push(res);
      }
      modalRef.close();
      this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
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
        const editingTarget = DataUtils.findRecord(this.data, res.taskID);
        if (editingTarget) {
          Object.keys(res).forEach((key) => {
            editingTarget[key] = res[key];
          });
        }
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
        const resColumn = res.event.column;
        switch (res.event.type) {
          case 'add':
            const newColumn = {
              field: `${resColumn.text.trim()}${this.dataColumn.length}`,
              headerText: resColumn.text,
              editType: resColumn.columnType.includes('date') ? 'datetimepickeredit' : 'string',
              textAlign: 'Left',
              width: 150,
              minWidth: 150,
              type: resColumn.columnType,
              fontSize: 14,
              color: '#757575',
              customAttributes: { class: `header-column-font${this.dataColumn.length + 1}` },
              backgroundColor: '#fff',
            };

            if (resColumn.columnType.includes('text')) {
              newColumn.type = 'string';
            }

            if (resColumn.columnType.includes('date')) {
              newColumn['format'] = 'MM/dd/yyyy';
            }
            if (resColumn.columnType.includes('dropdown')) {
              newColumn['dropDownItem'] = resColumn.dropDownItem;
            }
            this.dataColumn = [...this.columns];
            this.dataColumn.push(newColumn);

            this.columns = [...this.dataColumn];

            break;
          case 'edit':
            const column: any = this?.grid?.getColumnByField(resColumn.field);
            column.headerText = resColumn.text;
            if (resColumn.columnType == 'dropdown') {
              column.dropDownItem = resColumn.dropDownItem;
              this.changeDataWithDropDownItemChange(resColumn.oldDropDownItem, resColumn.field);
            }
            this?.grid?.refreshColumns();
            break;
          case 'mutiple-sorting':
            this.columnChecked = resColumn;
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

  changeDataWithDropDownItemChange(oldDropDownItems: any[], field: string) {
    let isDropDownItemModified = false;
    oldDropDownItems.every((item) => {
      if (item.changed || item.deleted) {
        isDropDownItemModified = true;
        return false;
      }
      return true;
    });

    if (!isDropDownItemModified) {
      return;
    }

    const serialDropdownValueChanger = (data: any[], field: string, oldDropDownItem: any) => {
      if (oldDropDownItem.changed || oldDropDownItem.deleted) {
        data.forEach((record) => {
          if (record[field] == oldDropDownItem.name) {
            if (oldDropDownItem.changed) {
              record[field] = oldDropDownItem.itemNewValue;
            }
            if (oldDropDownItem.deleted) {
              record[field] = null;
            }
          }
          if (record.subtasks && record.subtasks.length) {
            serialDropdownValueChanger(record.subtasks, field, oldDropDownItem);
          }
        });
      }
    };

    oldDropDownItems.forEach((each) => {
      serialDropdownValueChanger(this.data, field, each);
    });

    this.grid.refresh();
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

  declare copyMaxID: number;
  createNewIDForRecord(insertItems: any[]) {
    this.copyMaxID = this.copyMaxID ? this.copyMaxID : DataUtils.getMaxId(this.dataWithoutNested);
    insertItems = insertItems.map((data: any) => {
      this.copyMaxID++;
      const newData = {
        ...data,
        taskID: this.copyMaxID,
        taskCode: this.copyMaxID,
      };

      if (data.subtasks) {
        newData.subtasks = this.createNewIDForRecord(data.subtasks);
      }
      return newData;
    });
    return insertItems;
  }

  pasteRecord(args: any, pasteType: string) {
    const pasteTarget = args.rowInfo.rowData;
    let dataForPaste: any[] = [];
    let indexAfterCut = this.selectedRowForCopy.length;

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
        // this.grid.refresh();
        return;
      }

      dataForPaste.forEach((data) => {
        this.data = DataUtils.removeRecord(this.data, data);
      });
      // this.grid.refresh();
    }
    this.isLoading = true;
    const lastScrollPosition = this.getLastScrollPosition();
    this.pasteRow(dataForPaste, pasteTarget, pasteType);
    this.selectedRowForCopy = [];
    // this.grid.refresh();
    setTimeout(() => {
      this.isLoading = false;
      this.isShowPasteOption = false;
      this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
      if (this.isCutMode) {
        this.scrollBackToLastPosition(lastScrollPosition, args.rowInfo.rowIndex - indexAfterCut);
      } else {
        this.scrollBackToLastPosition(lastScrollPosition, args.rowInfo.rowIndex);
      }
    }, 400);
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
        targetRecord['subtasks'] = targetRecord.subtasks ? targetRecord.subtasks : [];
        insertTarget = targetRecord.subtasks;
      } else {
        const target = this.data[this.data.findIndex((d) => d.taskID == pasteTarget.taskID)];
        target['subtasks'] = target.subtasks ? target.subtasks : [];
        insertTarget = target.subtasks;
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
      args?.row?.style?.background = '#f8d7da';
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
