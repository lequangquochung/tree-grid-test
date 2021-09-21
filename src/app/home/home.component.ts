import { Component, OnInit } from '@angular/core';
import { sampleData } from './home.data';
import { PageSettingsModel, SortSettingsModel } from '@syncfusion/ej2-angular-grids';
import { TreeGrid, RowDD, Selection, Page, Resize } from '@syncfusion/ej2-treegrid';
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

  public columns: any;
  public dataColumn: any = [
    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: '90' },
    { field: 'taskName', headerText: 'Task Name', textAlign: 'Left', width: '180' },
    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', format: 'yMd', width: '90' },
    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: '80' },
  ];
  constructor() {}

  ngOnInit() {
    // Allow Drag / Drop to change order
    TreeGrid.Inject(RowDD, Selection);

    // Allow Resize column
    TreeGrid.Inject(Page, Resize);

    this.data = sampleData;
    this.columns = [...this.dataColumn];
    this.pageSettings = { pageSize: 20 };
  }
  addColumn(event: any) {
    this.columns = [...this.dataColumn, { field: 'test', headerText: 'test', textAlign: 'Right', width: '80' }];

  }
}
