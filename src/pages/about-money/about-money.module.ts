import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutMoneyPage } from './about-money';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AboutMoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutMoneyPage),
    ShareModule,
    ComponentsModule
  ],
})
export class AboutMoneyPageModule { }
