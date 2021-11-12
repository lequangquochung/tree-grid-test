import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent, RowDataBoundEventArgs } from '@syncfusion/ej2-angular-grids';
import {
  EditSettingsModel,
  SortSettingsModel,
  ToolbarItems,
  TreeGridComponent,
} from '@syncfusion/ej2-angular-treegrid';
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
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { ColumnEditorComponent } from './comlumn/column-editor/column-editor.component';
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
  public dataColumn: any[] = DATA_COLUMNS;
  public contextMenuItems: any[] = [...CONTEXT_MENU_ITEM];

  public data: any[] = [];
  public dataWithoutNested: any[] = [];

  // selectedRow: any[] = [];
  private isCutMode = false;
  declare copyMaxID: number;
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
  public declare toggleMultilSelect: Boolean;
  public frozenColumns: any[] = [];

  public declare multiSelect: any;

  public columnChecked: any[] = [];

  constructor(public modalService: NgbModal) {
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };

    //infinite scroll setting
    this.pageSettings = { pageSize: 50 };
    this.loadedRecordCount = this.pageSettings.pageSize;
    this.infiniteOptions = { initialBlocks: 1 };

    // this.frozenColumnIndex = 0;
    this.toggleMultiSorting = true;
    this.toggleMultilSelect = true;
    this.toggleFilter = true;
    this.multiSelect = { type: 'Multiple' };

    this.columns = [...this.dataColumn];
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.calContentHeight();
    }, 1000);
  }

  calContentHeight() {
    const tableElement: any = document.querySelector('.e-content .e-table');
    if (tableElement?.offsetHeight <= window.innerHeight) {
      if (!this.isTouchScreendevice()) {
        if (this.frozenColumns.length > 0) {
          this.gridBodyHeight = tableElement?.offsetHeight + 15;
          return;
        }
      }
      this.gridBodyHeight = tableElement?.offsetHeight - 5;
    } else {
      this.gridBodyHeight = this.toggleFilter ? window.innerHeight - 100 : window.innerHeight - 60;
    }
  }

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

    // if (!this.isDropMode && args.rowInfo.cellIndex >= 1) {
    //   args.cancel = true;
    // }

    // if (this.isDropMode && args.rowInfo.cellIndex) {
    //   args.cancel = true;
    // }

    if (args.top >= 50) {
      // row
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
      args.element?.classList.remove('showFreezeContext');
    } else {
      if ('movable' === args.column.freezeTable) {
        args.element?.classList.remove('showFreezeContext');
        args.element?.classList.remove('hideFreeze');
      } else if ('frozen-left' === args.column.freezeTable) {
        args.element?.classList.add('hideFreeze');
        args.element?.classList.add('showFreezeContext');
      }
      args.element?.classList.remove('showPasteOption');
    }

    if (this.toggleMultilSelect) {
      args.element?.classList.remove('multil-select-on');
      args.element?.classList.add('multil-select-off');
    } else {
      args.element?.classList.add('multil-select-on');
      args.element?.classList.remove('multil-select-off');
    }

    if (this.toggleFilter) {
      args.element?.classList.remove('filter-on');
      args.element?.classList.add('filter-off');
    } else {
      args.element?.classList.add('filter-on');
      args.element?.classList.remove('filter-off');
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
      this.openColumnModal(contextMenuID.addColumn);
    }

    if (contextID === contextMenuID.editColumn) {
      this.openEditColumnModal(args.column);
    }

    if (contextID === contextMenuID.deleteColumn) {
      if (this.frozenColumns.findIndex((col) => col.field == args.column.field) >= 0) {
        alert("Can't delete frozen column");
        return;
      }

      if (this.getTreeColumnIndex() === args.column.index || 'taskCode' === args.column.field) {
        alert("Can't delete this column");
        return;
      }

      const lastScrollPosition = this.getLastScrollPosition();
      this.dataColumn = [...this.columns];
      this.dataColumn = this.dataColumn.filter((column: any) => column.field !== args.column.field);
      this.columns = [...this.dataColumn];

      this.isLoading = true;
      this.grid?.refresh();
      setTimeout(() => {
        this.isLoading = false;
        this.scrollBackToLastPosition(lastScrollPosition);
      }, 100);
      this.scrollBackToLastPosition(lastScrollPosition);
    }

    if (contextID === contextMenuID.freezeColumn || contextID === contextMenuID.freezeColumnOff) {
      const lastScrollPosition = this.getLastScrollPosition();
      this.freezeColumn(args);
      this.scrollBackToLastPosition(lastScrollPosition);
    }

    if (contextID === contextMenuID.togleFilter) {
      this.toggleFilter = !this.toggleFilter;
      // multil-select-on
      // _contextMenuItems[_contextMenuIndex].text = `Filter Columns ${this.toggleFilter ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];
    }

    if (args.item.id === contextMenuID.multipleSort) {
      // this.openColumnModal(args.item.id, this.columns, this.columnChecked);
      // this.toggleMultiSorting = !this.toggleMultiSorting;
      // _contextMenuItems[_contextMenuIndex].text = `Mutiple Sorting ${this.toggleMultiSorting ? `Off` : `On`}`;
      // this.contextMenuItems = [..._contextMenuItems];
    }

    // change multil select Of/Off
    if (args.item.id === contextMenuID.multiSelect) {
      this.toggleMultilSelect = !this.toggleMultilSelect;
      const item = {
        type: 'checkbox',
        noEditor: true,
        showInColumnChooser: false,
        visible: false,
        isRowSelector: true,
      };
      const dataCols = [...this.dataColumn];

      if (!this.toggleMultilSelect) {
        dataCols.splice(0, 1);
        this.dataColumn = [...dataCols];
        this.multiSelect.type = 'Single';
      } else {
        this.multiSelect.type = 'Multiple';
        if (this.dataColumn[0]['type'] !== 'checkbox') {
          this.dataColumn.splice(0, 0, item);
        }
      }

      this.columns = this.frozenColumns.concat(
        this.dataColumn.filter(
          (col) => this.frozenColumns.findIndex((f_col) => f_col.field == col.field) < 0 || col.isSelectRowCell
        )
      );

      if (this.frozenColumns.length > 0) {
        this.isDropMode = false;
      } else {
        this.isDropMode = true;
      }

      // _contextMenuItems[_contextMenuIndex].text = `Multil-Select ${this.toggleMultilSelect ? `Off` : `On`}`;
      this.contextMenuItems = [..._contextMenuItems];

      this.isLoading = true;
      const lastScrollPosition = this.getLastScrollPosition();
      this.grid?.refresh();
      setTimeout(() => {
        this.isLoading = false;
        this.scrollBackToLastPosition(lastScrollPosition);
      }, 100);
    }
  }

  async openEditColumnModal(column: any) {
    const modalRef = this.modalService.open(ColumnEditorComponent);
    const isColumnHasValue = DataUtils.isColumnHasValue(this.data, column.field);
    modalRef.componentInstance.targetColumn = column;
    modalRef.componentInstance.isColumnHasValue = isColumnHasValue;
    modalRef.componentInstance.closeModal.subscribe(async (resColumn: any) => {
      if (resColumn) {
        const targetColumn = this.dataColumn.find((col) => col.field == column.field);
        const oldDataType = targetColumn.type;
        if (resColumn.type != oldDataType) {
          const parseDataArgs = {
            field: targetColumn.field,
            oldDataType: oldDataType,
            newDataType: resColumn.type,
            defaultValue: resColumn.defaultValue,
          };

          await DataUtils.parseColumnNewDataType(this.data, parseDataArgs).then(() => {
            this.dataWithoutNested = [...DataUtils.getFullRecordWithoutNested(this.data)];
          });
        }

        if (resColumn.type == 'date') {
          resColumn['format'] = 'MM/dd/yyyy';
        }

        if (resColumn.type == 'number') {
          resColumn['format'] = '';
        }

        Object.keys(resColumn).forEach((key) => {
          targetColumn[key] = resColumn[key];
        });

        if (resColumn.type == 'dropdown') {
          this.changeDataWithDropDownItemChange(resColumn.oldDropDownItem, column.field);
        }

        //freecolumn might cause error
        this.columns = this.frozenColumns.concat(
          this.dataColumn.filter(
            (col) => this.frozenColumns.findIndex((f_col) => f_col.field == col.field) < 0 || col.isSelectRowCell
          )
        );

        if (this.frozenColumns.length > 0) {
          this.isDropMode = false;
        } else {
          this.isDropMode = true;
        }

        this.setColumnCssProperties(targetColumn);
        this.isLoading = true;
        this.grid.refresh();
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
      modalRef.close();
    });
  }

  private setColumnCssProperties(column: any) {
    let index = this.dataColumn.findIndex((col: any) => col.field === column.field);
    document.documentElement.style.setProperty(`--color${index}`, column.color);
    document.documentElement.style.setProperty(`--backgroundColor${index}`, column.backgroundColor);
    document.documentElement.style.setProperty(`--fontSize${index}`, `${column.fontSize}px`);
    document.documentElement.style.setProperty(`--textWrap${index}`, column.textWrap);
    if (column.textWrap === 'break-word') {
      document.documentElement.style.setProperty(`--textOverFlow${index}`, `inherit`);
      document.documentElement.style.setProperty(`--whiteSpace${index}`, `inherit`);
      document.documentElement.style.setProperty(`--marginColumn${index}`, `inherit`);
      document.documentElement.style.setProperty(`--heightColumn${index}`, `auto`);
    } else {
      document.documentElement.style.setProperty(`--textOverFlow${index}`, `ellipsis`);
      document.documentElement.style.setProperty(`--whiteSpace${index}`, `nowrap`);
      document.documentElement.style.setProperty(`--marginColumn${index}`, `-7px`);
      document.documentElement.style.setProperty(`--heightColumn${index}`, `25px`);
    }
  }

  freezeColumn(args?: any) {
    this.isLoading = true;

    this.columns.forEach((col) => {
      this.dataColumn.find((d_col) => d_col.field == col.field).visible = col.visible;
    });

    if (args) {
      const column = {
        ...this.dataColumn.find((col) => col.field == args.column.field),
        allowReordering: false,
        showInColumnChooser: false,
      };
      const indexInFrozenColumn = this.frozenColumns.findIndex((col) => col.field == column.field);
      if (indexInFrozenColumn >= 0) {
        this.frozenColumns.splice(indexInFrozenColumn, 1);
      } else {
        this.frozenColumns.push(column);
      }
    } else {
      this.frozenColumns = [];
    }

    this.columns = this.frozenColumns.concat(
      this.dataColumn.filter(
        (col) => this.frozenColumns.findIndex((f_col) => f_col.field == col.field) < 0 || col.isSelectRowCell
      )
    );

    if (this.frozenColumns.length > 0) {
      this.isDropMode = false;
    } else {
      this.isDropMode = true;
    }

    setTimeout(() => {
      this.isLoading = false;
    });
  }

  openAddRowModal(args: any, isPasteAsChild: boolean) {
    const maxId = DataUtils.getMaxId(this.dataWithoutNested);
    const modalRef = this.modalService.open(RowInputModalComponent);
    modalRef.componentInstance.taskID = maxId + 1;
    modalRef.componentInstance.columnSetting = this.grid.getColumns();
    modalRef.componentInstance.closeModal.subscribe((res: any) => {
      if (res) {
        if (isPasteAsChild) {
          this.pasteRow([res], args.rowInfo.rowData, contextMenuID.pasteChild);
        } else {
          this.pasteRow([res], args.rowInfo.rowData, contextMenuID.pasteSibling);
        }
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

  openColumnModal(type: string, column?: any, columnChecked?: any): void {
    const modalRef = this.modalService.open(ComlumnComponent);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.column = column;
    modalRef.componentInstance.columnChecked = columnChecked;
    modalRef.componentInstance.columnEmitter.subscribe((res: any) => {
      if (res) {
        const resColumn = res.event.column;
        switch (res.event.type) {
          case 'add':
            this.addColumn(resColumn);
            console.log(this.dataColumn);
            break;
          case 'mutiple-sorting':
            this.columnChecked = resColumn;

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
        }
      }
      modalRef.close();
    });
  }

  async addColumn(resColumn: any) {
    const newColumn = this.formatNewColumn(resColumn);
    console.log(newColumn);

    if (resColumn.columnType.includes('date')) {
      newColumn['format'] = 'MM/dd/yyyy';
    }
    if (resColumn.columnType.includes('dropdown')) {
      newColumn['dropDownItem'] = resColumn.dropDownItem;
    }
    this.isLoading = true;

    await DataUtils.insertDefaultValueToData(this.data, newColumn.field, newColumn.defaultValue).then(() => {
      this.dataColumn = [...this.columns];
      this.dataColumn.push(newColumn);
      this.columns = [...this.dataColumn];

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });

    this.setColumnCssProperties(newColumn);
    this.grid.refresh();
    // let index = this.dataColumn.findIndex((col: any) => col.field === newColumn.field);
    // console.log(index);
    console.log(this.dataColumn);
    console.log(this.columns);
  }

  private formatNewColumn(resColumn: any) {
    return {
      field: `${resColumn.text.trim()}${this.dataColumn.length}`,
      headerText: resColumn.text,

      type: resColumn.columnType,
      // hasDefaultValue: resColumn.hasDefaultValue,
      defaultValue: resColumn.defaultValue,

      width: 150,
      minWidth: resColumn.minWidth,

      fontSize: resColumn.fontSize,
      textAlign: resColumn.textAlign,
      allowEditing: true,

      color: resColumn.color,
      backgroundColor: resColumn.backgroundColor,
      textWrap: resColumn.textWrap,
      customAttributes: {
        class: `header-column-font${this.multiSelect ? this.dataColumn.length : this.dataColumn.length + 1}`,
      },
    };
  }

  //drop down item of column type == dropdown
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

  rowBound(args: RowDataBoundEventArgs) {
    const taskID: any = args?.data?.['taskID'];
    if (this.selectedRowForCopy.findIndex((item) => item.taskID === taskID) >= 0) {
      // @ts-ignore
      args?.row?.style?.background = '#f8d7da';
    }
  }

  actionBegin(args: any): void {
    if (args.requestType == 'filtering' || args.requestType == 'infiniteScroll') {
      if (args.requestType == 'infiniteScroll') {
        this.loadedRecordCount += this.pageSettings.pageSize;
      }

      this.infiniteOptions = { initialBlocks: this.loadedRecordCount / this.pageSettings.pageSize };
    }
  }

  actionComplete(args: any): void {}

  setLevelForPasting(insertRecords: any[], pasteLevel: number) {
    insertRecords.forEach((rec) => {
      rec['level'] = pasteLevel;
      if (rec.subtasks && rec.subtasks.length) {
        this.setLevelForPasting(rec.subtasks, pasteLevel + 1);
      }
    });
  }

  getTreeColumnIndex() {
    return this.columns.findIndex((col) => col.field == 'taskName');
  }

  getFrozenColumnIndex() {
    const frozenColumnLength = this.frozenColumns.length;
    return frozenColumnLength > 0 ? frozenColumnLength + 1 : 0;
  }

  getLastScrollPosition(): any {
    return this.grid.element.querySelector('.e-gridcontent .e-content')?.scrollTop;
  }

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
