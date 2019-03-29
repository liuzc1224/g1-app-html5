import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanPurposePage } from './loanPurpose';
import { ShareModule } from '../../app/share/share.module';
@NgModule({
  declarations: [
    LoanPurposePage,
  ],
  imports: [
    IonicPageModule.forChild(LoanPurposePage),
    ShareModule
  ],
})
export class LoanPurposeModule {};