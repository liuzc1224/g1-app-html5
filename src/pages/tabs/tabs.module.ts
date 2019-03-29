import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    ShareModule,
    ComponentsModule
  ],
})
export class TabsPageModule { }
