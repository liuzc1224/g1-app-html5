import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepayOnlinePage } from './repay-online';
import { ComponentsModule } from '../../components/components.module' ;
import { ShareModule } from '../../app/share/share.module';

@NgModule({
  declarations: [
    RepayOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(RepayOnlinePage),
    ComponentsModule,
    ShareModule
  ],
})
export class RepayOnlinePageModule {}
