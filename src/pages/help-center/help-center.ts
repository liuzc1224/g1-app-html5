import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpService } from '../../app/service/helpService';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';

/**
 * Generated class for the HelpCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'HelpCenter'
})
@Component({
  selector: 'page-help-center',
  templateUrl: 'help-center.html',
  providers: [HelpService]
})
export class HelpCenterPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private HelpService: HelpService,
    private TipService: TipService
  ) { }

  expanConf: Array<object> = [];

  ionViewDidLoad() {
    this.HelpService.get()
      .subscribe(
        (res: Response) => {
         if (res.success) {
            this.expanConf = (<Array<object>>res.data);
          }else{
            this.TipService.fetchFail(res.message);
          }
        }
      )

      document.title = 'Ayuda' ;
  };

  showPop: boolean = false;
  copyEmail(txt){
    this.showPop = false;
    if (window['JsInterface']) {
      window['JsInterface']['cutText'](txt);
    }
  }

  showPopBtn(){
    this.showPop = true;
  }
}
