import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module' ;
import { CheckCardPage } from './check-card';

@NgModule({
  declarations: [
    CheckCardPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckCardPage),
    ShareModule,
    ComponentsModule
  ],
})
export class CheckCardPageModule {}
