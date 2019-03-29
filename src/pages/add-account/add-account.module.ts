import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAccountPage } from './add-account';
import { ShareModule } from '../../app/share/share.module';

@NgModule({
  declarations: [
    AddAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAccountPage),
    ShareModule
  ],
})
export class AddAccountPageModule {}
