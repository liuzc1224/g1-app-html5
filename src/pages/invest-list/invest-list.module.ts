import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvestListPage } from './invest-list';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InvestListPage,
  ],
  imports: [
    IonicPageModule.forChild(InvestListPage),
    ShareModule,
    ComponentsModule
  ],
})
export class InvestListPageModule { }
