import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAccountPage } from './user-account';
import { ShareModule } from '../../app/share/share.module';
@NgModule({
  declarations: [
    UserAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAccountPage),
    ShareModule
  ],
})
export class UserAccountPageModule {}
