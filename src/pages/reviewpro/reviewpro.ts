import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-reviewpro',
  templateUrl: 'reviewpro.html'
})
export class ReviewproPage {

  constructor(
    public navCtrl: NavController,
    public translate : TranslateService ,
  ){};

  ionViewDidLoad(){
    if(window['JsInterface']){
      window['JsInterface']['isOver']("true");
    };
  }

  backToindex(){
    this.navCtrl.popToRoot() ;

    if(window['JsInterface']){

      window['JsInterface']['backToIndex']("true");
    };
    
  };
};