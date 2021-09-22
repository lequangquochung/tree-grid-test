import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {
  TreeGridModule,
  EditService,
  ToolbarService,
  PageService,
  SortService,
  FilterService,
} from '@syncfusion/ej2-angular-treegrid';
import { FormsModule } from '@angular/forms';
import { ComlumnComponent } from './comlumn/comlumn.component';
@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, SharedModule, HomeRoutingModule, TreeGridModule],
  declarations: [HomeComponent, ComlumnComponent],
  providers: [PageService, SortService, FilterService, EditService, ToolbarService],
})
export class HomeModule {}
