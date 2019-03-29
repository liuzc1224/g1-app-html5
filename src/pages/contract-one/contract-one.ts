import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { contrOneService } from '../../app/service/contract';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';

/**
 * Generated class for the ContractOnePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "contractOne"
})
@Component({
  selector: 'contract-one',
  templateUrl: 'contract-one.html',
  providers: [contrOneService]
})
export class ContractOnePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contrService: contrOneService,
    private tipSer: TipService,
  ) {
    this.orderId = this.navParams.get('orderId');
    this.cat = this.navParams.get('cat');
    this.couponId = this.navParams.get('couponId');

  }

  orderId: any;
  cat: any;
  couponId: any;

  ionViewDidLoad() {
    // document.title = "Carátula crédito simple son regulación Condusef"
    this.initPage();
  }

  info : Object;

  initPage() {
    let id = this.orderId;
    let par = {};
    par['cat'] = this.cat;
    par['couponId'] = this.couponId;
    this.contrService.getCovers(id, par)
      .subscribe(
        (res: Response) => {
          if (res.success) {
            this.info = res.data;
          }else{
            this.tipSer.fetchFail(res.message);
          }
        }
      )
  }

}
