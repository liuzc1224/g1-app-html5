import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepayRealPage } from './repay-real';
import { ShareModule } from '../../app/share/share.module';

@NgModule({
  declarations: [
    RepayRealPage,
  ],
  imports: [
    IonicPageModule.forChild(RepayRealPage),
    ShareModule
  ],
})
export class RepayRealPageModule {}
