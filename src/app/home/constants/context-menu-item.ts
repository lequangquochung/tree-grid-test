import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ContextMenuItem } from '@syncfusion/ej2-treegrid';

export enum contextTarget {
  column = '.e-headercell',
  row = '.e-content',
}

export const CONTEXT_MENU_ITEM: ContextMenuItemModel[] | ContextMenuItem[] | any[] = [
  //----------------COLUMN_CONTEXT_MENU_ITEM-----------------------

  { text: 'Styling', target: contextTarget.column, id: 'styling' },
  { text: 'Add Column', target: contextTarget.column, id: 'add' },
  { text: 'Delete Column', target: contextTarget.column, id: 'delete' },
  { text: 'Edit Column', target: contextTarget.column, id: 'edit' },
  { text: 'Freeze', target: contextTarget.column, id: 'freeze' },
  { text: 'Show/Hide Column', target: contextTarget.column, id: 'show-hide-column' },
  { text: 'Filter Off', target: contextTarget.column, id: 'filter' },
  { text: 'Multiple sort', target: contextTarget.column, id: 'mutiple-sorting' },

  //----------------ROW_CONTEXT_MENU_ITEM-----------------------

  { text: 'Add Row', target: contextTarget.row, id: 'add-row', iconCss: 'e-icons e-plus' },
  'Edit',
  'Delete',
  // { text: 'Edit Row', target: contextTarget.row, id: 'edit-row', iconCss: 'e-icons e-edit' },
  // { text: 'Delete Row', target: contextTarget.row, id: 'delete-row' },
  // 'AddRow',

  { text: 'Copy', target: contextTarget.row, id: 'copyrows' },
  { text: 'Cut', target: contextTarget.row, id: 'cut' },
  { text: 'Paste as sibling', target: contextTarget.row, id: 'pastesibling' },
  { text: 'Paste as child', target: contextTarget.row, id: 'pasteschild' },
  // { text: 'Turn off multi select mode', target: '.e-rowdragdropcell', id: 'multiselect' },

  // 'Copy',
  // 'Delete',
  //  'Save',
  //  'Cancel',
];
