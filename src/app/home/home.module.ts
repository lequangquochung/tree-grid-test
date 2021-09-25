import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgToggleModule } from '@nth-cloud/ng-toggle';
import { SharedModule } from '@shared';
import {
  ColumnMenuService, ContextMenuService, EditService, FilterService, PageService,
  SortService, ToolbarService, TreeGridModule
} from '@syncfusion/ej2-angular-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    HomeRoutingModule,
    TreeGridModule,
    NgToggleModule,
  ],
  declarations: [HomeComponent, ComlumnComponent, SettingsComponent],
  providers: [
    ContextMenuService,
    PageService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    ColumnMenuService,
  ],
})
export class HomeModule { }
