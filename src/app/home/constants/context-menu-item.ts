import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ContextMenuItem } from '@syncfusion/ej2-treegrid';

export enum contextTarget {
  column = '.e-headercell',
  row = '.e-content',
}

export enum contextMenuID {
  stylingColumn = 'styling',
  addColumn = 'add',
  deleteColumn = 'delete',
  editColumn = 'edit',
  freezeColumn = 'freeze',
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
  { text: 'Show/Hide Column', target: contextTarget.column, id: contextMenuID.toggleShowColumn },
  { text: 'Freeze Columns', target: contextTarget.column, id: contextMenuID.freezeColumn, iconCss: 'e-icons e-edit' },
  {
    text: 'Filter Columns Off',
    target: contextTarget.column,
    id: contextMenuID.togleFilter,
    iconCss: 'e-icons e-edit',
  },
  //----------------ROW_CONTEXT_MENU_ITEM-----------------------

  { text: 'Add Next', target: contextTarget.row, id: contextMenuID.addRow, iconCss: 'e-icons e-edit' },
  { text: 'Add Child', target: contextTarget.row, id: contextMenuID.addChildRow, iconCss: 'e-icons e-edit' },
  { text: 'Delete Row', target: contextTarget.row, id: contextMenuID.deleteRow, iconCss: 'e-icons e-edit' },
  { text: 'Edit Row', target: contextTarget.row, id: contextMenuID.editRow, iconCss: 'e-icons e-edit' },
  // 'Edit',
  { text: 'Copy', target: contextTarget.row, id: contextMenuID.copyRows },
  { text: 'Cut', target: contextTarget.row, id: contextMenuID.cutRows },
  { text: 'Paste next', target: contextTarget.row, id: contextMenuID.pasteSibling },
  { text: 'Paste as child', target: contextTarget.row, id: contextMenuID.pasteChild },
  { text: 'Drag and drop', target: contextTarget.row, id: contextMenuID.dragAndDrop },
];
