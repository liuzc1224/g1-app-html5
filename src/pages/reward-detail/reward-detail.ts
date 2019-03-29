import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RewardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'rewardDetail'
})
@Component({
  selector: 'reward-detail',
  templateUrl: 'reward-detail.html',
})
export class RewardDetailPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.info = this.navParams.get('info')
    console.log(this.info);
  }
  info: any;
  regx: RegExp = /-/g;
  phone: any;
  ionViewDidLoad() {
    // document.title = '优惠券详情';
    if(window.sessionStorage['usrInfo']){
      let usrInfo = JSON.parse(window.sessionStorage['usrInfo']);
      this.phone = usrInfo.phoneNumber;
    };
  }

}
