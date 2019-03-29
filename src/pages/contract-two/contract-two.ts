import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { contrOneService } from '../../app/service/contract';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';

/**
 * Generated class for the ContractTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'contractTwo'
})
@Component({
  selector: 'contract-two',
  templateUrl: 'contract-two.html',
  providers: [contrOneService],
})
export class ContractTwoPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contrService: contrOneService,
    private tipSer: TipService,
  ) {
    this.orderId = this.navParams.get('orderId');
    this.couponId = this.navParams.get('couponId');
   }

  orderId: any;
  couponId: any;

  ionViewDidLoad() {
    // document.title = "偿还表"
    this.initPage();
  }

  info : Object ;

  initPage(){
    let id = this.orderId ;
    let parm = {};
    if (this.couponId) {
      parm['couponId'] = this.couponId
    }
    this.contrService.getPayback(id, parm)
      .subscribe(
        ( res : Response ) => {
          if (res.success) {
            this.info = res.data;
          } else {
            this.tipSer.fetchFail(res.message)
          }
        }
      )
  }

}
