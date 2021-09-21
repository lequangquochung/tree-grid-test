import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { PageService, SortService, FilterService } from '@syncfusion/ej2-angular-treegrid';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, HomeRoutingModule, TreeGridModule],
  declarations: [HomeComponent],
  providers: [PageService, SortService, FilterService],
})
export class HomeModule {}
