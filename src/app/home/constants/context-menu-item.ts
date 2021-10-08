import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ContextMenuItem } from '@syncfusion/ej2-treegrid';

export enum contextTarget {
  column = '.e-headercell',
  row = '.e-rowdragdropcell',
}

export const CONTEXT_MENU_ITEM: ContextMenuItemModel[] | ContextMenuItem[] | any[] = [
  //----------------COLUMN_CONTEXT_MENU_ITEM-----------------------

  { text: 'Show/Hide Column', target: contextTarget.column, id: 'show-hide-column' },
  { text: 'Add', target: contextTarget.column, id: 'add' },
  { text: 'Edit', target: contextTarget.column, id: 'edit' },
  { text: 'Delete', target: contextTarget.column, id: 'delete' },
  { text: 'Multiple sorting off', target: contextTarget.column, id: 'mutiple-sorting' },
  { text: 'Freeze', target: contextTarget.column, id: 'freeze' },
  { text: 'Filter Off', target: contextTarget.column, id: 'filter' },
  { text: 'Styling', target: contextTarget.column, id: 'styling' },

  //----------------ROW_CONTEXT_MENU_ITEM-----------------------

  // { text: 'Copy with headers', target: '.e-content', id: 'copywithheader' },
  // 'AddRow',
  { text: 'Add Row', target: contextTarget.row, id: 'add-row' },
  { text: 'Edit Row', target: contextTarget.row, id: 'edit-row' },
  { text: 'Delete Row', target: contextTarget.row, id: 'delete-row' },

  { text: 'Copy', target: contextTarget.row, id: 'copyrows' },
  { text: 'Cut', target: contextTarget.row, id: 'cut' },
  { text: 'Paste as sibling', target: '.e-rowdragdropcell', id: 'pastesibling' },
  { text: 'Paste as child', target: '.e-rowdragdropcell', id: 'pasteschild' },
  // { text: 'Turn off multi select mode', target: '.e-rowdragdropcell', id: 'multiselect' },

  // 'Copy',
  // 'Edit',
  // 'Delete',
  //  'Save',
  //  'Cancel',
];