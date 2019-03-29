import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
    ShareModule,
    ComponentsModule
  ],
})
export class AboutPageModule { }
