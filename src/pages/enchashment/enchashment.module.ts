import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnchashmentPage } from './enchashment';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module' ;

@NgModule({
  declarations: [
    EnchashmentPage,
  ],
  imports: [
    IonicPageModule.forChild(EnchashmentPage), 
    ShareModule ,
    ComponentsModule
  ],
})
export class EnchashmentPageModule {}