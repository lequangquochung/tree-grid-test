import { Component, OnInit } from '@angular/core';
import { sampleData } from './home.data';
import { PageSettingsModel, SortSettingsModel } from '@syncfusion/ej2-angular-grids';

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

  constructor() { }

  ngOnInit() {
    this.data = sampleData;
    this.pageSettings = { pageSize: 20 };
    this.sortSettings = { columns: [{ field: 'taskName', direction: 'Ascending' }, { field: 'taskID', direction: 'Descending' }] };
  }
}
