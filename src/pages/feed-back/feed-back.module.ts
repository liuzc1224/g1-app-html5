import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedBackPage } from './feed-back';
import { ShareModule } from '../../app/share/share.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FeedBackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedBackPage),
    ShareModule,
    ComponentsModule
  ],
})
export class FeedBackPageModule { }
