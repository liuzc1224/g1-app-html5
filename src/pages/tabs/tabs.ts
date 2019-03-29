import { Component , OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core'
import { SesssionStorageService } from '../../app/service/common';
@IonicPage({
  name: 'TabsPage'
})
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage{

  tab1Root = 'HomePage';
  tab2Root = 'AboutPage';

  constructor(
    private translate : TranslateService , 
    private sgo : SesssionStorageService
  ) {} ;

  // ngOnInit(){
  //   // let menusInfo = this.sgo.get("menus") ;
  //   this.home = "inicio"
  //   this.mine = "mi cuenta"
  // };
  
  home : string = 'inicio' ;
  mine : string = 'mi cuenta' ;
}