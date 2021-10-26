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
}

export const CONTEXT_MENU_ITEM: ContextMenuItemModel[] | ContextMenuItem[] | any[] = [
  //----------------COLUMN_CONTEXT_MENU_ITEM-----------------------

  // { text: 'Style', target: contextTarget.column, id: contextMenuID.stylingColumn },
  { text: 'Add Column', target: contextTarget.column, id: contextMenuID.addColumn },
  { text: 'Delete Column', target: contextTarget.column, id: contextMenuID.deleteColumn },
  { text: 'Edit Column', target: contextTarget.column, id: contextMenuID.editColumn },
  {
    text: 'Show/Hide Column',
    target: contextTarget.column,
    id: contextMenuID.toggleShowColumn,
    iconCss: 'e-icons e-show-hide-panel',
  },
  {
    text: 'Freeze Columns',
    target: contextTarget.column,
    id: contextMenuID.freezeColumn,
    iconCss: 'e-icons e-hide-headings',
  },
  {
    text: 'Freeze Columns Off',
    target: contextTarget.column,
    id: contextMenuID.freezeColumnOff,
    iconCss: 'e-icons e-hide-headings',
  },
  {
    text: 'Filter Columns Off',
    target: contextTarget.column,
    id: contextMenuID.togleFilter,
    iconCss: 'e-icons e-filter-clear',
  },

  //----------------ROW_CONTEXT_MENU_ITEM-----------------------

  { text: 'Add Next', target: contextTarget.row, id: contextMenuID.addRow, iconCss: 'e-icons e-plus' },
  { text: 'Add Child', target: contextTarget.row, id: contextMenuID.addChildRow, iconCss: 'e-icons e-circle-add' },
  { text: 'Delete Row', target: contextTarget.row, id: contextMenuID.deleteRow, iconCss: 'e-icons e-trash' },
  { text: 'Edit Row', target: contextTarget.row, id: contextMenuID.editRow, iconCss: 'e-icons e-edit' },
  // 'Edit',
  { text: 'Copy', target: contextTarget.row, id: contextMenuID.copyRows },
  { text: 'Cut', target: contextTarget.row, id: contextMenuID.cutRows },
  { text: 'Paste next', target: contextTarget.row, id: contextMenuID.pasteSibling },
  { text: 'Paste as child', target: contextTarget.row, id: contextMenuID.pasteChild },
  { text: 'Drag and drop', target: contextTarget.row, id: contextMenuID.dragAndDrop },
];
