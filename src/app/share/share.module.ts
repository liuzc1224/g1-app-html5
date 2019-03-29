import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SesssionStorageService , LocalStorageService } from '../service/common/storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginInterceptor } from './interceptor.service';
import { ComponentsModule } from '../../components/components.module';
import { EmitService } from '../service/event-emit.service'
import { NumberPipe, TimePipe } from '../../app/pipe/index' ;
import { BankService , LoanService } from '../../app/service/loan'
// service
import {
    TipService,
    ImgService
} from '../service/common';

const commonComponents = [
];

const pipes = [
  NumberPipe,
  TimePipe
];

const services = [
    TipService ,
    SesssionStorageService , 
    LocalStorageService , 
    ImgService ,
    EmitService ,
    BankService ,
    LoanService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule ,
    ComponentsModule
  ],
  declarations: [
    ...commonComponents,
    ...pipes
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...commonComponents,
    ...pipes ,
    TranslateModule,
    ComponentsModule

  ],
  providers: [
    ...services,
    {provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true}
  ]
})
export class ShareModule {
}