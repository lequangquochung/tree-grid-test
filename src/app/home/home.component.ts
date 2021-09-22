import { Component, OnInit, ViewChild } from '@angular/core';
import { sampleData } from './home.data';
import {
  PageSettingsModel,
  SortSettingsModel,
  EditSettingsModel,
  ToolbarItems,
  CommandModel,
  ContextMenuItem,
  ContextMenuService,
  GridComponent,
  ContextMenuItemModel,
} from '@syncfusion/ej2-angular-grids';
import { TreeGrid, RowDD, Selection, Page, Resize, Reorder } from '@syncfusion/ej2-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  public data = <any>[];
  public pageSettings: PageSettingsModel | undefined;
  public sortSettings: SortSettingsModel | undefined;
  public editSettings: EditSettingsModel | undefined;
  public toolbarOptions: ToolbarItems[] | undefined;
  public commands: CommandModel | undefined;

  // public contextMenuItems: ContextMenuItem[] = ['Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage','LastPage', 'NextPage'];
  public contextMenuItems: any = [
    { text: 'Copy with headers', target: '.e-content', id: 'copywithheader' },
    'Copy',
    { text: 'Cut', target: '.e-content', id: 'cut' },
    { text: 'Paste as sibling', target: '.e-content', id: 'pastesibling' },
    { text: 'Paste as child', target: '.e-content', id: 'pasteschild' },
    { text: 'Turn on / off multi select mode', target: '.e-content', id: 'multiselect'},
    'Edit', 'Delete', 'Save', 'Cancel'
  ];
  @ViewChild('grid') public grid: GridComponent | undefined;

  public columns: any;
  public dataColumn: any = [
    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: '90' },
    { field: 'taskName', headerText: 'Task Name', textAlign: 'Left', width: '180' },
    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', format: 'yMd', width: '90' },
    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: '80' },
  ];

  ngOnInit() {
    // Allow Drag / Drop to change order row
    TreeGrid.Inject(RowDD, Selection);

    // Allow Drag / Drop to change order column
    TreeGrid.Inject(Reorder, Page);

    // Allow Resize column
    TreeGrid.Inject(Page, Resize);


    this.data = sampleData;
    this.columns = [...this.dataColumn];
    this.pageSettings = { pageSize: 20 };
    // @ts-ignore
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    this.toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    // @ts-ignore
    this.commands = [
      { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
      { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
      { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
      { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } },
    ];
  }

  updateColumns(newColumns: any) {
    this.dataColumn = this.columns = newColumns;
  }

  contextMenuClick(args: MenuEventArgs): void {
    if (args?.item?.id === 'copywithheader') {
      this.grid?.copy(true);
    }
    return;
  }
}
