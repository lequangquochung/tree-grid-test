import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import {
  TreeGridModule,
  EditService,
  PageService,
  SortService,
  FilterService,
  ContextMenuService,
  ToolbarService,
} from '@syncfusion/ej2-angular-treegrid';
import { FormsModule } from '@angular/forms';
import { ResizeService, ColumnMenuService } from '@syncfusion/ej2-angular-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, SharedModule, HomeRoutingModule, TreeGridModule],
  declarations: [HomeComponent, ComlumnComponent, SettingsComponent],
  providers: [ContextMenuService, PageService, SortService, FilterService, EditService, ToolbarService, ColumnMenuService],
})
export class HomeModule { }
