import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ContextMenuItem } from '@syncfusion/ej2-treegrid';

export enum contextTarget {
  column = '.e-columnheader',
  row = '.e-content',
  freezeColumn = '.e-frozenheader .e-columnheader',
}

export enum contextMenuID {
  stylingColumn = 'styling',
  addColumn = 'add',
  deleteColumn = 'delete',
  editColumn = 'edit',
  freezeColumn = 'freeze',
  freezeColumnOff = 'freezeOff',
  toggleShowColumn = 'show-hide-column',
  togleFilter = 'filter',
  multipleSort = 'mutiple-sorting',

  addRow = 'add-row',
  editRow = 'edit-row',
  addChildRow = 'add-child-row',
  deleteRow = 'delete-row',
  copyRows = 'copyrows',
  cutRows = 'cutrows',
  pasteSibling = 'pastesibling',
  pasteChild = 'pasteschild',
  dragAndDrop = 'dragAndDrop',
  multilSelectRow = 'multilSelectRow',
  multiSelect = 'multiSelect',
}

export const CONTEXT_MENU_ITEM: ContextMenuItemModel[] | ContextMenuItem[] | any[] = [
  //----------------COLUMN_CONTEXT_MENU_ITEM-----------------------

  { text: 'NewCol', target: contextTarget.column, id: contextMenuID.addColumn },
  { text: 'DelCol', target: contextTarget.column, id: contextMenuID.deleteColumn },
  { text: 'EditCol', target: contextTarget.column, id: contextMenuID.editColumn, iconCss: 'e-icons e-edit' },
  {
    text: 'ChooseCol',
    target: contextTarget.column,
    id: contextMenuID.toggleShowColumn,
    // iconCss: 'e-icons e-show-hide-panel',
  },
  {
    text: 'FreezeCol',
    target: contextTarget.column,
    id: contextMenuID.freezeColumn,
    // iconCss: 'e-icons e-hide-headings',
  },
  {
    text: 'FreezeCol',
    target: contextTarget.column,
    id: contextMenuID.freezeColumnOff,
    // iconCss: 'e-icons e-hide-headings',
  },
  {
    text: 'FilterCol',
    target: contextTarget.column,
    id: contextMenuID.togleFilter,
    // iconCss: 'e-icons e-filter-clear',
  },
  {
    text: 'MultiSort',
    target: contextTarget.column,
    id: contextMenuID.multipleSort,
    // iconCss: 'e-icons e-filter-clear',
  },
  //----------------ROW_CONTEXT_MENU_ITEM-----------------------

  { text: 'AddNext', target: contextTarget.row, id: contextMenuID.addRow },
  { text: 'AddChild', target: contextTarget.row, id: contextMenuID.addChildRow },
  { text: 'DelRow', target: contextTarget.row, id: contextMenuID.deleteRow },
  { text: 'EditRow', target: contextTarget.row, id: contextMenuID.editRow, iconCss: 'e-icons e-edit' },
  // 'Edit',
  { text: 'CopyRows', target: contextTarget.row, id: contextMenuID.copyRows },
  { text: 'CutRows', target: contextTarget.row, id: contextMenuID.cutRows },
  { text: 'PasteNext', target: contextTarget.row, id: contextMenuID.pasteSibling },
  { text: 'PasteChild', target: contextTarget.row, id: contextMenuID.pasteChild },
  { text: 'MultiSelect', target: contextTarget.row, id: contextMenuID.multiSelect, type: 'checkbox' },
  { text: 'Drag and drop', target: contextTarget.row, id: contextMenuID.dragAndDrop },
];
