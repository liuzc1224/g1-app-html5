import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRewardPage } from './my-reward';

@NgModule({
  declarations: [
    MyRewardPage,
  ],
  imports: [
    IonicPageModule.forChild(MyRewardPage),
  ],
})
export class MyRewardPageModule {}
