import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvestDetailPage } from './invest-detail';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InvestDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InvestDetailPage),
    ShareModule,
    ComponentsModule
  ],
})
export class InvestDetailPageModule {}
