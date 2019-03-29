import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AboutMoneyService } from '../../app/service/aboutMoney';
import { Response } from '../../app/share/model/response.model';
import { Operator } from '../../../node_modules/rxjs';
import { TipService } from '../../app/service/common';
/**
 * Generated class for the AboutMoneyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'AboutMoney'
})
@Component({
  selector: 'page-about-money',
  templateUrl: 'about-money.html',
  providers: [AboutMoneyService]
})
export class AboutMoneyPage {

  listInfo: Array<object>;

  receiveBankName: any;
  receiveAccount: any;
  receiveClabe: any;
  receiveAccountName: any;
  repayCode: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private AboutMoneyService: AboutMoneyService,
    private TipService: TipService
  ) { }

  ionViewDidLoad() {
    document.title = "sobre reembolso" ;
    this.AboutMoneyService.get()
      .subscribe(
        (res: Response) => {
          if (res.success) {
            this.listInfo = (<Array<object>>res.data["aboutRepaymentVOS"]);
            this.receiveBankName = res.data["receiveBankName"];
            this.receiveAccount = res.data["receiveAccount"];
            this.receiveClabe = res.data["receiveClabe"];
            this.receiveAccountName = res.data["receiveAccountName"];
            this.repayCode = res.data["repayCode"];
          } else {
            this.TipService.fetchFail(res.message);
          }
        }
      )
  }

  copy(txt){
    if (window['JsInterface']) {
      window['JsInterface']['cutText'](txt);
    }
  }
}
