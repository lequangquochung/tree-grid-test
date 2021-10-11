import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgToggleModule } from '@nth-cloud/ng-toggle';
import { SharedModule } from '@shared';
import { ColorPickerModule } from 'ngx-color-picker';
import {
  ColumnMenuService,
  ContextMenuService,
  EditService,
  FilterService,
  InfiniteScrollService,
  PageService,
  SortService,
  ToolbarService,
  TreeGridModule,
  ColumnChooserService,
} from '@syncfusion/ej2-angular-treegrid';
import { ComlumnComponent } from './comlumn/comlumn.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings/settings.component';
import { StylingComponent } from './styling/styling.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { RowAddModalComponent } from './row/row-add-modal/row-add-modal.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RowInputComponent } from './row/row-add-modal/input-component/text-input/text-input.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    HomeRoutingModule,
    TreeGridModule,
    NgToggleModule,
    DropDownListModule,
    ColorPickerModule,
    DatePickerModule,
  ],
  declarations: [
    HomeComponent,
    ComlumnComponent,
    SettingsComponent,
    StylingComponent,
    RowAddModalComponent,
    RowInputComponent,
  ],
  providers: [
    ContextMenuService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    ColumnMenuService,
    PageService,
    InfiniteScrollService,
    ColumnChooserService,
  ],
})
export class HomeModule {}
