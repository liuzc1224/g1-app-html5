import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractOnePage } from './contract-one';

@NgModule({
  declarations: [
    ContractOnePage,
  ],
  imports: [
    IonicPageModule.forChild(ContractOnePage),
  ],
})
export class ContractOnePageModule {}
